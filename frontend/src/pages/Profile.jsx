import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState("");
  const [bio, setBio] = useState("");

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/profile",
          {
            credentials: "include",
          }
        );

        if (response.status === 401) {
          setError("You must be logged in to view your profile.");
          return;
        }

        if (!response.ok) {
          setError("Could not load profile.");
          return;
        }

        const data = await response.json();

        setUsername(data.user.username);
        setDisplayName(data.user.displayName || "");
        setStatus(data.user.status || "");
        setBio(data.user.bio || "");
      } catch (error) {
        console.error("Could not load profile:", error);
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            displayName,
            status,
            bio,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not update profile.");
        return;
      }

      setDisplayName(data.user.displayName || "");
      setStatus(data.user.status || "");
      setBio(data.user.bio || "");

      setMessage("Profile updated.");
    } catch (error) {
      console.error("Could not update profile:", error);
      setError("Could not connect to server.");
    }
  }

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error && !username) {
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

  return (
    <main className="page">
      <div className="profile-container">

        <header className="profile-header">
          <div>
            <h1>My Profile</h1>

            <p className="username">
              @{username}
            </p>
          </div>

          <Link
            to="/dashboard"
            className="secondary-link"
          >
            ← Dashboard
          </Link>
        </header>

        <section className="card">
          <form
            className="profile-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label htmlFor="displayName">
                Display Name
              </label>

              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(event) =>
                  setDisplayName(event.target.value)
                }
                placeholder="Your display name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
              >
                <option value="">Select a status</option>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Away">Away</option>
                <option value="Do Not Disturb">
                  Do Not Disturb
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bio">
                Bio
              </label>

              <textarea
                id="bio"
                value={bio}
                onChange={(event) =>
                  setBio(event.target.value)
                }
                placeholder="Tell people a little about yourself..."
              />
            </div>

            {error && (
              <p className="auth-error">
                {error}
              </p>
            )}

            {message && (
              <p className="profile-message">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="save-button"
            >
              Save Profile
            </button>

          </form>
        </section>

      </div>
    </main>
  );
}

export default Profile;