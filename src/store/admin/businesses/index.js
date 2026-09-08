import { apiSlice } from "../../apiSlice";
import { transformListResponse } from "@/utils/responseTransformer";

export const businessSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateBusiness: builder.mutation({
      query: (data) => ({
        url: "/business",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),
    getBusinessInfo: builder.query({
      query: () => ({
        url: "/business/my",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
    getBusinessListForSuperadmin: builder.query({
      query: (params) => ({
         url: "/business/list",
         method: "GET",
         params,
      }),
      transformResponse: (response) => transformListResponse(response),
      providesTags: ["Business"],
    }),
    getBusinessInfoForSuperadmin: builder.query({
      query: ({id})=>({
        url: `/business/list/${id}`,
        method: 'GET'
      })
    }),
    updateBusinessInfoForSuperadmin: builder.mutation({
      query: ({id, data})=>({
        url: `/business/list/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Business']
    })
  }),
  overrideExisting: true,
});

export const {
    useUpdateBusinessMutation,
    useGetBusinessInfoQuery,
    useLazyGetBusinessListForSuperadminQuery,
    useGetBusinessInfoForSuperadminQuery,
    useUpdateBusinessInfoForSuperadminMutation
} = businessSlice;
