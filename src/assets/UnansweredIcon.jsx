function UnansweredIcon({ width = 20, height = 20, className = "" }) {
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
            <path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4A8.5 8.5 0 0 1 12 20a8.38 8.38 0 0 1-5.4-1.9L3 21l1.9-3.6A8.38 8.38 0 0 1 3 12a8.5 8.5 0 0 1 3.1-6.6A8.38 8.38 0 0 1 12 4a8.5 8.5 0 0 1 6.6 3.1A8.38 8.38 0 0 1 21 11.5z" />

            <path d="M12 8a2 2 0 0 1 2 2c0 1.5-2 2-2 3" />
            <line x1="12" y1="17" x2="12" y2="17.01" />
        </svg>
    );
}

export default UnansweredIcon;
