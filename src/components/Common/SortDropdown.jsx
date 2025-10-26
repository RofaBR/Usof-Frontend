import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { setSortBy, toggleSortDirection } from '~/store/slices/filtersSlice';
import '~/styles/SortDropdown.css';
import { ICONS } from '~/assets/SortDropdownIcons.jsx';

const SORT_OPTIONS = [
    { value: 'publish_date', label: 'Newest', icon: ICONS.publish_date },
    { value: 'last_update', label: 'Recent Activity', icon: ICONS.last_update },
    { value: 'views', label: 'Most Views', icon: ICONS.views },
    { value: 'score', label: 'Highest Rated', icon: ICONS.score },
    { value: 'likes', label: 'Most Liked', icon: ICONS.likes },
];

function SortDropdown() {
    const dispatch = useAppDispatch();
    const { sortBy, sortDirection } = useAppSelector((state) => state.filters);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentOption = SORT_OPTIONS.find((opt) => opt.value === sortBy) || SORT_OPTIONS[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSortChange = (value) => {
        dispatch(setSortBy(value));
        setIsOpen(false);
    };

    const handleToggleDirection = () => {
        dispatch(toggleSortDirection());
    };

    return (
        <div className="sort-dropdown-container" ref={dropdownRef}>
            <button
                className="sort-dropdown-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Sort options"
            >
                <span className="sort-icon">{currentOption.icon}</span>
                <span className="sort-label">{currentOption.label}</span>
                <svg
                    className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <button
                className="sort-direction-toggle"
                onClick={handleToggleDirection}
                title={sortDirection === 'DESC' ? 'Sort Descending' : 'Sort Ascending'}
                aria-label={`Sort direction: ${sortDirection === 'DESC' ? 'Descending' : 'Ascending'}`}
            >
                <span className={`direction-icon ${sortDirection === 'DESC' ? 'descending' : ''}`}>
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >

                        <path d="M12 20V4m-6 6l6-6 6 6" />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div className="sort-dropdown-menu">
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            className={`sort-option ${sortBy === option.value ? 'active' : ''}`}
                            onClick={() => handleSortChange(option.value)}
                        >
                            <span className="option-icon">{option.icon}</span>
                            <span className="option-label">{option.label}</span>
                            {sortBy === option.value && (
                                <svg className="check-icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SortDropdown;