import { Link } from "react-router-dom";

function Inbox() {

  const messages = [
    {
      id: 1,
      name: "Sarah",
      username: "@sarah",
      profile: "https://i.pravatar.cc/150?img=47",
      message: "Hey, are you coming tomorrow?",
      time: "2:34 PM",
      unread: true
    },
    {
      id: 2,
      name: "David",
      username: "@david",
      profile: "https://i.pravatar.cc/150?img=12",
      message: "I sent you the files.",
      time: "Yesterday",
      unread: false
    },
    {
      id: 3,
      name: "Jessica",
      username: "@jessica",
      profile: "https://i.pravatar.cc/150?img=32",
      message: "That post was actually really nice.",
      time: "Monday",
      unread: true
    },
    {
      id: 4,
      name: "Michael",
      username: "@michael",
      profile: "https://i.pravatar.cc/150?img=11",
      message: "Let's talk later.",
      time: "Sunday",
      unread: false
    }
  ];

  return (
    <section id="inbox_pg">

      <header className="inbox_header">
        <h1>Inbox</h1>
      </header>

      <div className="messages" >

        {messages.map((message) => {

          const messageContent = (
            <>
              <img
                 onClick={() => location.assign("/en/chat")}
                src={message.profile}
                alt={message.name}
              />

              <div className="message_content">
                <div className="message_top">
                  <h3>{message.name}</h3>
                  <span>{message.time}</span>
                </div>

                <p>{message.message}</p>
              </div>

              {message.unread && (
                <span className="unread_dot"></span>
              )}
            </>
          );

          return message.id === 1 ? (
            <Link
              to=""
              className="message_link"
              key={message.id}
            >
              <article
                className={`message ${message.unread ? "unread" : ""}`}
              >
                {messageContent}
              </article>
            </Link>
          ) : (
            <article
              className={`message ${message.unread ? "unread" : ""}`}
              key={message.id}
            >
              {messageContent}
            </article>
          );
        })}

      </div>

    </section>
  );
}

export default Inbox;