import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const musicianApi = createApi({
  reducerPath: "musicianApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api", // Change to local host for testing and then render
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token"); // If you're using token auth
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Musician", "Musicians"],
  endpoints: (builder) => ({
    getMusicians: builder.query({
      query: () => "/musicians",
      transformResponse: (response) => response.musicians,
      providesTags: ["Musicians"],
    }),
    getBookById: builder.query({
      query: (id) => `/musicians/${id}`,
      transformResponse: (response) => response.musician,
      providesTags: (result, error, id) => [{ type: "Musician", id }],
    }),
    updateBook: builder.mutation({
      query: ({ musicianId, active }) => ({
        url: `/musicians/${musicianId}`,
        method: "PATCH",
        body: { active },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: (result, error, { musicianId }) => [
        { type: "Musician", id: musicianId },
        "Musicians",
      ],
    }),
    removeReservation: builder.mutation({
      query: (musicianId) => ({
        url: `/musicians/${musicianId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: (result, error, musicianId) => [
        { type: "Musician", id: musicianId },
        "Musicians",
      ],
      transformResponse: (response) => response,
      transformErrorResponse: (error) => error,
    }),
  }),
});

export const {
  useGetMusiciansQuery,
  useGetMusicianByIdQuery,
  useUpdateMusicianMutation,
  useRemoveMusicianMutation,
} = musicianApi;