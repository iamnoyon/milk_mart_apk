import { apiSlice } from "../../apiSlice";

export const orderSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    applyCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupons/apply",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useApplyCouponMutation
} = orderSlice;
