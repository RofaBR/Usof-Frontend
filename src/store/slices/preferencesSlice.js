import { createSlice } from '@reduxjs/toolkit';

const loadPreferences = () => {
    try {
        const saved = localStorage.getItem('userPreferences');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Failed to load preferences from localStorage:', error);
    }
    return {
        defaultSortBy: 'publish_date',
        defaultSortDirection: 'DESC',
        defaultPostsPerPage: 10,
        viewMode: 'list',
    };
};

const savePreferences = (preferences) => {
    try {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
        console.error('Failed to save preferences to localStorage:', error);
    }
};

const preferencesSlice = createSlice({
    name: 'preferences',
    initialState: loadPreferences(),
    reducers: {
        setDefaultSortBy: (state, action) => {
            state.defaultSortBy = action.payload;
            savePreferences(state);
        },
        setDefaultSortDirection: (state, action) => {
            state.defaultSortDirection = action.payload;
            savePreferences(state);
        },
        setDefaultPostsPerPage: (state, action) => {
            state.defaultPostsPerPage = action.payload;
            savePreferences(state);
        },
        setViewMode: (state, action) => {
            state.viewMode = action.payload;
            savePreferences(state);
        },
        resetPreferences: (state) => {
            const defaults = {
                defaultSortBy: 'publish_date',
                defaultSortDirection: 'DESC',
                defaultPostsPerPage: 10,
                viewMode: 'list',
            };
            savePreferences(defaults);
            return defaults;
        },
    },
});

export const {
    setDefaultSortBy,
    setDefaultSortDirection,
    setDefaultPostsPerPage,
    setViewMode,
    resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;