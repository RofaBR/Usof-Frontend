function CategoriesIcon({ width = 20, height = 20, className = "" }) {
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
            <rect x="3" y="3" width="7" height="7" rx="1" ry="1"></rect>
            <rect x="14" y="3" width="7" height="7" rx="1" ry="1"></rect>
            <rect x="3" y="14" width="7" height="7" rx="1" ry="1"></rect>
            <rect x="14" y="14" width="7" height="7" rx="1" ry="1"></rect>
        </svg>
    );
}

export default CategoriesIcon;
