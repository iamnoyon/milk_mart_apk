import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./apiSlice";
import UserReducer from "./user/index";
import CartReducer from "./cart/index";

const cartPersistConfig = {
  key: "cart",
  storage: AsyncStorage,
  whitelist: ["items"],
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  user: UserReducer,
  cart: persistReducer(cartPersistConfig, CartReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([apiSlice.middleware]),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
