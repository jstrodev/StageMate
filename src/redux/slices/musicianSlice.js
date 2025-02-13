import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const musicianApi = createApi({
  reducerPath: "musicianApi",
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