import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="nf-wrapper">
      <div className="nf-card">

        <h1 className="nf-title">404</h1>

        <h2 className="nf-subtitle">Page Not Found</h2>

        <p className="nf-text">
          The page you are looking for doesn’t exist or was moved.
        </p>

        <Link to="/" className="nf-btn">
          Go Back Home
        </Link>

      </div>
    </div>
  );
}
