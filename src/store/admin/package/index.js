import { apiSlice } from "../../apiSlice";

export const packageSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPackage: builder.mutation({
      query: (data) => ({
        url: "/packages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Packages"],
    }),
    getPackageList: builder.query({
      query: (params) => ({
        url: "/packages",
        method: "GET",
        params,
      }),
      transformResponse: (response) => {
        const data = response?.data;
        return {
          dataSource: Array.isArray(data) ? data : [],
          totalRecords: Array.isArray(data) ? data.length : 0,
          pageAndLimit: { page: 1, limit: 10 },
          paginationOn: false,
        };
      },
      providesTags: ["Packages"],
    }),
    getPackageById: builder.query({
      query: ({ id }) => ({
        url: `/packages/${id}`,
        method: "GET",
      }),
    }),
    updatePackageByID: builder.mutation({
      query: ({ id, data }) => ({
        url: `/packages/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Packages"],
    }),
    deletePackage: builder.mutation({
      query: (id) => ({
        url: `/packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Packages"],
    }),
    makePayment: builder.mutation({
      query: (data)=>({
        url: '/payment/initiate',
        method: 'POST',
        body: data
      })
    }),
    adminPurchasePackage: builder.mutation({
      query: (data) => ({
        url: '/payment/admin/purchase',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payments', 'Packages'],
    }),
    checkPaymentStatus: builder.query({
      query: ({tran_id}) => ({
        url: `/payment/status/${tran_id}`,
        method: 'GET'
      })
    })
  }),
  overrideExisting: true,
});

export const {
useCreatePackageMutation,
useLazyGetPackageListQuery,
useUpdatePackageByIDMutation,
useDeletePackageMutation,
useGetPackageByIdQuery,
useMakePaymentMutation,
useAdminPurchasePackageMutation,
useCheckPaymentStatusQuery
} = packageSlice;
