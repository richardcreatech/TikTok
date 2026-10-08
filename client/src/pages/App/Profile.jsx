import { useEffect, useState } from "react";

import API_URL from "../../api/my_api_url";

import EditProfile from "../../components/EditProfile";

function Profile() {

  const [user, setUser] = useState(null);

  const [posts, setPosts] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const [refreshVersion, setRefreshVersion] = useState(0);

  const [postsLoading, setPostsLoading] = useState(true);


  const hardcodedData = {
    followers: 128,
    following: 64,
  };


  useEffect(() => {

    async function getUser() {

      try {

        const response = await fetch(
          `${API_URL}/api/me`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(data.message);
          return;
        }

        setUser(data.user);

      } catch (error) {

        console.error(
          "Error getting profile:",
          error
        );

      }

    }

    getUser();

  }, [refreshVersion]);


  useEffect(() => {

    async function getUserPosts() {

      if (!user) return;

      try {

        const response = await fetch(
          `${API_URL}/api/posts/user/${user.id}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(data.message);
          return;
        }

        setPosts(data.posts);

      } catch (error) {

        console.error(
          "Error getting user posts:",
          error
        );

      } finally {

        setPostsLoading(false);

      }

    }

    getUserPosts();

  }, [user]);


  if (!user) {

    return <p>Loading profile...</p>;

  }


  return (

    <section id="profile_pg">

      <header className="profile_header">

        <img
          src={user.profile_picture}
          alt={`${user.name}'s profile`}
          className="profile_image"
        />

        <div className="profile_details">

          <div className="profile_name">

            <h1>
              {user.name}
            </h1>

            <p>
              @{user.username}
            </p>

          </div>


          <p className="profile_bio">

            {user.bio || "No bio yet."}

          </p>


          <div className="profile_stats">

            <span>
              <strong>
                {posts.length}
              </strong>{" "}
              posts
            </span>

            <span>
              <strong>
                {hardcodedData.followers}
              </strong>{" "}
              followers
            </span>

            <span>
              <strong>
                {hardcodedData.following}
              </strong>{" "}
              following
            </span>

          </div>


          <button
            type="button"
            className="edit_profile"
            onClick={() =>
              setIsEditing(true)
            }
          >
            Edit Profile
          </button>

        </div>

      </header>


      <div className="profile_posts">

        {postsLoading ? (

          <p>Loading posts...</p>

        ) : posts.length === 0 ? (

          <p>No posts yet.</p>

        ) : (

          posts.map((post) => (

            <article
              key={post.id}
              className="profile_post"
            >

              {post.mediaType === "video" ? (

                <video
                  src={post.mediaUrl}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="profile_post_media"
                />

              ) : (

                <img
                  src={post.mediaUrl}
                  alt={post.title || "Post"}
                  className="profile_post_media"
                />

              )}

            </article>

          ))

        )}

      </div>


      {isEditing && (

        <EditProfile
          user={user}
          onClose={() =>
            setIsEditing(false)
          }
          onUpdated={() =>
            setRefreshVersion(
              (version) => version + 1
            )
          }
        />

      )}

    </section>

  );

}

export default Profile;