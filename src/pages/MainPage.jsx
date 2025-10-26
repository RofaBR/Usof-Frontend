import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '~components/Header/Header.jsx';
import Sidebar from '~components/Layout/Sidebar.jsx';
import RightSidebar from '~components/Layout/RightSidebar.jsx';
import Footer from '~components/Layout/Footer.jsx';
import { useAuth } from '~/hooks/useAuth';
import { SearchProvider } from '~/contexts/SearchContext.jsx';
import '~/styles/MainPage.css';

function MainPage() {
    const { user, accessToken, loading, fetchUser } = useAuth();

    useEffect(() => {
        if (user && user.id && accessToken) {
            fetchUser(user.id);
        }
    }, [user?.id, accessToken, fetchUser]);

    if (loading) return <div>Loading...</div>;

    return (
        <SearchProvider>
            <div className="main-page">
                <Header />
                <div className="main-layout">
                    <Sidebar />
                    <main className="main-content">
                        <div className="main-content-wrapper">
                            <div className="content-wrapper">
                                <Outlet />
                            </div>
                            <RightSidebar />
                        </div>
                        <Footer />
                    </main>
                </div>
            </div>
        </SearchProvider>
    );
}

export default MainPage;
