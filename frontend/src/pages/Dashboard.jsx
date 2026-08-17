import { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/messages",
          {
            credentials: "include",
          }
        );

        if (response.status === 401) {
          setUser(null);
          return;
        }

        const data = await response.json();

        setUser(data.user);
        setMessages(data.messages);
      } catch (error) {
        console.error("Could not load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function handleLogout() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        setUser(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <main>
        <h1>Not logged in</h1>
        <p>Please log in to view your dashboard.</p>
      </main>
    );
  }

  return (
    <main>
      <header>
        <h1>Dashboard</h1>

        <div>
          <p>Welcome, {user.username}</p>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <section>
        <h2>Your Messages</h2>

        {messages.length === 0 ? (
          <p>You have no messages.</p>
        ) : (
          <ul>
            {messages.map((message) => (
              <li key={message.id}>
                <p>{message.text}</p>

                <small>
                  {message.senderId === user.id
                    ? "Sent by you"
                    : "Received"}
                </small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default Dashboard;