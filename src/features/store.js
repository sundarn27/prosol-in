import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userDataReducer from './userSlice';
import fileReducer from './fileSlice';
import materialDataReducer from './materialSlice';
import botDataReducer from './commonSlice';
import singleMaterialReducer from './singleMaterialSlice';
import dictionaryReducer from './dictionarySlice';
import importReducer from './importSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        userData: userDataReducer,
        file: fileReducer,
        materialData: materialDataReducer,
        botDataRes: botDataReducer,
        singleData: singleMaterialReducer,
        dictionaryData: dictionaryReducer,
        importData: importReducer, 
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
