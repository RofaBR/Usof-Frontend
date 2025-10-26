import { useState, useEffect } from 'react';
import { useAuth } from '~/hooks/useAuth';
import Comment from './Comment';
import CommentForm from './CommentForm';
import toast from 'react-hot-toast';
import '~/styles/CommentsSection.css';

const API_URL = import.meta.env.VITE_SERVER_API || 'http://localhost:8080/api';

function CommentsSection({ postId }) {
    const { accessToken, user } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasMore: false
    });

    const fetchComments = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${API_URL}/posts/${postId}/comments?page=${page}&limit=${pagination.limit}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }

            const result = await response.json();

            if (page === 1) {
                setComments(result.data || []);
            } else {
                setComments(prev => [...prev, ...(result.data || [])]);
            }

            setPagination(result.pagination);
        } catch (error) {
            console.error('Error fetching comments:', error);
            toast.error('Failed to load comments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments(1);
    }, [postId]);

    const handleCreateComment = async (content) => {
        if (!accessToken) {
            toast.error('Please login to comment');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) {
                throw new Error('Failed to post comment');
            }

            toast.success('Comment posted successfully!');
            await fetchComments(1);
        } catch (error) {
            console.error('Error posting comment:', error);
            toast.error('Failed to post comment');
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateComment = async (commentId, content) => {
        try {
            const response = await fetch(`${API_URL}/comments/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) {
                throw new Error('Failed to update comment');
            }

            setComments(prev =>
                prev.map(comment =>
                    comment.id === commentId
                        ? { ...comment, content }
                        : comment
                )
            );

            toast.success('Comment updated successfully!');
        } catch (error) {
            console.error('Error updating comment:', error);
            toast.error('Failed to update comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`${API_URL}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }

            setComments(prev => prev.filter(comment => comment.id !== commentId));

            toast.success('Comment deleted successfully!');
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
        }
    };

    const handleLoadMore = () => {
        if (pagination.hasMore && !loading) {
            fetchComments(pagination.page + 1);
        }
    };

    return (
        <div className="comments-section">
            <h2 className="comments-title">
                Comments ({pagination.total})
            </h2>

            {user && (
                <div className="comment-form-wrapper">
                    <CommentForm
                        onSubmit={handleCreateComment}
                        placeholder="Write your comment..."
                        submitLabel="Post Comment"
                    />
                </div>
            )}

            {loading && comments.length === 0 ? (
                <div className="comments-loading">
                    <p>Loading comments...</p>
                </div>
            ) : comments.length === 0 ? (
                <div className="comments-empty">
                    <p>No comments yet. Be the first to comment!</p>
                </div>
            ) : (
                <>
                    <div className="comments-list">
                        {comments.map(comment => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                onUpdate={handleUpdateComment}
                                onDelete={handleDeleteComment}
                            />
                        ))}
                    </div>

                    {pagination.hasMore && (
                        <div className="comments-load-more">
                            <button
                                className="load-more-button"
                                onClick={handleLoadMore}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Show More Comments'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default CommentsSection;