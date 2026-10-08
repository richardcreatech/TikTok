import pool from "../config/db.js";
import { uploadToS3 } from "../utils/uploadToS3.js";

export async function getMe(req, res) {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT
        users.id,
        users.email,
        profiles.username,
        profiles.name,
        profiles.bio,
        profiles.profile_picture
       FROM users
       JOIN profiles
         ON profiles.user_id = users.id
       WHERE users.id = $1`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    return res.status(200).json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

export async function updateMe(req, res) {
  const userId = req.user.id;

  const { name, username, bio } = req.body;

  try {
    // Update account name
    if (name !== undefined) {
      await pool.query(
        `UPDATE users
   SET name = $1,
       updated_at = CURRENT_TIMESTAMP
   WHERE id = $2`,
        [name, userId],
      );

      await pool.query(
        `UPDATE profiles
   SET name = $1,
       updated_at = CURRENT_TIMESTAMP
   WHERE user_id = $2`,
        [name, userId],
      );
    }

    // Update profile information
    if (username !== undefined || bio !== undefined || req.file) {
      let profilePicture;

      if (req.file) {
        profilePicture = await uploadToS3(req.file, `profiles/${userId}`);
      }

      await pool.query(
        `UPDATE profiles
         SET username = COALESCE($1, username),
             bio = COALESCE($2, bio),
             profile_picture = COALESCE($3, profile_picture),
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $4`,
        [username, bio, profilePicture, userId],
      );
    }

    return res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}
