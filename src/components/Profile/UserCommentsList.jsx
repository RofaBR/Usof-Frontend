import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PaginationButtons from '~/components/Common/PaginationButtons.jsx';
import { useFetch } from '~/hooks/useFetch.jsx';
import { formatFullDateTime } from '~/utils/dateHelpers';
import '~/styles/UserCommentsList.css';

function UserCommentsList({ userId }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get('commentsPage') || '1', 10);
    const commentsPerPage = 20;

    const endpoint = useMemo(() => {
        return `/users/${userId}/comments?page=${currentPage}&limit=${commentsPerPage}`;
    }, [userId, currentPage, commentsPerPage]);

    const { data, loading, error } = useFetch(endpoint);

    const comments = data?.data || [];
    const totalPages = data?.pagination?.totalPages || 1;

    const handlePageChange = (page) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('commentsPage', page.toString());
        setSearchParams(newParams);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div className="loading-indicator"><p>Loading comments...</p></div>;
    if (error) return <p className="error-message">Error: {error}</p>;
    if (comments.length === 0) return <div className="empty-state">No comments yet</div>;

    return (
        <div className="user-comments-container">
            <div className="user-comments-list">
                {comments.map((comment) => (
                    <div key={comment.id} className="user-comment-item">
                        <div className="comment-text">{comment.content}</div>
                        <div className="comment-meta">
                            <span className="comment-date">{formatFullDateTime(comment.create_at)}</span>
                        </div>
                    </div>
                ))}
            </div>
            <PaginationButtons
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={loading}
            />
        </div>
    );
}

export default UserCommentsList;