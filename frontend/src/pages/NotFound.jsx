import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="page">
      <div className="error-card text-center">
        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p className="error-message">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="button-link"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;