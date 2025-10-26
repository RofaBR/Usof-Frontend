import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '~/components/Posts/PostCard.jsx';
import PaginationButtons from '~/components/Common/PaginationButtons.jsx';
import { useFetch } from '~/hooks/useFetch.jsx';
import { useAuth } from '~/hooks/useAuth.jsx';

const MemoizedPostCard = React.memo(PostCard);

function UserPostsList({ userId }) {
    const { accessToken } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get('postsPage') || '1', 10);
    const postsPerPage = 10;

    const endpoint = useMemo(() => {
        return `/posts/myposts/${userId}?page=${currentPage}&limit=${postsPerPage}`;
    }, [userId, currentPage, postsPerPage]);

    const { data, loading, error } = useFetch(endpoint, { accessToken });

    const posts = data?.result?.data || [];
    const totalPages = data?.result?.pagination?.totalPages || 1;

    const handlePageChange = (page) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('postsPage', page.toString());
        setSearchParams(newParams);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div className="loading-indicator"><p>Loading posts...</p></div>;
    if (error) return <p className="error-message">Error: {error}</p>;
    if (posts.length === 0) return <div className="empty-state">No posts yet</div>;

    return (
        <div className="user-posts-container">
            <div className="user-posts-list">
                {posts.map((post) => (
                    <MemoizedPostCard key={post.id} post={post} />
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

export default UserPostsList;