import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slices/userSlice';
import sidebarReducer from './Slices/sidebarSlice';
import summaryReducer from './Slices/summarySlice';

const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    user: userReducer,
    summary: summaryReducer,
  }
});

export default store;
