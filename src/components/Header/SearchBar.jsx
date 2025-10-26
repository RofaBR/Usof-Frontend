import { useCallback, useState } from 'react';
import { useSearch } from '~/contexts/SearchContext.jsx';
import '~/styles/SearchBar.css';

function SearchBar() {
    const { setSearchQuery } = useSearch();
    const [inputValue, setInputValue] = useState('');

    const handleChange = useCallback((e) => {
        const value = e.target.value;
        setInputValue(value);
        setSearchQuery(value);
    }, [setSearchQuery]);

    return (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            value={inputValue}
            onChange={handleChange}
            className="search-input"
          />
          <div className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        </div>
    );
}

export default SearchBar;