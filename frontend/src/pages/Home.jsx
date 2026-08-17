import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
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

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setUser(data.user);
      } catch (error) {
        console.error("Could not connect to backend:", error);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <h1>Transmit</h1>

      {user ? (
        <>
          <p>Welcome, {user.displayName || "@" + user.username}</p>

          <Link to="/dashboard">
            Dashboard
          </Link>

          {" | "}

          <Link to="/profile">
            My Profile
          </Link>
        </>
      ) : (
        <>
          <p>You are not logged in.</p>

          <Link to="/login">
            Login
          </Link>

          {" | "}

          <Link to="/signup">
            Sign Up
          </Link>
        </>
      )}
    </main>
  );
}

export default Home;