import { apiSlice } from "../apiSlice";

export const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    userRegister: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useUserRegisterMutation,
} = authSlice;
