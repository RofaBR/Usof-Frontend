import React, { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '~components/Posts/PostCard.jsx';
import PaginationButtons from '~components/Common/PaginationButtons.jsx';
import { useFetch } from '~/hooks/useFetch.jsx';
import { useAuth } from '~/hooks/useAuth.jsx';
import { useSearch } from '~/contexts/SearchContext.jsx';
import { useAppSelector } from '~/store/hooks';
import '~/styles/PostList.css';

const MemoizedPostCard = React.memo(PostCard);

function PostList({ filter, favoritesOnly = false, categoryIds = [], showAllStatuses = false }) {
    const { searchQuery } = useSearch();
    const { accessToken } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const { sortBy, sortDirection, postsPerPage } = useAppSelector((state) => state.filters);

    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    useEffect(() => {
        if (searchQuery && currentPage !== 1) {
            setSearchParams({ page: '1', limit: postsPerPage.toString() });
        }
    }, [searchQuery]);

    useEffect(() => {
        if (currentPage !== 1) {
            setSearchParams({ page: '1', limit: postsPerPage.toString() });
        }
    }, [sortBy, sortDirection, postsPerPage]);

    const endpoint = useMemo(() => {
        const params = new URLSearchParams({
            page: currentPage,
            limit: postsPerPage,
            direction: sortDirection,
        });

        if (searchQuery) params.append('search', searchQuery);
        
        if (showAllStatuses) {
            params.append('status', 'all');
        } else if (filter === 'unanswered') {
            params.append('status', 'active');
        }

        if (sortBy) params.append('orderBy', sortBy);
        if (favoritesOnly) params.append('favorite', 'true');
        if (categoryIds?.length > 0) params.append('categories', categoryIds.join(','));

        return `/posts?${params.toString()}`;
    }, [currentPage, postsPerPage, searchQuery, filter, sortBy, sortDirection, favoritesOnly, categoryIds, showAllStatuses]);

    const { data, loading, error } = useFetch(endpoint, { accessToken });

    const posts = data?.result?.data || [];
    const totalPages = data?.result?.pagination?.totalPages || 1;

    const handlePageChange = (page) => {
        const newParams = { page: page.toString(), limit: postsPerPage.toString() };
        setSearchParams(newParams);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div className="loading-indicator"><p>Loading posts...</p></div>;
    if (error) return <p className="error-message">Error: {error}</p>;
    if (posts.length === 0) return <div className="post-list-empty">No posts found</div>;

    return (
        <div className="post-list-container">
            <div className="post-list">
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

export default PostList;
