import pool from "../config/db.js";
import { uploadToS3 } from "../utils/uploadToS3.js";

export async function createPost(req, res) {
  const userId = req.user.id;

  const { caption, subcaption } = req.body;

  try {
    // Make sure a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "A photo or video is required",
      });
    }

    // Upload media to S3
    const mediaKey = await uploadToS3(
      req.file,
      `posts/${userId}`
    );

    // Determine whether the uploaded file is an image or video
    const mediaType = req.file.mimetype.startsWith("video")
      ? "video"
      : "image";

    // Create the post
    const result = await pool.query(
      `INSERT INTO posts (
        user_id,
        caption,
        subcaption,
        media_key,
        media_type
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        userId,
        caption || null,
        subcaption || null,
        mediaKey,
        mediaType,
      ]
    );

    return res.status(201).json({
      message: "Post created successfully",
      post: result.rows[0],
    });

  } catch (error) {
    console.error("Create post error:", error);

    return res.status(500).json({
      message: "Something went wrong while creating the post",
    });
  }
}

export async function getPosts(req, res) {
  try {
    const result = await pool.query(
      `SELECT
        posts.id,
        posts.caption,
        posts.subcaption,
        posts.media_key,
        posts.media_type,
        posts.likes_count,
        posts.created_at,

        profiles.username,
        profiles.profile_picture

       FROM posts

       JOIN profiles
         ON profiles.user_id = posts.user_id

       ORDER BY posts.created_at DESC`
    );

    const posts = result.rows.map((post) => ({
      id: post.id,

      username: `@${post.username}`,

      profile: post.profile_picture,

      title: post.caption,

      subtitle: post.subcaption,

      mediaType: post.media_type,

      mediaUrl: post.media_key,

      likesCount: post.likes_count,
    }));

    return res.status(200).json({
      posts,
    });

  } catch (error) {
    console.error("Get posts error:", error);

    return res.status(500).json({
      message: "Something went wrong while getting posts",
    });
  }
}

export async function getUserPosts(req, res) {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT
        posts.id,
        posts.caption,
        posts.subcaption,
        posts.media_key,
        posts.media_type,
        posts.likes_count,
        posts.created_at,

        profiles.username,
        profiles.profile_picture

       FROM posts

       JOIN profiles
         ON profiles.user_id = posts.user_id

       WHERE posts.user_id = $1

       ORDER BY posts.created_at DESC`,
      [userId]
    );

    const posts = result.rows.map((post) => ({
      id: post.id,

      username: `@${post.username}`,

      profile: post.profile_picture,

      title: post.caption,

      subtitle: post.subcaption,

      mediaType: post.media_type,

      mediaUrl: post.media_key,

      likesCount: post.likes_count,

      createdAt: post.created_at,
    }));

    return res.status(200).json({
      posts,
    });

  } catch (error) {
    console.error("Get user posts error:", error);

    return res.status(500).json({
      message: "Something went wrong while getting user posts",
    });
  }
}