import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import categoriesReducer from "./slices/CategorySlice";
import cartReducer from "./slices/CartSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

/* ---------------- root reducer ---------------- */
const rootReducer = combineReducers({
  auth: authReducer,
  categories: categoriesReducer,
  cart: cartReducer,
});

/* ---------------- persist config ---------------- */
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "auth"], // 👈 cart persist hoga
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/* ---------------- store ---------------- */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

/* ---------------- persistor ---------------- */
export const persistor = persistStore(store);

/* ---------------- types ---------------- */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
