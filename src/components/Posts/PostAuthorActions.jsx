import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth';
import '~/styles/PostAuthorActions.css';

const API_URL = import.meta.env.VITE_SERVER_API || 'http://localhost:8080/api';

function PostAuthorActions({ post_id, author_id, initialBanned = false }) {
    const navigate = useNavigate();
    const { accessToken, user } = useAuth();
    const [isBanned, setIsBanned] = useState(initialBanned);

    const isAuthor = user && user.id === author_id;
    const isAdmin = user && user.role === 'admin';

    if (!isAuthor && !isAdmin) {
        return null;
    }

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/posts/${post_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                navigate('/');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to delete post');
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('Failed to delete post. Please try again.');
        }
    };

    const handleToggleBan = async () => {
        const action = isBanned ? 'unban' : 'ban';
        const confirmMessage = isBanned
            ? 'Are you sure you want to unban this post?'
            : 'Are you sure you want to ban this post?';

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/admin/posts/${post_id}/${action}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                setIsBanned(!isBanned);
                alert(`Post ${action}ned successfully`);
            } else {
                const errorData = await response.json();
                alert(errorData.message || `Failed to ${action} post`);
            }
        } catch (error) {
            console.error(`Failed to ${action} post:`, error);
            alert(`Failed to ${action} post. Please try again.`);
        }
    };

    const handleEdit = () => {
        navigate(`/syntaxly/post/${post_id}/edit`);
    };

    return (
        <div className="post-author-actions">
            {isAdmin && (
                <button
                    className={`post-action-button ${isBanned ? 'unban-button' : 'ban-button'}`}
                    onClick={handleToggleBan}
                    aria-label={isBanned ? 'Unban post' : 'Ban post'}
                    title={isBanned ? 'Unban post' : 'Ban post'}
                >
                    {isBanned ? (
                        <svg viewBox="0 0 24 24" className="action-button-icon" fill="currentColor">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" className="action-button-icon" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/>
                        </svg>
                    )}
                </button>
            )}

            {isAuthor && (
                <button
                    className="post-action-button edit-button"
                    onClick={handleEdit}
                    aria-label="Edit post"
                    title="Edit post"
                >
                    <svg viewBox="0 0 24 24" className="action-button-icon" fill="currentColor">
                        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                    </svg>
                </button>
            )}
        </div>
    );
}

export default PostAuthorActions;