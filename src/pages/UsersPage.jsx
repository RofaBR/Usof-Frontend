import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '~/contexts/SearchContext.jsx';
import { useFetch } from '~/hooks/useFetch.jsx';
import UserCard from '~/components/Users/UserCard';
import PaginationButtons from '~/components/Common/PaginationButtons.jsx';
import '~/styles/UsersPage.css';

function UsersPage() {
    const { searchQuery } = useSearch();
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const endpoint = useMemo(() => {
        let url = `/users?page=${currentPage}&limit=${limit}`;
        if (searchQuery) {
            url += `&search=${encodeURIComponent(searchQuery)}`;
        }
        return url;
    }, [currentPage, limit, searchQuery]);

    const { data, loading, error } = useFetch(endpoint);

    const users = data?.data || [];
    const totalPages = data?.pagination?.totalPages || 1;
    const totalUsers = data?.pagination?.total || 0;

    useEffect(() => {
        if (searchQuery && currentPage !== 1) {
            setSearchParams({ page: '1', limit: limit.toString() });
        }
    }, [searchQuery, currentPage, limit, setSearchParams]);

    const handlePageChange = (page) => {
        setSearchParams({ page: page.toString(), limit: limit.toString() });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (error) {
        return (
            <section className="content-section">
                <h2>Users</h2>
                <p className="error-message">Error: {error}</p>
            </section>
        );
    }

    return (
        <section className="content-section">
            <div className="users-header">
                <h2>Users</h2>
                <p className="users-count">
                    {totalUsers > 0 ? `${totalUsers} users found` : 'Loading...'}
                </p>
            </div>

            {loading ? (
                <div className="loading-indicator">
                    <p>Loading users...</p>
                </div>
            ) : (
                <>
                    <div className="users-grid">
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <UserCard key={`${user.full_name}-${index}`} user={user} />
                            ))
                        ) : (
                            <p>No users found</p>
                        )}
                    </div>

                    <PaginationButtons
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        loading={loading}
                    />
                </>
            )}
        </section>
    );
}

export default UsersPage;