import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api', // TODO: change to local host for testing and then render
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = getState().auth?.token;
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Musicians', 'Venues', 'Prospects'],
  endpoints: () => ({}),
});