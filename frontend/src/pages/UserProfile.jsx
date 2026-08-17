import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function UserProfile() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/users/${userId}/profile`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setUser(data.user);
      } catch (error) {
        console.error("Could not load profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <main>
      <h1>
        {user.displayName || user.username}
      </h1>

      <p>
        @{user.username}
      </p>

      <section>
        <h2>Status</h2>
        <p>{user.status || "No status set."}</p>
      </section>

      <section>
        <h2>Bio</h2>
        <p>{user.bio || "No bio yet."}</p>
      </section>

      <nav>
        <Link to={`/messages/${user.id}`}>
          Message {user.displayName || user.username}
        </Link>

        {" | "}

        <Link to="/dashboard">
          Back to Dashboard
        </Link>
      </nav>
    </main>
  );
}

export default UserProfile;