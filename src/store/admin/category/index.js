import { transformListResponse } from "@/utils/responseTransformer";
import { apiSlice } from "../../apiSlice";

export const categorySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    getCategoryList: builder.query({
      query: (params) => ({
        url: "/categories",
        method: "GET",
        params,
      }),
      transformResponse: (response) => transformListResponse(response),

      providesTags: ["Categories"],
    }),
    getCategoryById: builder.query({
      query: ({ id }) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),
    }),
    updateCategoryByID: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    getCategoryDropdown: builder.query({
      query: () => ({
        url: `/categories/dropdown`,
        method: "GET",
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    })
  }),
  overrideExisting: true,
});

export const {
  useCreateCategoryMutation,
  useGetCategoryListQuery,
  useLazyGetCategoryListQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryByIDMutation,
  useGetCategoryDropdownQuery,
  useDeleteCategoryMutation
} = categorySlice;
