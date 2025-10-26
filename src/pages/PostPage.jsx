import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useFetch } from '~/hooks/useFetch.jsx';
import { useAuth } from '~/hooks/useAuth.jsx';
import { getAvatarUrl, getAssetUrl } from '~/utils/urlHelpers';
import { formatFullDateTime } from '~/utils/dateHelpers';
import { usePostInteractions } from '~/components/Posts/usePostInteractions';
import { useImageModal } from '~/components/Posts/useImageModal';
import { useContentExpansion } from '~/components/Posts/useContentExpansion';
import PostAuthorActions from '~/components/Posts/PostAuthorActions';
import CommentsSection from '~/components/Comments/CommentsSection';
import '~/styles/PostPage.css';

const API_URL = import.meta.env.VITE_SERVER_API || 'http://localhost:8080/api';

function PostPage() {
    const { post_id } = useParams();
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const viewCountedRef = useRef(false);

    const { data: postData, loading: postLoading, error: postError } = useFetch(`/posts/${post_id}`, { accessToken });
    const { data: imagesData, loading: imagesLoading } = useFetch(`/posts/${post_id}/images`, { accessToken });
    const { data: categoriesData } = useFetch(`/posts/${post_id}/categories`, { accessToken });

    const post = postData?.post;
    const images = imagesData?.images || [];
    const categories = categoriesData?.categories || [];

    const {
        rating,
        currentVote,
        isFavorite,
        isSubscribed,
        handleVote,
        handleToggleFavorite,
        handleToggleSubscribe
    } = usePostInteractions(
        post_id,
        post?.rating,
        postData?.isFavorite,
        postData?.isSubscribed
    );

    const {
        selectedImageIndex,
        openImageModal,
        closeImageModal,
        navigateImage
    } = useImageModal(images.length);

    const {
        contentRef,
        isExpanded,
        showExpandButton,
        toggleExpansion
    } = useContentExpansion(300, [post]);

    useEffect(() => {
        if (!post_id || viewCountedRef.current) return;

        const timer = setTimeout(async () => {
            try {
                await fetch(`${API_URL}/posts/${post_id}/views`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                viewCountedRef.current = true;
            } catch (error) {
                console.error('Failed to increment view count:', error);
            }
        }, 30000);

        return () => clearTimeout(timer);
    }, [post_id]);

    if (postLoading) {
        return (
            <section className="content-section">
                <div className="loading-indicator">
                    <p>Loading post...</p>
                </div>
            </section>
        );
    }

    if (postError || !post) {
        return (
            <section className="content-section">
                <p className="error-message">
                    {postError || 'Post not found'}
                </p>
            </section>
        );
    }

    return (
        <section className="content-section">
            <div className="post-page-container">
                <div className="post-header">
                    <div className="post-title-row">
                        <h1 className="post-title">{post.title}</h1>
                        <PostAuthorActions
                            post_id={post_id}
                            author_id={post.author_id}
                            initialBanned={post.banned || false}
                        />
                    </div>
                    <div className="post-metadata">
                        <div
                            className="post-author-inline"
                            onClick={() => post.author_id && navigate(`/syntaxly/profile/${post.author_id}`)}
                        >
                            <img
                                src={getAvatarUrl(post.author_avatar)}
                                alt={post.author_name || 'Author'}
                                className="author-avatar-inline"
                            />
                            <span className="author-name-inline">{post.author_name || 'Anonymous'}</span>
                        </div>
                        <span className="post-date">
                            asked {formatFullDateTime(post.publish_date)}
                        </span>
                        <span className="post-status" data-status={post.status}>
                            {post.status}
                        </span>
                    </div>

                    {categories.length > 0 && (
                        <div className="post-tags-section">
                            {categories.map((category) => (
                                <span key={category.id} className="post-tag">
                                    {category.title}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {imagesLoading ? (
                    <div className="post-images-section">
                        <div className="loading-indicator">
                            <p>Loading images...</p>
                        </div>
                    </div>
                ) : images.length > 0 && (
                    <div className="post-images-section">
                        <div className="post-images-grid">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className="post-image-wrapper"
                                    onClick={() => openImageModal(index)}
                                >
                                    <img
                                        src={getAssetUrl(image.path)}
                                        alt={`Post image ${index + 1}`}
                                        className="post-image"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="post-content-section">
                    <div className="post-voting-sidebar">
                        <button
                            className={`vote-button vote-up ${currentVote === 'like' ? 'voted-up' : ''}`}
                            onClick={() => handleVote('like')}
                            aria-label="Vote up"
                        >
                            <svg viewBox="0 0 36 36" className="vote-icon">
                                <path d="M2 26h32L18 10 2 26z"></path>
                            </svg>
                        </button>
                        <div className="vote-count">{rating}</div>
                        <button
                            className={`vote-button vote-down ${currentVote === 'dislike' ? 'voted-down' : ''}`}
                            onClick={() => handleVote('dislike')}
                            aria-label="Vote down"
                        >
                            <svg viewBox="0 0 36 36" className="vote-icon">
                                <path d="M2 10h32L18 26 2 10z"></path>
                            </svg>
                        </button>
                        <div className="view-count">
                            <svg viewBox="0 0 24 24" className="view-icon">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
                            </svg>
                            <span className="view-count-text">{post.views || 0}</span>
                        </div>

                        <button
                            className={`action-button favorite-button ${isFavorite ? 'active' : ''}`}
                            onClick={handleToggleFavorite}
                            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            <svg viewBox="0 0 24 24" className="action-icon" fill="currentColor">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </button>

                        <button
                            className={`action-button subscribe-button ${isSubscribed ? 'active' : ''}`}
                            onClick={handleToggleSubscribe}
                            aria-label={isSubscribed ? "Unsubscribe from updates" : "Subscribe to updates"}
                            title={isSubscribed ? "Unsubscribe from updates" : "Subscribe to updates"}
                        >
                            <svg viewBox="0 0 24 24" className="action-icon" fill="currentColor">
                                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                            </svg>
                        </button>
                    </div>

                    <div className="post-main-content">
                        <div className={`post-content ${isExpanded ? 'expanded' : 'collapsed'}`} ref={contentRef}>
                            <p>{post.content}</p>
                        </div>

                        {showExpandButton && (
                            <button
                                className="expand-button"
                                onClick={toggleExpansion}
                            >
                                {isExpanded ? (
                                    <>
                                        <span>Show less</span>
                                        <svg viewBox="0 0 24 24" className="expand-icon">
                                            <path d="M7 14l5-5 5 5z" fill="currentColor"/>
                                        </svg>
                                    </>
                                ) : (
                                    <>
                                        <span>Show more</span>
                                        <svg viewBox="0 0 24 24" className="expand-icon">
                                            <path d="M7 10l5 5 5-5z" fill="currentColor"/>
                                        </svg>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                <CommentsSection postId={post_id} />
            </div>

            {selectedImageIndex !== null && (
                <div className="image-modal-overlay" onClick={closeImageModal}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="image-modal-close"
                            onClick={closeImageModal}
                            aria-label="Close modal"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>

                        {images.length > 1 && (
                            <>
                                <button
                                    className="image-modal-nav image-modal-prev"
                                    onClick={() => navigateImage('prev')}
                                    aria-label="Previous image"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                                    </svg>
                                </button>

                                <button
                                    className="image-modal-nav image-modal-next"
                                    onClick={() => navigateImage('next')}
                                    aria-label="Next image"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                                    </svg>
                                </button>
                            </>
                        )}

                        <img
                            src={getAssetUrl(images[selectedImageIndex].path)}
                            alt={`Post image ${selectedImageIndex + 1}`}
                            className="image-modal-img"
                        />

                        {images.length > 1 && (
                            <div className="image-modal-counter">
                                {selectedImageIndex + 1} / {images.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

export default PostPage;