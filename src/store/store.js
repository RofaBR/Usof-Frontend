import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './slices/filtersSlice';
import preferencesReducer from './slices/preferencesSlice';

export const store = configureStore({
    reducer: {
        filters: filtersReducer,
        preferences: preferencesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;