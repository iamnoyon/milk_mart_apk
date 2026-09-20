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
    placeOrder: builder.mutation({
      query: (data) => ({
        url: "/orders/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),
    getOrder: builder.query({
      query: ({ id }) => ({
        url: `/orders/${id}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useApplyCouponMutation,
  usePlaceOrderMutation,
  useGetOrderQuery,
} = orderSlice;
