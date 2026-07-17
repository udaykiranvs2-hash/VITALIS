import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="feature-page not-found-page">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist or has moved.</p>
      <Link to="/">Return to home</Link>
    </div>
  );
}

export default NotFoundPage;
