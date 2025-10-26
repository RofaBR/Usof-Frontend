import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~/hooks/useAuth.jsx';
import { getAssetUrl } from '~/utils/urlHelpers';
import toast from 'react-hot-toast';
import '~/styles/CreatePostForm.css';

const API_URL = import.meta.env.VITE_SERVER_API || 'http://localhost:8080/api';

function CreatePostForm({ onCancel, onDelete, editMode = false, initialData = null, postId = null}) {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const [form, setForm] = useState({
        title: initialData?.title || '',
        content: initialData?.content || '',
        categories: initialData?.categories || [],
        status: initialData?.status || 'active',
    });
    const [availableCategories, setAvailableCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState(initialData?.images || []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/categories/`);
                if (response.ok) {
                    const data = await response.json();
                    setAvailableCategories(data.categories || []);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleCategory = (categoryId) => {
        setForm(prev => ({
            ...prev,
            categories: prev.categories.includes(categoryId)
                ? prev.categories.filter(id => id !== categoryId)
                : [...prev.categories, categoryId]
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length + selectedImages.length > 10) {
            toast.error('Maximum 10 images allowed');
            return;
        }

        const validFiles = [];
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not an image file`);
                continue;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} exceeds 5MB limit`);
                continue;
            }
            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        const newPreviews = validFiles.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));

        setSelectedImages(prev => [...prev, ...validFiles]);
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index].url);

        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
        };
    }, [imagePreviews]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!accessToken) {
            navigate('/auth/login');
            return;
        }

        setSubmitting(true);

        try {
            if (editMode && postId) {
                const formData = new FormData();
                formData.append('title', form.title);
                formData.append('content', form.content);
                formData.append('status', form.status);

                form.categories.forEach(categoryId => {
                    formData.append('categories[]', categoryId);
                });

                const keepImageFilenames = existingImages.map(img => img.filename);
                formData.append('keepImages', JSON.stringify(keepImageFilenames));

                selectedImages.forEach(image => {
                    formData.append('images', image);
                });

                const response = await fetch(`${API_URL}/posts/${postId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: formData
                });

                if (response.status === 401) {
                    navigate('/auth/login');
                    return;
                }

                if (response.ok) {
                    toast.success('Post updated successfully!');
                    imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
                    navigate(`/syntaxly/post/${postId}`);
                } else {
                    const error = await response.json();
                    toast.error(error.message || 'Failed to update post');
                }
            } else {
                const formData = new FormData();
                formData.append('title', form.title);
                formData.append('content', form.content);

                form.categories.forEach(categoryId => {
                    formData.append('categories[]', categoryId);
                });

                selectedImages.forEach(image => {
                    formData.append('images', image);
                });

                const response = await fetch(`${API_URL}/posts/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: formData
                });

                if (response.status === 401) {
                    navigate('/auth/login');
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    const newPostId = data.post.id;

                    toast.success('Post created successfully!');
                    imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));

                    navigate(`/syntaxly/post/${newPostId}`);
                } else {
                    const error = await response.json();
                    toast.error(error.message || 'Failed to create post');
                }
            }
        } catch (err) {
            console.error(`Error ${editMode ? 'updating' : 'creating'} post:`, err);
            toast.error(`An error occurred while ${editMode ? 'updating' : 'creating'} the post`);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredCategories = availableCategories.filter(cat =>
        cat.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="create-post-container">
            <div className="create-post-header">
                <h2>{editMode ? 'Edit Post' : 'Create a New Post'}</h2>
                <p className="create-post-subtitle">
                    {editMode ? 'Update your post details and settings' : 'Share your knowledge or ask for help from the community'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="create-post-form">
                <div className="form-group">
                    <label htmlFor="title">Title <span className="required">*</span></label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Be specific and clear about your question or topic"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                    <small className="form-hint">Keep it concise and descriptive</small>
                </div>

                <div className="form-group">
                    <label htmlFor="content">Content <span className="required">*</span></label>
                    <textarea
                        id="content"
                        name="content"
                        rows="12"
                        placeholder="Provide detailed information, code examples, or context to help others understand your post..."
                        value={form.content}
                        onChange={handleChange}
                        required
                    />
                    <small className="form-hint">Include all relevant details and code snippets</small>
                </div>

                {editMode && (
                    <div className="form-group">
                        <label htmlFor="status">Post Status</label>
                        <select
                            id="status"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="status-select"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <small className="form-hint">Inactive posts are hidden from public view</small>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="images">Images</label>
                    <div className="image-upload-section">
                        <input
                            type="file"
                            id="images"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="images" className="image-upload-btn">
                            <span>Choose Images</span>
                        </label>
                        <small className="form-hint">
                            Max 10 images, 5MB each. Supported formats: JPG, PNG, GIF, WebP
                        </small>
                    </div>

                    {(existingImages.length > 0 || imagePreviews.length > 0) && (
                        <div className="image-previews">
                            {existingImages.map((image, index) => (
                                <div key={`existing-${image.filename}`} className="image-preview-item">
                                    <img src={getAssetUrl(image.path)} alt={`Image ${index + 1}`} />
                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={() => removeExistingImage(index)}
                                        title="Remove image"
                                    >
                                        &times;
                                    </button>
                                    <small className="image-name">{image.filename}</small>
                                </div>
                            ))}

                            {imagePreviews.map((preview, index) => (
                                <div key={`new-${index}`} className="image-preview-item">
                                    <img src={preview.url} alt={`Preview ${index + 1}`} />
                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={() => removeImage(index)}
                                        title="Remove image"
                                    >
                                        &times;
                                    </button>
                                    <small className="image-name">{preview.file.name}</small>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-group categories-section">
                    <label htmlFor="categories">Categories</label>

                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="category-search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {loading ? (
                        <div className="categories-loading">Loading categories...</div>
                    ) : (
                        <div className="categories-scroll">
                            {filteredCategories.length === 0 ? (
                                <p className="no-categories">No categories found</p>
                            ) : (
                                filteredCategories.map(category => (
                                    <button
                                        key={category.id}
                                        type="button"
                                        className={`category-chip ${form.categories.includes(category.id) ? 'selected' : ''}`}
                                        onClick={() => toggleCategory(category.id)}
                                    >
                                        {category.title}
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                    <small className="form-hint">Select all categories that match your post</small>
                </div>

                <div className="form-actions">
                    {editMode && (
                        <button
                            type="button"
                            className="form-action-button delete-button"
                            onClick={onDelete}
                            title="Delete post permanently"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                            Delete Post
                        </button>
                    )}
                    <button type="button" className="btn-cancel" onClick={onCancel} disabled={submitting}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-submit" disabled={submitting}>
                        <span>{submitting ? (editMode ? 'Updating...' : 'Publishing...') : (editMode ? 'Update Post' : 'Publish Post')}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreatePostForm;
