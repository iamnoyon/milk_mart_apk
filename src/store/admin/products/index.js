import { apiSlice } from "../../apiSlice";

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    getProductList: builder.query({
      query: () => ({
        url: "/products/list",
        method: "GET",
      }),
    }),
    getProductsByCategoryId: builder.query({
      query: ({id}) => ({
        url: `/products/category/${id}`,
        method: "GET",
      }),
    }),
    getProductbyId: builder.query({
      query: ({id}) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
    })
  }),
  overrideExisting: true,
});

export const {
  useGetProductListQuery,
  useGetProductsByCategoryIdQuery,
  useLazyGetProductsByCategoryIdQuery,
  useGetProductbyIdQuery
} = productSlice;
