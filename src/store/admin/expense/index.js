import { apiSlice } from "../../apiSlice";
import { transformListResponse } from "@/utils/responseTransformer";

export const expenseSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createExpense: builder.mutation({
      query: (data) => ({
        url: "/expenses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["expenses"],
    }),
    getExpenseList: builder.query({
      query: (params) => ({
        url: "/expenses",
        method: "GET",
        params,
      }),
      providesTags: ["expenses"],
      transformResponse: (response) => transformListResponse(response),
    }),
    getExpenseById: builder.query({
      query: ({ id }) => ({
        url: `/expenses/${id}`,
        method: "GET",
      }),
    }),
    updateExpenseByID: builder.mutation({
      query: ({ id, data }) => ({
        url: `/expenses/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["expenses"],
    })
  }),
  overrideExisting: true,
});

export const {
    useCreateExpenseMutation,
    useLazyGetExpenseListQuery,
    useGetExpenseByIdQuery,
    useUpdateExpenseByIDMutation
} = expenseSlice;
