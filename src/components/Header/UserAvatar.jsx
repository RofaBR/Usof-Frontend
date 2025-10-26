import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth.jsx';
import { getAvatarUrl } from '~/utils/urlHelpers';
import '~/styles/UserAvatar.css';

const ADMIN_PANEL_URL = import.meta.env.VITE_ADMIN_PANEL;

function UserAvatar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const avatarUrl = getAvatarUrl(user?.avatar);
    const isAdmin = user?.role === 'admin';

    const toggleMenu = (e) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleGoToProfile = () => {
        navigate(`/syntaxly/profile/${user?.id}`);
        setIsMenuOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        setIsMenuOpen(false);
        navigate('/auth/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <div className="user-avatar-container" ref={menuRef}>
            <div className="user-avatar" onClick={toggleMenu}>
                <img
                    src={avatarUrl}
                    alt={user?.full_name || 'User'}
                    className="avatar-image"
                />
            </div>

            {isMenuOpen && (
                <div className="avatar-dropdown-menu">
                    <div className="menu-info-item">
                        <span className="menu-fullname">{user?.full_name}</span>
                    </div>

                    {user?.role && (
                        <div className="menu-info-item">
                            <div className="menu-role-badge">{user.role}</div>
                        </div>
                    )}

                    <div className="menu-info-item" onClick={handleGoToProfile}>
                        <span className="menu-label">About account:</span>
                        <span className="menu-login">{user?.login}</span>
                    </div>

                    <div className="menu-divider"></div>
                    {isAdmin && ADMIN_PANEL_URL && (
                        <a
                            href={ADMIN_PANEL_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="menu-item admin-link"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <span>Admin Panel</span>
                        </a>
                    )}
                    <button className="menu-item logout" onClick={handleLogout}>
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserAvatar;