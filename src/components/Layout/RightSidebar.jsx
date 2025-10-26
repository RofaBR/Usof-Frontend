import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvatarUrl } from '~/utils/urlHelpers';
import StarIcon from '~/assets/StarIcon.jsx';
import '~/styles/RightSidebar.css';

const API_URL = import.meta.env.VITE_SERVER_API || 'http://localhost:8080/api';

function RightSidebar() {
    const [statistics, setStatistics] = useState({
        topPosts: [],
        topUsers: [],
        trendingCategories: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await fetch(`${API_URL}/statistics`);
                const data = await response.json();

                if (data.status === 'Success') {
                    setStatistics(data.statistics);
                } else {
                    setError('Failed to fetch statistics');
                }
            } catch (err) {
                setError('Error loading statistics');
                console.error('Error fetching statistics:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    const handlePostClick = (postId) => {
        navigate(`/syntaxly/post/${postId}`);
    };

    const handleUserClick = (userId) => {
        navigate(`/syntaxly/profile/${userId}`);
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/syntaxly/categories?category=${categoryId}`);
    };

    if (loading) {
        return (
            <aside className="right-sidebar">
                <div className="sidebar-loading">Loading statistics...</div>
            </aside>
        );
    }

    if (error) {
        return (
            <aside className="right-sidebar">
                <div className="sidebar-error">{error}</div>
            </aside>
        );
    }

    return (
        <aside className="right-sidebar">
            <div className="stats-section">
                <h3 className="stats-title">Top Rated Posts</h3>
                <div className="stats-list">
                    {statistics.topPosts.length > 0 ? (
                        statistics.topPosts.map((post, index) => (
                            <div
                                key={post.id}
                                className="stats-item"
                                onClick={() => handlePostClick(post.id)}
                            >
                                <div className="stats-rank">{index + 1}</div>
                                <div className="stats-content">
                                    <div className="stats-item-title">{post.title}</div>
                                    <div className="stats-meta">
                                        <span className="stats-author">{post.author_name}</span>
                                        <span className="stats-separator">•</span>
                                        <span className="stats-rating">
                                            {post.rating > 0 ? '+' : ''}{post.rating}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="stats-empty">No posts yet</div>
                    )}
                </div>
            </div>

            <div className="stats-section">
                <h3 className="stats-title">Top Rated Users</h3>
                <div className="stats-list">
                    {statistics.topUsers.length > 0 ? (
                        statistics.topUsers.map((user, index) => (
                            <div
                                key={user.id}
                                className="stats-item"
                                onClick={() => handleUserClick(user.id)}
                            >
                                <div className="stats-rank">{index + 1}</div>
                                <div className="stats-user-content">
                                    <img
                                        src={getAvatarUrl(user.avatar)}
                                        alt={user.full_name}
                                        className="stats-avatar"
                                        onError={(e) => {
                                            e.target.src = getAvatarUrl(null);
                                        }}
                                    />
                                    <div className="stats-content">
                                        <div className="stats-item-title">{user.full_name}</div>
                                        <div className="stats-meta">
                                            <span className="stats-rating">
                                                <StarIcon className="rating-icon" />
                                                {user.rating > 0 ? '+' : ''}{user.rating}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="stats-empty">No users yet</div>
                    )}
                </div>
            </div>

            <div className="stats-section">
                <h3 className="stats-title">Trending Categories</h3>
                <div className="stats-list">
                    {statistics.trendingCategories.length > 0 ? (
                        statistics.trendingCategories.map((category, index) => (
                            <div
                                key={category.id}
                                className="stats-item"
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                <div className="stats-rank">{index + 1}</div>
                                <div className="stats-content">
                                    <div className="stats-item-title">{category.title}</div>
                                    <div className="stats-meta">
                                        <span className="stats-count">
                                            {category.post_count} {category.post_count === 1 ? 'post' : 'posts'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="stats-empty">No categories yet</div>
                    )}
                </div>
            </div>
        </aside>
    );
}

export default RightSidebar;