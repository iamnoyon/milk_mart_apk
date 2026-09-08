import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { rootReducer } from './reducers'
import { apiSlice } from './apiSlice'

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat([
        apiSlice.middleware
    ])
})

setupListeners(store.dispatch)
