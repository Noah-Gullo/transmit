import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/users",
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
        setUsers(data.users);
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
        setUsers([]);
        navigate("/login");
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

        <Link to="/login">Login</Link>
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
        <h2>Users</h2>

        {users.length === 0 ? (
          <p>No other users found.</p>
        ) : (
          <ul>
            {users.map((otherUser) => (
              <li key={otherUser.id}>
                <Link to={`/messages/${otherUser.id}`}>
                  {otherUser.username}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default Dashboard;