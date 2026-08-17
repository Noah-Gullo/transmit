import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Channel() {
  const { userId } = useParams();

  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMessages() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/messages/${userId}`,
          {
            credentials: "include",
          }
        );

        if (response.status === 401) {
          setError(
            "You must be logged in to view this conversation."
          );
          return;
        }

        if (response.status === 404) {
          setError("User not found.");
          return;
        }

        if (!response.ok) {
          setError("Could not load conversation.");
          return;
        }

        const data = await response.json();

        setCurrentUser(data.user);
        setOtherUser(data.otherUser);
        setMessages(data.messages);
      } catch (error) {
        console.error(
          "Could not load messages:",
          error
        );

        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, [userId]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!text.trim()) {
      return;
    }

    setError("");

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

      if (response.status === 401) {
        setError("You are not logged in.");
        return;
      }

      if (response.status === 404) {
        setError("User not found.");
        return;
      }

      if (!response.ok) {
        setError("Could not send message.");
        return;
      }

      const data = await response.json();

      setMessages((previousMessages) => [
        ...previousMessages,
        data.message,
      ]);

      setText("");
    } catch (error) {
      console.error(
        "Could not send message:",
        error
      );

      setError("Could not connect to server.");
    }
  }

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error && !otherUser) {
    return (
      <main className="page">
        <div className="error-card">
          <p className="error-message">
            {error}
          </p>

          <Link
            to="/dashboard"
            className="button-link"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (!currentUser || !otherUser) {
    return (
      <main className="page">
        <div className="error-card">
          <p className="error-message">
            Could not load conversation.
          </p>

          <Link
            to="/dashboard"
            className="button-link"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="chat-container">

        <header className="chat-header">
          <div>
            <Link
              to="/dashboard"
              className="back-link"
            >
              ← Dashboard
            </Link>

            <h1>
              {otherUser.displayName ||
                `@${otherUser.username}`}
            </h1>

            {otherUser.displayName && (
              <p className="username">
                @{otherUser.username}
              </p>
            )}

            {otherUser.status && (
              <p className="status">
                {otherUser.status}
              </p>
            )}
          </div>

          <Link
            to={`/users/${otherUser.id}`}
            className="secondary-link"
          >
            View Profile
          </Link>
        </header>

        <section className="messages">
          {messages.length === 0 ? (
            <p className="empty-state">
              No messages yet. Start the conversation.
            </p>
          ) : (
            messages.map((message) => {
              const sentByMe =
                message.senderId === currentUser.id;

              return (
                <div
                  key={message.id}
                  className={
                    sentByMe
                      ? "message-row message-row-me"
                      : "message-row"
                  }
                >
                  <article
                    className={
                      sentByMe
                        ? "message-bubble message-bubble-me"
                        : "message-bubble"
                    }
                  >
                    <strong>
                      {sentByMe
                        ? "You"
                        : otherUser.displayName ||
                          `@${otherUser.username}`}
                    </strong>

                    <p>
                      {message.text}
                    </p>
                  </article>
                </div>
              );
            })
          )}
        </section>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <form
          className="message-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={text}
            onChange={(event) =>
              setText(event.target.value)
            }
            placeholder={`Message ${
              otherUser.displayName ||
              `@${otherUser.username}`
            }`}
          />

          <button type="submit">
            Send
          </button>
        </form>

      </div>
    </main>
  );
}

export default Channel;