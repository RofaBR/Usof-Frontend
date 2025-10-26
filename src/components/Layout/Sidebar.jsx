import { NavLink } from 'react-router-dom';
import HomeIcon from '~/assets/HomeIcon.jsx';
import RecentIcon from '~/assets/RecentIcon.jsx';
import PostsIcon from '~/assets/PostsIcon.jsx';
import UnansweredIcon from '~/assets/UnansweredIcon.jsx';
import FavoritesIcon from '~/assets/FavoritesIcon.jsx';
import CategoriesIcon from '~/assets/CategoriesIcon.jsx';
import UsersIcon from '~/assets/UsersIcon.jsx';
import '~/styles/Sidebar.css';

function Sidebar() {
    const menuItems = [
        { path: '/syntaxly/home', label: 'Home', icon: HomeIcon, color: '#9b5de5' },
        { path: '/syntaxly/recent', label: 'Recent', icon: RecentIcon, color: '#f15bb5' },
        { path: '/syntaxly/posts', label: 'All Posts', icon: PostsIcon, color: '#fee440' },
        { path: '/syntaxly/unanswered', label: 'Unanswered', icon: UnansweredIcon, color: '#00bbf9' },
        { path: '/syntaxly/favorites', label: 'Favorites', icon: FavoritesIcon, color: '#00f5d4' },
        { type: 'divider' },
        { path: '/syntaxly/categories', label: 'Categories', icon: CategoriesIcon, color: '#ff6b6b' },
        { path: '/syntaxly/users', label: 'Users', icon: UsersIcon, color: '#ff9f1c' }
    ];

    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                {menuItems.map((item, index) =>
                    item.type === 'divider' ? (
                        <div key={`divider-${index}`} className="sidebar-divider" />
                    ) : (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `sidebar-item ${isActive ? 'active' : ''}`
                            }
                            style={{'--item-color': item.color}}
                        >
                            <span className="sidebar-icon">
                                <item.icon width={20} height={20} />
                            </span>
                            <span className="sidebar-label">{item.label}</span>
                        </NavLink>
                    )
                )}
            </nav>
        </aside>
    );
}

export default Sidebar;
