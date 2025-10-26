import Footer from './Footer.jsx';
import '~/styles/Layout.css';

function Layout({ children }) {
    return (
        <div className="layout">
            <main className="layout-content">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default Layout;