import { useState } from 'react'

function Chat() {

  const [message, setMessage] = useState("")

  const user = {
    name: "Sarah",
    username: "@sarah",
    profile: "https://i.pravatar.cc/150?img=47"
  }

  const messages = [
    {
      id: 1,
      sender: "them",
      text: "Hey! How are you doing?",
      time: "2:30 PM"
    },
    {
      id: 2,
      sender: "me",
      text: "I'm good! How about you?",
      time: "2:31 PM"
    },
    {
      id: 3,
      sender: "them",
      text: "I'm doing good too.",
      time: "2:32 PM"
    },
    {
      id: 4,
      sender: "them",
      text: "Are you coming tomorrow?",
      time: "2:34 PM"
    },
    {
      id: 5,
      sender: "me",
      text: "Yeah, I should be there.",
      time: "2:35 PM"
    }
  ]

  function handleSubmit(e) {
    e.preventDefault()

    if (!message.trim()) return

    console.log(message)

    setMessage("")
  }

  return (
    <section id="chat_pg">

      {/* CHAT HEADER */}

      <header className="chat_header">

        <img
          src={user.profile}
          alt={user.name}
        />

        <div>
          <h2>{user.name}</h2>
          <p>{user.username}</p>
        </div>

      </header>


      {/* MESSAGES */}

      <div className="chat_messages">

        {messages.map((message) => (

          <div
            key={message.id}
            className={`chat_message ${message.sender}`}
          >

            <p>{message.text}</p>
            <span>{message.time}</span>

          </div>

        ))}

      </div>


      {/* MESSAGE INPUT */}

      <form
        className="chat_input"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit">
          Send
        </button>

      </form>

    </section>
  )
}

export default Chat