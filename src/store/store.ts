import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import interviewReducer from './slices/interviewSlice';
import resourceReducer from './slices/resourceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    interviews: interviewReducer,
    resources: resourceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;