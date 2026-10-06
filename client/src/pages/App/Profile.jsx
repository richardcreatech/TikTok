function Profile() {
  const user = {
    name: "Richard",
    username: "@richard",
    profile: "https://i.pinimg.com/1200x/2c/b9/37/2cb937b15158720ddb7be0ed57caaf6f.jpg",
    bio: "Building things, learning things.",
    followers: 128,
    following: 64,
    posts: [
      {
        id: 1,
        image: "https://picsum.photos/500/500?random=1",
      },
      {
        id: 2,
        image: "https://picsum.photos/500/500?random=2",
      },
      {
        id: 3,
        image: "https://picsum.photos/500/500?random=3",
      },
      {
        id: 4,
        image: "https://picsum.photos/500/500?random=4",
      },
      {
        id: 5,
        image: "https://picsum.photos/500/500?random=5",
      },
      {
        id: 6,
        image: "https://picsum.photos/500/500?random=6",
      },
    ],
  }

  return (
    <section id="profile_pg">

      <header className="profile_header">

        <img
          src={user.profile}
          alt={`${user.name}'s profile`}
          className="profile_image"
        />

        <div className="profile_details">

          <div className="profile_name">
            <h1>{user.name}</h1>
            <p>{user.username}</p>
          </div>

          <p className="profile_bio">
            {user.bio}
          </p>

          <div className="profile_stats">
            <span>
              <strong>{user.posts.length}</strong> posts
            </span>

            <span>
              <strong>{user.followers}</strong> followers
            </span>

            <span>
              <strong>{user.following}</strong> following
            </span>
          </div>

          <button className="edit_profile">
            Edit Profile
          </button>

        </div>

      </header>

      <div className="profile_posts">
        {user.posts.map((post) => (
          <article key={post.id}>
            <img src={post.image} alt="" />
          </article>
        ))}
      </div>

    </section>
  )
}

export default Profile