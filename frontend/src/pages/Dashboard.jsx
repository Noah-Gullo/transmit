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
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(
          `${API_URL}/api/users`,
          {
            credentials: "include",
          }
        );

        if (response.status === 401) {
          setUser(null);
          return;
        }

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setUser(data.user);
        setUsers(data.users);
      } catch (error) {
        console.error(
          "Could not load dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function handleLogout() {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${API_URL}/api/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (!user) {
    return (
      <main className="page">
        <div className="error-card">
          <h1>Not Logged In</h1>

          <p className="error-message">
            Please log in to view your dashboard.
          </p>

          <Link
            to="/login"
            className="button-link"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>

            <p>
              Welcome,{" "}
              <strong>
                {user.displayName || user.username}
              </strong>
            </p>
          </div>

          <nav className="nav">
            <Link to="/">
              Home
            </Link>

            <Link to="/profile">
              My Profile
            </Link>

            <button onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </header>

        <section className="card">
          <h2>Users</h2>

          {users.length === 0 ? (
            <p className="empty-state">
              No other users found.
            </p>
          ) : (
            <ul className="user-list">
              {users.map((otherUser) => (
                <li
                  key={otherUser.id}
                  className="user-card"
                >
                  <div>
                    <strong>
                      {otherUser.displayName ||
                        otherUser.username}
                    </strong>

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

                  <div className="user-actions">
                    <Link
                      to={`/messages/${otherUser.id}`}
                      className="button-link"
                    >
                      Message
                    </Link>

                    <Link
                      to={`/users/${otherUser.id}`}
                      className="secondary-link"
                    >
                      View Profile
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default Dashboard;