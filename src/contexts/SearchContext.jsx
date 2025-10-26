import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useDebounce } from '~/hooks/useDebounce.jsx';

const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [searchTerm, setSearchTerm] = useState('');
    const searchQuery = useDebounce(searchTerm, 500);

    const setSearchQuery = useCallback((value) => {
        setSearchTerm(value);
    }, []);

    const value = useMemo(() => ({
        searchQuery,
        setSearchQuery,
    }), [searchQuery, setSearchQuery]);

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within SearchProvider');
    }
    return context;
}