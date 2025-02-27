import { configureStore } from '@reduxjs/toolkit';
import materialDataSlice from './materialSlice';
import botDataSlice from './commonSlice';
import singleMaterialSlice from './singleMaterialSlice';
import dictionarySlice from './dictionarySlice';
import importSlice from './importSlice';

const store = configureStore({
    reducer: {
        materialData: materialDataSlice,
        botDataRes: botDataSlice,
        singleData: singleMaterialSlice,
        dictionaryData: dictionarySlice,
        import: importSlice,
    }
});

export default store;
