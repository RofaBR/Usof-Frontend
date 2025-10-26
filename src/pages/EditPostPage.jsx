import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '~/hooks/useAuth';
import CreatePostForm from '~/components/Posts/CreatePostForm';

const API_URL = import.meta.env.VITE_SERVER_API || 'http://localhost:8080/api';

function EditPostPage() {
    const { post_id } = useParams();
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const [postData, setPostData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostData = async () => {
            if (!accessToken) {
                navigate('/auth/login');
                return;
            }

            try {
                const postResponse = await fetch(`${API_URL}/posts/${post_id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!postResponse.ok) {
                    throw new Error('Failed to fetch post');
                }

                const postJson = await postResponse.json();
                const post = postJson.post;

                const categoriesResponse = await fetch(`${API_URL}/posts/${post_id}/categories`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                let categoryIds = [];
                if (categoriesResponse.ok) {
                    const categoriesJson = await categoriesResponse.json();
                    categoryIds = (categoriesJson.categories || []).map(cat => cat.id);
                }

                const imagesResponse = await fetch(`${API_URL}/posts/${post_id}/images`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                let images = [];
                if (imagesResponse.ok) {
                    const imagesJson = await imagesResponse.json();
                    images = imagesJson.images || [];
                }

                setPostData({
                    title: post.title,
                    content: post.content,
                    status: post.status,
                    categories: categoryIds,
                    images: images
                });
            } catch (err) {
                console.error('Error fetching post:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPostData();
    }, [post_id, accessToken, navigate]);

    const handleCancel = () => {
        navigate(`/syntaxly/post/${post_id}`);
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/posts/${post_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                navigate('/');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to delete post');
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('Failed to delete post. Please try again.');
        }
    };

    if (loading) {
        return (
            <section className="content-section">
                <div className="loading-indicator">
                    <p>Loading post...</p>
                </div>
            </section>
        );
    }

    if (error || !postData) {
        return (
            <section className="content-section">
                <p className="error-message">
                    {error || 'Post not found'}
                </p>
            </section>
        );
    }

    return (
        <section className="content-section">
            <CreatePostForm
                editMode={true}
                initialData={postData}
                postId={post_id}
                onCancel={handleCancel}
                onDelete={handleDelete}
            />
        </section>
    );
}

export default EditPostPage;