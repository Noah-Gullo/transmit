import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function UserProfile() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(
          `${API_URL}/api/users/${userId}/profile`,
          {
            credentials: "include",
          }
        );

        if (response.status === 401) {
          setError(
            "You must be logged in to view this profile."
          );
          return;
        }

        if (response.status === 404) {
          setError("User not found.");
          return;
        }

        if (!response.ok) {
          setError("Could not load profile.");
          return;
        }

        const data = await response.json();

        setUser(data.user);
      } catch (error) {
        console.error(
          "Could not load profile:",
          error
        );

        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId]);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
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

  if (!user) {
    return null;
  }

  return (
    <main className="page">
      <div className="profile-container">
        <header className="profile-header">
          <div>
            <h1>
              {user.displayName ||
                `@${user.username}`}
            </h1>

            {user.displayName && (
              <p className="username">
                @{user.username}
              </p>
            )}
          </div>

          <Link
            to="/dashboard"
            className="secondary-link"
          >
            ← Dashboard
          </Link>
        </header>

        <section className="card user-profile-card">
          <div className="profile-section">
            <h2>Status</h2>

            <p>
              {user.status || "No status set."}
            </p>
          </div>

          <div className="profile-section">
            <h2>Bio</h2>

            <p>
              {user.bio || "No bio yet."}
            </p>
          </div>

          <div className="profile-actions">
            <Link
              to={`/messages/${user.id}`}
              className="button-link"
            >
              Message{" "}
              {user.displayName ||
                `@${user.username}`}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default UserProfile;