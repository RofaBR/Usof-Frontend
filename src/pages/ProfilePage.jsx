import { useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth';
import { useFetch } from '~/hooks/useFetch';
import { getAvatarUrl } from '~/utils/urlHelpers';
import UserPostsList from '~/components/Profile/UserPostsList';
import UserCommentsList from '~/components/Profile/UserCommentsList';
import '~/styles/ProfilePage.css';

function ProfilePage() {
    const { user_id } = useParams();
    const navigate = useNavigate();
    const { user, accessToken } = useAuth();
    const [activeTab, setActiveTab] = useState('posts');

    const { data: userData, loading: userLoading, error: userError } = useFetch(
        `/users/${user_id}`,
        { accessToken }
    );

    const { data: statsData, loading: statsLoading } = useFetch(`/users/${user_id}/stats`);

    const profileUser = userData?.user;
    const stats = statsData?.stats;
    const isOwnProfile = user && user.id == user_id;

    const handleEditProfile = () => {
        navigate('/syntaxly/profile/edit');
    };

    if (userLoading) {
        return <div className="loading-indicator">Loading profile...</div>;
    }

    if (userError || !profileUser) {
        return <div className="error-message">Failed to load profile</div>;
    }

    return (
        <section className="profile-page">
            <div className="profile-header">
                <div className="profile-avatar-container">
                    <img
                        src={getAvatarUrl(profileUser.avatar)}
                        alt={profileUser.full_name}
                        className="profile-avatar"
                    />
                </div>
                <div className="profile-info">
                    <h1 className="profile-name">{profileUser.full_name}</h1>
                </div>
                {isOwnProfile && (
                    <button className="edit-profile-btn" onClick={handleEditProfile}>
                        Edit Profile
                    </button>
                )}
            </div>

            {statsLoading ? (
                <div className="stats-loading">Loading statistics...</div>
            ) : (
                <div className="profile-stats">
                    <div className="stat-card">
                        <div className="stat-value">{stats?.posts_count || 0}</div>
                        <div className="stat-label">Posts</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats?.comments_count || 0}</div>
                        <div className="stat-label">Comments</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats?.rating || 0}</div>
                        <div className="stat-label">Rating</div>
                    </div>
                </div>
            )}

            <div className="profile-tabs">
                <button
                    className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                >
                    Posts
                </button>
                <button
                    className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('comments')}
                >
                    Comments
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'posts' ? (
                    <UserPostsList userId={user_id} />
                ) : (
                    <UserCommentsList userId={user_id} />
                )}
            </div>
        </section>
    );
}

export default ProfilePage;