import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/profile",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setDisplayName(data.user.displayName || "");
        setBio(data.user.bio || "");
        setStatus(data.user.status || "");
      } catch (error) {
        console.error("Could not load profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

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
            bio,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not update profile");
        return;
      }

      setMessage("Profile updated");
    } catch (error) {
      console.error(error);
      setMessage("Could not update profile");
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <h1>My Profile</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="displayName">
            Display Name
          </label>

          <input
            id="displayName"
            value={displayName}
            onChange={(event) =>
              setDisplayName(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="bio">
            Bio
          </label>

          <textarea
            id="bio"
            value={bio}
            onChange={(event) =>
              setBio(event.target.value)
            }
          />
        </div>

        <div>
          <label htmlFor="status">
            Status
          </label>

          <input
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            placeholder="Available"
          />
        </div>

        <button type="submit">
          Save Profile
        </button>
      </form>

      {message && <p>{message}</p>}

      <Link to="/dashboard">
        Back to Dashboard
      </Link>
    </main>
  );
}

export default Profile;