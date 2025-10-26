import '~/styles/HomePage.css';
import HomeIcon from '~/assets/HomeIcon.jsx';
import RecentIcon from '~/assets/RecentIcon.jsx';
import PostsIcon from '~/assets/PostsIcon.jsx';
import UnansweredIcon from '~/assets/UnansweredIcon.jsx';
import FavoritesIcon from '~/assets/FavoritesIcon.jsx';
import CategoriesIcon from '~/assets/CategoriesIcon.jsx';
import UsersIcon from '~/assets/UsersIcon.jsx';
import {
    CheckCircleIcon,
    XCircleIcon,
    ShieldBanIcon,
    AlertTriangleIcon
} from '~/assets/GuidelineIcons.jsx';

function HomePage() {
    return (
        <section className="content-section">
            <div className="welcome-container">
                <div className="welcome-hero">
                    <h1 className="welcome-title">Welcome to Syntaxly</h1>
                    <p className="welcome-subtitle">
                        Your community-driven platform for asking questions, sharing knowledge,
                        and connecting with developers worldwide.
                    </p>
                </div>

                <div className="welcome-section">
                    <h2 className="section-title">What is Syntaxly?</h2>
                    <p className="section-text">
                        Syntaxly is a question-and-answer platform designed for developers, programmers,
                        and technology enthusiasts. Whether you're stuck on a coding problem, looking for
                        best practices, or want to share your expertise, Syntaxly is the place to be.
                    </p>
                </div>

                <div className="welcome-section">
                    <h2 className="section-title">Navigation Guide</h2>
                    <div className="nav-guide-grid">
                        <a href="/syntaxly/home" className="nav-guide-item" style={{'--nav-color': '#9b5de5'}}>
                            <div className="nav-guide-icon">
                                <HomeIcon width={48} height={48} />
                            </div>
                            <h3>Home</h3>
                            <p>Welcome page with community guidelines and platform overview</p>
                        </a>

                        <a href="/syntaxly/recent" className="nav-guide-item" style={{'--nav-color': '#f15bb5'}}>
                            <div className="nav-guide-icon">
                                <RecentIcon width={48} height={48} />
                            </div>
                            <h3>Recent</h3>
                            <p>View the most recently published posts across all categories</p>
                        </a>

                        <a href="/syntaxly/posts" className="nav-guide-item" style={{'--nav-color': '#fee440'}}>
                            <div className="nav-guide-icon">
                                <PostsIcon width={48} height={48} />
                            </div>
                            <h3>All Posts</h3>
                            <p>Browse all posts with filtering and sorting options</p>
                        </a>

                        <a href="/syntaxly/unanswered" className="nav-guide-item" style={{'--nav-color': '#00bbf9'}}>
                            <div className="nav-guide-icon">
                                <UnansweredIcon width={48} height={48} />
                            </div>
                            <h3>Unanswered</h3>
                            <p>Find questions that need your expertise and help the community</p>
                        </a>

                        <a href="/syntaxly/favorites" className="nav-guide-item" style={{'--nav-color': '#00f5d4'}}>
                            <div className="nav-guide-icon">
                                <FavoritesIcon width={48} height={48} />
                            </div>
                            <h3>Favorites</h3>
                            <p>Access your bookmarked posts for quick reference</p>
                        </a>

                        <a href="/syntaxly/categories" className="nav-guide-item" style={{'--nav-color': '#ff6b6b'}}>
                            <div className="nav-guide-icon">
                                <CategoriesIcon width={48} height={48} />
                            </div>
                            <h3>Categories</h3>
                            <p>Explore posts organized by topics and technologies</p>
                        </a>

                        <a href="/syntaxly/users" className="nav-guide-item" style={{'--nav-color': '#ff9f1c'}}>
                            <div className="nav-guide-icon">
                                <UsersIcon width={48} height={48} />
                            </div>
                            <h3>Users</h3>
                            <p>Discover community members and their contributions</p>
                        </a>
                    </div>
                </div>

                <div className="welcome-section">
                    <h2 className="section-title">Community Guidelines</h2>
                    <div className="guidelines-content">
                        <div className="guideline-block">
                            <h3 className="guideline-title">
                                <CheckCircleIcon className="guideline-icon" />
                                Do's
                            </h3>
                            <ul className="guideline-list">
                                <li>Ask clear, specific, and well-researched questions</li>
                                <li>Provide context and relevant code examples</li>
                                <li>Be respectful and constructive in all interactions</li>
                                <li>Search for existing answers before posting</li>
                                <li>Use appropriate categories and tags</li>
                            </ul>
                        </div>

                        <div className="guideline-block">
                            <h3 className="guideline-title">
                                <XCircleIcon className="guideline-icon" />
                                Don'ts
                            </h3>
                            <ul className="guideline-list">
                                <li>Post spam, advertisements, or promotional content</li>
                                <li>Share offensive, abusive, or discriminatory content</li>
                                <li>Include personal attacks or harassment</li>
                                <li>Share private information or credentials</li>
                                <li>Post off-topic or irrelevant content</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="welcome-section warning-section">
                    <h2 className="section-title">
                        <AlertTriangleIcon width={28} height={28} />
                        Moderation Policy
                    </h2>
                    <div className="policy-content">
                        <p className="section-text">
                            Our administrators actively monitor the platform to maintain a healthy community.
                            Posts that violate our guidelines will be permanently banned and removed from public view.
                        </p>
                        <div className="policy-actions">
                            <div className="policy-action">
                                <ShieldBanIcon className="policy-icon" />
                                <div>
                                    <h4>Post Banning</h4>
                                    <p>Posts violating community guidelines will be permanently banned and hidden from the community</p>
                                </div>
                            </div>
                        </div>
                        <p className="policy-note">
                            <strong>Note:</strong> Always review your post before submitting. Quality content
                            that follows guidelines helps build a better community for everyone.
                        </p>
                    </div>
                </div>

                <div className="welcome-section cta-section">
                    <h2 className="section-title">Ready to Get Started?</h2>
                    <p className="section-text">
                        Join thousands of developers sharing knowledge and solving problems together.
                    </p>
                    <div className="cta-buttons">
                        <a href="/syntaxly/posts" className="cta-button primary">
                            Browse Posts
                        </a>
                        <a href="/syntaxly/posts/create" className="cta-button secondary">
                            Ask a Question
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomePage;