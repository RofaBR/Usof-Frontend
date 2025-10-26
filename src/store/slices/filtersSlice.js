import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sortBy: 'publish_date',
    sortDirection: 'DESC',
    postsPerPage: 10,
    selectedCategories: [],
    activeFilters: {
        status: 'active',
        favoritesOnly: false,
        unanswered: false,
    },
};

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },
        setSortDirection: (state, action) => {
            state.sortDirection = action.payload;
        },
        toggleSortDirection: (state) => {
            state.sortDirection = state.sortDirection === 'DESC' ? 'ASC' : 'DESC';
        },
        setPostsPerPage: (state, action) => {
            state.postsPerPage = action.payload;
        },
        setSelectedCategories: (state, action) => {
            state.selectedCategories = action.payload;
        },
        toggleCategory: (state, action) => {
            const categoryId = action.payload;
            const index = state.selectedCategories.indexOf(categoryId);
            if (index > -1) {
                state.selectedCategories.splice(index, 1);
            } else {
                state.selectedCategories.push(categoryId);
            }
        },
        setActiveFilters: (state, action) => {
            state.activeFilters = { ...state.activeFilters, ...action.payload };
        },
        setFavoritesOnly: (state, action) => {
            state.activeFilters.favoritesOnly = action.payload;
        },
        setUnanswered: (state, action) => {
            state.activeFilters.unanswered = action.payload;
        },
        setStatus: (state, action) => {
            state.activeFilters.status = action.payload;
        },
        resetFilters: (state) => {
            return initialState;
        },
    },
});

export const {
    setSortBy,
    setSortDirection,
    toggleSortDirection,
    setPostsPerPage,
    setSelectedCategories,
    toggleCategory,
    setActiveFilters,
    setFavoritesOnly,
    setUnanswered,
    setStatus,
    resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;