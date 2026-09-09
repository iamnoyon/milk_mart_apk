import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
 // https://fmd-6pes.onrender.com
 //http://192.168.30.88:8000
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://fmd-6pes.onrender.com',
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.user?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  refetchOnMountOrArgChange: true,
  endpoints: () => ({}),
  tagTypes: ["userlist", "Categories", "Products", "tables", "expenses", "Orders", "Packages", "Business", "Payments", "health"]
});