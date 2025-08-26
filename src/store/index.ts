import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import categoriesReducer from "./slices/CategorySlice";
import cartReducer from "./slices/CartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
