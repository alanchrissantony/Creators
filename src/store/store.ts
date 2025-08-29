import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authApi } from "@/store/api/authApi";
import authReducer from "@/store/slice/authSlice";
import { postsApi } from "@/store/api/postsApi";
import { commentsApi } from "@/store/api/commentsApi";
import commentsReducer from "@/store/slice/commentsSlice";
import { userApi } from "@/store/api/userApi"; 
import userReducer from "@/store/slice/userSlice";

import { adminAuthApi } from "@/store/api/adminAuthApi";
import adminAuthReducer from "@/store/slice/adminSliceAuth";

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
import storage from "redux-persist/lib/storage";
import { adminApi } from "@/store/api/adminApi";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [postsApi.reducerPath]: postsApi.reducer,
  [commentsApi.reducerPath]: commentsApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [adminAuthApi.reducerPath]: adminAuthApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  auth: authReducer,
  comments: commentsReducer,
  user: userReducer,
  adminAuth: adminAuthReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "user", "adminAuth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      postsApi.middleware,
      commentsApi.middleware,
      userApi.middleware,
      adminAuthApi.middleware,
      adminApi.middleware
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
