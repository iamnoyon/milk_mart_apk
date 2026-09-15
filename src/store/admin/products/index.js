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
    })
  }),
  overrideExisting: true,
});

export const {
  useGetProductListQuery
} = productSlice;
