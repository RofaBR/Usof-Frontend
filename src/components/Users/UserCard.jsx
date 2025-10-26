import { useNavigate } from 'react-router-dom';
import { getAvatarUrl } from '~/utils/urlHelpers';
import StarIcon from '~/assets/StarIcon.jsx';
import '~/styles/UserCard.css';

function UserCard({ user }) {
    const navigate = useNavigate();
    const avatarUrl = getAvatarUrl(user.avatar, '/default-avatar.png');

    const handleClick = () => {
        if (user.id) {
            navigate(`/syntaxly/profile/${user.id}`);
        }
    };

    return (
        <div className="user-card" onClick={handleClick}>
            <div className="user-avatar-wrapper">
                <img
                    src={avatarUrl}
                    alt={user.full_name}
                    className="user-avatar"
                    onError={(e) => {
                        e.target.src = '/default-avatar.png';
                    }}
                />
            </div>
            <div className="user-info">
                <h3 className="user-name">{user.full_name}</h3>
                <div className="user-rating">
                    <StarIcon className="rating-icon" width={16} height={16} />
                    <span className="rating-value">{user.rating || 0}</span>
                </div>
            </div>
        </div>
    );
}

export default UserCard;