import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookApi = createApi({
  reducerPath: "bookApi",
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
  tagTypes: ["Book", "Books"],
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: () => "/books",
      transformResponse: (response) => response.books,
      providesTags: ["Books"],
    }),
    getBookById: builder.query({
      query: (id) => `/books/${id}`,
      transformResponse: (response) => response.book,
      providesTags: (result, error, id) => [{ type: "Book", id }],
    }),
    updateBook: builder.mutation({
      query: ({ bookId, available }) => ({
        url: `/books/${bookId}`,
        method: "PATCH",
        body: { available },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: (result, error, { bookId }) => [
        { type: "Book", id: bookId },
        "Books",
      ],
    }),
    removeReservation: builder.mutation({
      query: (reservationId) => ({
        url: `/reservations/${reservationId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: (result, error, reservationId) => [
        { type: "Book", id: reservationId },
        "Books",
      ],
      transformResponse: (response) => response,
      transformErrorResponse: (error) => error,
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useUpdateBookMutation,
  useRemoveReservationMutation,
} = bookApi;