import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";


function Channel() {
  const { userId } = useParams();

  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    async function loadMessages() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/messages/${userId}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(data.message);
          return;
        }

        setCurrentUser(data.user);
        setOtherUser(data.otherUser);
        setMessages(data.messages);
      } catch (error) {
        console.error(error);
      }
    }

    loadMessages();
  }, [userId]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!text.trim()) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/messages/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            text,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        data.message,
      ]);

      setText("");
    } catch (error) {
      console.error(error);
    }
  }

  if (!currentUser || !otherUser) {
    return <p>Loading conversation...</p>;
  }

  return (
    <main>
      <h1>Conversation with {otherUser.username}</h1>

      <section>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((message) => (
            <div key={message.id}>
              <strong>
                {message.senderId === currentUser.id
                  ? "You"
                  : otherUser.username}
              </strong>

              <p>{message.text}</p>
            </div>
          ))
        )}
      </section>

      <form onSubmit={handleSubmit}>
        <input type="text" value={text} onChange={(event) => setText(event.target.value)} placeholder={`Message ${otherUser.username}`}/>
        <button type="submit">Send</button>
      </form>

      <Link to="/">Back to Home</Link>
    </main>
  );
}

export default Channel;