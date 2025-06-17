import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const PythonBaseUrl = import.meta.env.VITE_PYTHON_URL;

export const apiSlicePython = createApi({
  reducerPath: 'apiPython',
  baseQuery: fetchBaseQuery({
    baseUrl: PythonBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      const sessionId = getState().session.sessionId; // Get resume from Redux state
      if (sessionId) {
        headers.set('Cookie', `resume=${sessionId}`);
      }
      return headers;
    },
    credentials: 'include',
  }),

  endpoints: (builder) => ({
    postPythonItems: builder.mutation({
      query: (data) => ({
        url: '/extract_resume/', // Your POST endpoint
        method: 'POST', // Specify the HTTP method
        body: data, // Pass the body of the POST request
      }),
      transformResponse: (response) => {
        const cookies = document.cookie;
        const sessionIdMatch = cookies.match(/resume=([^;]+)/);
        const sessionId = sessionIdMatch ? sessionIdMatch[1] : null;
        return { data: response, sessionId };
      },
    }),
    VideoAnalyze: builder.mutation({
      query: (VideoUrl) => ({
        url: `/analyze_video/?video_url=${VideoUrl}`, // Your POST endpoint
        method: 'POST', // Specify the HTTP method
      }),
    }),
    evaluateResume: builder.mutation({
      query: (data) => ({
        url: '/evaluate_resume/', // Your POST endpoint
        body: { userID: data?.userId, userProfileID: data?.userProfileID,is_edit:data?.is_edit },
        method: 'POST', // Specify the HTTP method
      }),
    }),


  }),
});

export const { usePostPythonItemsMutation, useVideoAnalyzeMutation, useEvaluateResumeMutation } = apiSlicePython;
