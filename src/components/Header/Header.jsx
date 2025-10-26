import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth.jsx';
import SearchBar from '~components/Header/SearchBar.jsx';
import NotificationBell from '~components/Header/NotificationBell.jsx';
import UserAvatar from '~components/Header/UserAvatar.jsx';
import '~/styles/Header.css';

function Header() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/auth/login');
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-left">
                    <img src="/logo.png" alt="Syntaxly" className="logo" />
                </div>

                <div className="header-center">
                  <SearchBar />
                </div>

                <div className="header-right">
                  {user ? (
                    <>
                      <NotificationBell />
                      <UserAvatar />
                    </>
                  ) : (
                    <button className="login-button" onClick={handleLoginClick}>
                      Login
                    </button>
                  )}
                </div>
            </div>
        </header>
    );
}

export default Header;