function PostsIcon({ width = 20, height = 20, className = "" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 4v16M4 12h16"></path>
        </svg>
    );
}

export default PostsIcon;