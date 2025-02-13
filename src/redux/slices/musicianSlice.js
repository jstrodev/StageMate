import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const musicianApi = createApi({
  reducerPath: "musicianApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "https://your-api-url.com/api" }), // Update with an actual URL
  endpoints: (builder) => ({
    getMusicians: builder.query({
      query: () => "/musicians",
    }),
    getMusicianById: builder.query({
      query: (id) => `/musicians/${id}`,
    }),
    addMusician: builder.mutation({
      query: (musicianId) => ({
        url: `/musicians/${musicianId}/add`,
        method: "POST",
      }),
    }),
    deleteMusician: builder.mutation({
      query: (musicianId) => ({
        url: `/musicians/${musicianId}/delete`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetMusiciansQuery,
  useGetMusicianByIdQuery,
  useAddMusicianMutation,
  useDeleteMusicianMutation,
} = musicianApi;

export default musicianApi;
