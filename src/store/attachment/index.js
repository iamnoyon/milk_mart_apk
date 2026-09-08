import { apiSlice } from "../apiSlice";

export const attachmentSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    singleFileUpload: builder.mutation({
      query: (data) => ({
        url: "/upload",
        method: "POST",
        body: data,
      }),
    }),
    multipleFileUpload: builder.mutation({
      query: (data) => ({
        url: "/upload/multiple",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useSingleFileUploadMutation,
  useMultipleFileUploadMutation
} = attachmentSlice;
