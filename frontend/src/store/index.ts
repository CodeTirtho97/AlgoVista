import { configureStore } from '@reduxjs/toolkit';

// Initial empty store
export const store = configureStore({
  reducer: {},
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;