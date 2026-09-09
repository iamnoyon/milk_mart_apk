import { apiSlice } from "../apiSlice";

export const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/auth/me",
    }),
    userRegister: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    userLoginOTPVerify: builder.mutation({
      query: (otpData) => ({
        url: "/auth/login",
        method: "POST",
        body: otpData,
      }),
    }),
    resendOTPForRegisterdUserToLogin: builder.mutation({
      query: (userData) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: userData,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetProfileQuery,
  useUserRegisterMutation,
  useUserLoginOTPVerifyMutation,
  useResendOTPForRegisterdUserToLoginMutation,
} = authSlice;
