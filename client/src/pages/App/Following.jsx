function Following() {

  const following = [
    {
      id: 1,
      username: "maria",
      name: "Maria",
      profile: "https://i.pravatar.cc/150?img=47",
      posts: [
        {
          id: 1,
          image: "https://picsum.photos/700/500?random=1",
          caption: "A little moment from today."
        },
        {
          id: 2,
          image: "https://picsum.photos/700/500?random=2",
          caption: "Weekend adventures."
        }
      ]
    },
    {
      id: 2,
      username: "josh",
      name: "Josh",
      profile: "https://i.pravatar.cc/150?img=12",
      posts: [
        {
          id: 3,
          image: "https://picsum.photos/700/500?random=3",
          caption: "Working on something new."
        }
      ]
    }
  ];

  return (
    <section id="following_pg">

      {following.length === 0 ? (

        <div className="recommended_people">

          <h2>People you might like</h2>

          <div className="people_grid">

            <article>
              <img
                src="https://i.pravatar.cc/150?img=5"
                alt=""
              />

              <h3>Sarah</h3>
              <p>@sarah</p>

              <button>Follow</button>
            </article>

            <article>
              <img
                src="https://i.pravatar.cc/150?img=8"
                alt=""
              />

              <h3>David</h3>
              <p>@david</p>

              <button>Follow</button>
            </article>

            <article>
              <img
                src="https://i.pravatar.cc/150?img=32"
                alt=""
              />

              <h3>Jessica</h3>
              <p>@jessica</p>

              <button>Follow</button>
            </article>

          </div>

        </div>

      ) : (

        <div className="following_feed">

          {following.map((person) => (

            <div className="user_feed" key={person.id}>

              <div className="user_info">
                <img src={person.profile} alt="" />

                <div>
                  <h3>{person.name}</h3>
                  <p>@{person.username}</p>
                </div>
              </div>

              {person.posts.map((post) => (

                <article key={post.id}>

                  <img
                    src={post.image}
                    alt=""
                  />

                  <div>
                    <p>{post.caption}</p>
                  </div>

                </article>

              ))}

            </div>

          ))}

        </div>

      )}

    </section>
  );
}

export default Following;