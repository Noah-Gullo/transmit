import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
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
      } catch (error) {
        console.error("Could not check session:", error);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <main className="home-page">
      <div className="home-container">
        <section className="home-content">
          <h1>Transmit</h1>

          <p className="home-description">
            Connect with other users and start a conversation.
          </p>

          {user ? (
            <>
              <p className="home-welcome">
                Welcome back,{" "}
                <strong>
                  {user.displayName || user.username}
                </strong>
              </p>

              <div className="home-actions">
                <Link
                  to="/dashboard"
                  className="home-primary-button"
                >
                  Dashboard
                </Link>

                <Link
                  to="/profile"
                  className="home-secondary-button"
                >
                  My Profile
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="muted">
                Sign in to start messaging other users.
              </p>

              <div className="home-actions">
                <Link
                  to="/login"
                  className="home-primary-button"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="home-secondary-button"
                >
                  Create Account
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default Home;