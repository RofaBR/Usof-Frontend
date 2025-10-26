import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth';
import { getAvatarUrl } from '~/utils/urlHelpers';
import { formatFullDateTime } from '~/utils/dateHelpers';
import { useCommentInteractions } from './useCommentInteractions';
import CommentForm from './CommentForm';
import '~/styles/Comment.css';

function Comment({ comment, onDelete, onUpdate }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const { rating, currentVote, handleVote, isLoading } = useCommentInteractions(
        comment.id,
        comment.rating,
        comment.currentUserVote || null
    );

    const isAuthor = user && user.id === comment.author_id;

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSubmitEdit = (updatedContent) => {
        onUpdate(comment.id, updatedContent);
        setIsEditing(false);
    };

    const handleDeleteClick = () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            onDelete(comment.id);
        }
    };

    if (isEditing) {
        return (
            <div className="comment-item editing">
                <CommentForm
                    initialContent={comment.content}
                    onSubmit={handleSubmitEdit}
                    onCancel={handleCancelEdit}
                    submitLabel="Save"
                />
            </div>
        );
    }

    return (
        <div className="comment-item">
            <div className="comment-voting">
                <button
                    className={`comment-vote-button vote-up ${currentVote === 'like' ? 'voted-up' : ''}`}
                    onClick={() => handleVote('like')}
                    disabled={isLoading}
                    aria-label="Vote up"
                >
                    <svg viewBox="0 0 36 36" className="comment-vote-icon">
                        <path d="M2 26h32L18 10 2 26z"></path>
                    </svg>
                </button>
                <div className="comment-rating">{rating}</div>
                <button
                    className={`comment-vote-button vote-down ${currentVote === 'dislike' ? 'voted-down' : ''}`}
                    onClick={() => handleVote('dislike')}
                    disabled={isLoading}
                    aria-label="Vote down"
                >
                    <svg viewBox="0 0 36 36" className="comment-vote-icon">
                        <path d="M2 10h32L18 26 2 10z"></path>
                    </svg>
                </button>
            </div>

            <div className="comment-content-wrapper">
                <div className="comment-header">
                    <div
                        className="comment-author"
                        onClick={() => comment.author_id && navigate(`/syntaxly/profile/${comment.author_id}`)}
                    >
                        <img
                            src={getAvatarUrl(comment.author_avatar)}
                            alt={comment.author_name || comment.author_login}
                            className="comment-author-avatar"
                        />
                        <span className="comment-author-name">
                            {comment.author_name || comment.author_login || 'Anonymous'}
                        </span>
                    </div>
                    <span className="comment-date">
                        {formatFullDateTime(comment.create_at)}
                    </span>
                </div>

                <div className="comment-content">
                    <p>{comment.content}</p>
                </div>

                {isAuthor && (
                    <div className="comment-actions">
                        <button
                            className="comment-action-button edit-button"
                            onClick={handleEdit}
                        >
                            Edit
                        </button>
                        <button
                            className="comment-action-button delete-button"
                            onClick={handleDeleteClick}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Comment;