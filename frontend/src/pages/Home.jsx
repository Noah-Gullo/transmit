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

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();

        setUser(data.user);
      } catch (error) {
        console.error("Could not check session:", error);
        setUser(null);
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
          <p>Welcome, {user.username}</p>

          <Link to="/dashboard">
            Dashboard
          </Link>
        </>
      ) : (
        <>
          <Link to="/login">
            Login
          </Link>

          <br />

          <Link to="/signup">
            Sign Up
          </Link>
        </>
      )}
    </main>
  );
}

export default Home;