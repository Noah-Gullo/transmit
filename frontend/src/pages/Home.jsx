import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <h1>Transmit</h1>

      <p>Send and receive messages with other users.</p>

      <nav>
        <div>
          <Link to="/login">Login</Link>
        </div>

        <div>
          <Link to="/signup">Sign Up</Link>
        </div>
      </nav>
    </main>
  );
}

export default Home;