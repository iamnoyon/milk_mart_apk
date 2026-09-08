import { transformListResponse } from "@/utils/responseTransformer";
import { apiSlice } from "../../apiSlice";

export const tableSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTable: builder.mutation({
      query: (data) => ({
        url: "/tables",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["tables"],
    }),
    getTableList: builder.query({
      query: (params) => ({
        url: "/tables",
        method: "GET",
        params,
      }),
      transformResponse: (response) => transformListResponse(response),

      providesTags: ["tables"],
    }),
    getTableById: builder.query({
      query: ({ id }) => ({
        url: `/tables/${id}`,
        method: "GET",
      }),
    }),
    updateTableByID: builder.mutation({
      query: ({ id, data }) => ({
        url: `/tables/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["tables"],
    }),
    getTableDropdown: builder.query({
      query: () => ({
        url: `/tables/dropdown`,
        method: "GET",
      }),
    }),
    deleteTable: builder.mutation({
      query: (id) => ({
        url: `/tables/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tables"],
    })
  }),
  overrideExisting: true,
});

export const {
useCreateTableMutation,
useLazyGetTableListQuery,
useUpdateTableByIDMutation,
useDeleteTableMutation,
useGetTableByIdQuery,
useGetTableDropdownQuery
} = tableSlice;
