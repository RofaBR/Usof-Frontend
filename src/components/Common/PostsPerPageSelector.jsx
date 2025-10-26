import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { setPostsPerPage } from '~/store/slices/filtersSlice';
import '~/styles/PostsPerPageSelector.css';

const PAGE_OPTIONS = [10, 20, 50, 100];

function PostsPerPageSelector() {
    const dispatch = useAppDispatch();
    const postsPerPage = useAppSelector((state) => state.filters.postsPerPage);

    const handleChange = (e) => {
        const value = parseInt(e.target.value, 10);
        dispatch(setPostsPerPage(value));
    };

    return (
        <div className="posts-per-page-selector">
            <label htmlFor="posts-per-page">Show:</label>
            <select
                id="posts-per-page"
                value={postsPerPage}
                onChange={handleChange}
                className="posts-per-page-select"
            >
                {PAGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                        {option} posts
                    </option>
                ))}
            </select>
        </div>
    );
}

export default PostsPerPageSelector;