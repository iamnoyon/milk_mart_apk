import { transformListResponse } from "@/utils/responseTransformer";
import { apiSlice } from "../../apiSlice";

export const paymentSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation({
      query: (data) => ({
        url: "/payments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payments"],
    }),
    getPaymentList: builder.query({
      query: (params) => ({
        url: "/payment/admin/list",
        method: "GET",
        params,
      }),
      transformResponse: (response) => transformListResponse(response),
      providesTags: ["Payments"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreatePaymentMutation,
  useLazyGetPaymentListQuery,
} = paymentSlice;
