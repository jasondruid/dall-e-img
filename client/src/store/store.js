import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import themeSlice from './themeSlice';
import { persistStore, persistReducer } from 'redux-persist';

const persistThemeConfig = {
    key: 'theme',
    storage,
    whitelist: ['theme']
};


const store = configureStore({
    reducer: {
        theme: persistReducer(persistThemeConfig, themeSlice)
    },
    middleware: (defaultMiddleware) =>
        defaultMiddleware({
            serializableCheck: false
        })

});

export const persistor = persistStore(store);

export default store;