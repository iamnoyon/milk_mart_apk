import { combineReducers } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import UserReducer from './user/index';
import CartReducer from './cart/index';

export const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: UserReducer,
    cart: CartReducer,
})