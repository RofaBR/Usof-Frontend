import { Link } from 'react-router-dom';
import '~/styles/Footer.css';

const GITHUB_FRONTEND_URL = "https://github.com/RofaBR/UsofF";
const GITHUB_BACKEND_URL = "https://github.com/RofaBR/UsofB";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section footer-brand">
                    <h3>Syntaxly</h3>
                    <p>A community Q&A platform for developers.</p>
                </div>
                <div className="footer-section footer-links">
                    <h4>Navigate</h4>
                    <ul>
                        <li><Link to="/syntaxly/posts">All Posts</Link></li>
                        <li><Link to="/syntaxly/categories">Categories</Link></li>
                        <li><Link to="/syntaxly/users">Users</Link></li>
                    </ul>
                </div>
                <div className="footer-section footer-links">
                    <h4>Project</h4>
                    <ul>
                        <li><a href={GITHUB_FRONTEND_URL} target="_blank" rel="noopener noreferrer">Frontend on GitHub</a></li>
                        <li><a href={GITHUB_BACKEND_URL} target="_blank" rel="noopener noreferrer">Backend on GitHub</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} Syntaxly. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;