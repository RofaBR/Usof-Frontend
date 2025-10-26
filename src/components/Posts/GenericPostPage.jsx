import { useNavigate } from 'react-router-dom';
import PostList from '~/components/Posts/PostList.jsx';
import SortDropdown from '~/components/Common/SortDropdown.jsx';
import PostsPerPageSelector from '~/components/Common/PostsPerPageSelector.jsx';
import '~/styles/MainPage.css';

function GenericPostPage({ title, showCreateButton = false, showSortControls = true, showAllStatuses = false, postListProps = {} }) {
    const navigate = useNavigate();

    const handleCreatePost = () => {
        navigate('/syntaxly/posts/create');
    };

    return (
        <section className="content-section">
            <div className="content-header">
                <h2>{title}</h2>
                <div className="header-actions">
                    {showSortControls && (
                        <>
                            <PostsPerPageSelector />
                            <SortDropdown />
                        </>
                    )}
                    {showCreateButton && (
                        <button className="create-post-btn" onClick={handleCreatePost}>
                            <span className="btn-icon">+</span> Create Post
                        </button>
                    )}
                </div>
            </div>
            <PostList {...postListProps} showAllStatuses={showAllStatuses} />
        </section>
    );
}

export default GenericPostPage;