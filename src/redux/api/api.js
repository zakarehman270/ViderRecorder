import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_SERVER_URL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}`,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  endpoints: (builder) => ({
    uploadVideoChunks: builder.mutation({
      query: (newUser) => ({
        url: "/stream",
        method: "POST",
        body: newUser,
      }),
      transformResponse: (response) => response, // Just return the plain text
    }),
    getQuestions: builder.query({
      query: () => "/questions",
    }),
  }),
});

export const { useUploadVideoChunksMutation , useGetQuestionsQuery  } = apiSlice;
