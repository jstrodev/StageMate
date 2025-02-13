import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const musicianApi = createApi({
  reducerPath: "musicianApi",
 main
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getMusicians: builder.query({
      query: () => "api/musicians",
    }),
  }),
});

export const { useGetMusiciansQuery } = musicianApi;

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
 main
