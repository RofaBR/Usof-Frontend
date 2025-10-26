function RecentIcon({ width = 20, height = 20, className = "" }) {
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
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6h6"></path>
        </svg>
    );
}

export default RecentIcon;