import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFetch } from '~/hooks/useFetch.jsx';
import PostList from '~components/Posts/PostList.jsx';
import '~/styles/CategoriesPage.css';

function CategoriesPage() {
    const [searchParams] = useSearchParams();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const { data, loading, error } = useFetch('/categories');

    const categories = data?.categories || [];

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            const categoryId = parseInt(categoryParam, 10);
            if (!isNaN(categoryId) && !selectedCategories.includes(categoryId)) {
                setSelectedCategories([categoryId]);
            }
        }
    }, [searchParams]);

    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    const clearSelection = () => {
        setSelectedCategories([]);
    };

    if (loading) {
        return (
            <section className="content-section">
                <h2>Categories</h2>
                <div className="loading-indicator">
                    <p>Loading categories...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="content-section">
                <h2>Categories</h2>
                <p className="error-message">Error: {error}</p>
            </section>
        );
    }

    return (
        <section className="content-section">
            <h2>Categories</h2>

            <div className="categories-filter-section">
                <div className="categories-header">
                    <p className="categories-description">
                        {selectedCategories.length > 0
                            ? `Showing posts from ${selectedCategories.length} ${selectedCategories.length === 1 ? 'category' : 'categories'}`
                            : 'Select categories to filter posts'
                        }
                    </p>
                    {selectedCategories.length > 0 && (
                        <button onClick={clearSelection} className="clear-selection-btn">
                            Clear All
                        </button>
                    )}
                </div>

                <div className="categories-grid">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => toggleCategory(category.id)}
                            className={`category-chip ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
                        >
                            <span className="category-title">{category.title}</span>
                            {category.description && (
                                <span className="category-description">{category.description}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="categories-posts-section">
                <h3>Posts</h3>
                <PostList categoryIds={selectedCategories} />
            </div>
        </section>
    );
}

export default CategoriesPage;