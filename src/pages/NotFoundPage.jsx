import { Link } from 'react-router-dom';
import '../styles/NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2 className="not-found-title">Oops! This page doesn't exist</h2>
        <p className="not-found-message">
          Looks like you've wandered into uncharted territory. The page you're looking for might have been moved, deleted, or never existed in the first place.
        </p>
        <Link to="/syntaxly" className="home-button">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;