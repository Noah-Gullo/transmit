import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (!response.ok) {
        setError("Invalid username or password");
        return;
      }

      const data = await response.json();

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Could not connect to server");
    }
  }

  return (
    <main>
      <h1>Login</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username: </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password: </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button type="submit">
          Login
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/signup">Sign up</Link>
      </p>

      <Link to="/">Back to Home</Link>
    </main>
  );
}

export default Login;