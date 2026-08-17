import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <h1>Messaging App</h1>

      <p>Send and receive messages with other users.</p>

      <nav>
        <Link to="/login">
          Login
        </Link>

        {" | "}

        <Link to="/signup">
          Sign Up
        </Link>
      </nav>
    </main>
  );
}

export default Home;