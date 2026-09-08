import { apiSlice } from "../../apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPermissionList: builder.query({
      query: () => ({
        url: "/admin/permissions/list",
        method: "GET",
      }),
    }),
    getUserDropdownWithPermissions: builder.query({
      query: () => ({
        url: "/user/dropdown-with-permissions",
        method: "GET",
      }),
    }),
    updateUserRoleAndPermissions: builder.mutation({
      query: (data)=>({
        url: '/user/update-permissions',
        method: 'PUT',
        body: data
      })
    })
  }),
  overrideExisting: true,
});

export const {
  useGetPermissionListQuery,
  useGetUserDropdownWithPermissionsQuery,
  useUpdateUserRoleAndPermissionsMutation
} = userApiSlice;
