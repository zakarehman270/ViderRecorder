import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_SERVER_URL;

const loadAuthState = () => {
  try {
    const serializedState = localStorage.getItem('user');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (err) {
    console.error('Failed to load auth state from localStorage:', err);
    return undefined;
  }
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}`,
    prepareHeaders: (headers) => {
      const token = loadAuthState()?.AccessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    uploadVideoChunks: builder.mutation({
      query: (VideoData) => ({
        url: "/stream",
        method: "POST",
        body: VideoData,
        headers: {
          'Content-Type': 'multipart/form-data', // Override the Content-Type for this endpoint
        },
      }),
      transformResponse: (response) => response, // Just return the plain text
    }),
    logIn: builder.mutation({
      query: (newUser) => ({
        url: "/login",
        method: "POST",
        body: newUser,
      }),
      transformResponse: (response) => response, // Just return the plain text
    }),
    checkExistingUser: builder.mutation({
      query: (newUser) => ({
        url: "/checkExistingUser",
        method: "POST",
        body: newUser,
      }),
      transformResponse: (response) => response, // Just return the plain text
    }),
    createProfile: builder.mutation({
      query: (newUser) => ({
        url: "/registerUser",
        method: "POST",
        body: newUser,
      }),
      transformResponse: (response) => response, // Just return the plain text
    }),
    addUser: builder.mutation({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser,
      }),
      transformResponse: (response) => response, // Just return the plain text
    }),
    addUserProfile: builder.mutation({
      query: (newUserProfile) => ({
        url: "/user-profile",
        method: "POST",
        body: newUserProfile,
      }),
      transformResponse: (response) => response, // Just return the plain text
    }),
    NewSubProfile: builder.mutation({
      query: (newUserSubProfile) => ({
        url: "/user-subprofile",
        method: "POST",
        body: newUserSubProfile,
      }),
      transformResponse: (response) => response, // Just return the plain text
    }),
    editUserProfile: builder.mutation({
      query: (data) => ({
        url: `/user-profile/${data?.id}`,
        method: "PUT",
        body: data?.data,
      }),
    }),
    editUserSubProfile: builder.mutation({
      query: (data) => ({
        url: `/user-subprofile/${data?.id}/${data?.parentID}`,
        method: "PUT",
        body: data?.data,
      }),
    }),
    uploadResume: builder.mutation({
      query: (Resume) => ({
        url: "/upload-resume?userId=" + Resume?.userID,
        method: "POST",
        body: Resume?.file,

      }),
      transformResponse: (response) => response, // Just return the plain text
    }),
    getUserProfileByAdmin: builder.query({
      query: (data) => data?.Search ? `/admin/user-profiles?search=${data?.Search}&page=${data?.pageNumber}&limit=${data?.pagelimit}` : `/admin/user-profiles?page=${data?.pageNumber}&limit=${data?.pagelimit}`,
    }),
    getUserProfile: builder.query({
      query: (data) => data?.parentId ? `/user-profile/${data?.id}?parentId=${data?.parentId}` : `/user-profile/${data?.id}`,
    }),
    GetResumeDetails: builder.query({
      query: (data) => `/resume-details/${data?.userID}/${data?.userProfileID}`,
    }),
    EditResumeDetails: builder.mutation({
      query: (Data) => ({
        url: `/resume-details/${Data?.userID}`,
        method: "PUT",
        body: Data?.data,
      }),
    }),
    getSubProfile: builder.query({
      query: (data) => `/user-subprofile/${data?.userID}/${data?.subprofile}`,
    }),
    getUsers: builder.query({
      query: () => "/users",
    }),
    getResume: builder.query({
      query: (userID) => `/get-resume?userId=${userID}`,
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
    }),
    ResumeData: builder.mutation({
      query: (ResumeData) => ({
        url: "/resume-details",
        method: "POST",
        body: ResumeData,
      }),
      transformResponse: (response) => response, // Just return the plain text
    }),
    getSingleUserDetails: builder.query({
      query: (id) => `/users/${id}`,
    }),
    getProfileVideo: builder.query({
      query: (id) => `/video/${id}`,
    }),
    // Other endpoints...
  }),
});
export const {
  useEditResumeDetailsMutation,
  useEditUserSubProfileMutation,
  useNewSubProfileMutation,
  useGetSingleUserDetailsQuery,
  useGetResumeQuery,
  useUploadVideoChunksMutation,
  useGetUsersQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useEditUserProfileMutation, // Export the new hook
  useLogInMutation,
  useLazyGetUserProfileQuery,
  useLazyGetResumeDetailsQuery,
  useLazyGetUserProfileByAdminQuery,
  useAddUserProfileMutation,
  useLazyGetProfileVideoQuery,
  useCheckExistingUserMutation,
  useCreateProfileMutation,
  useUploadResumeMutation,
  useLazyGetSubProfileQuery,
  useResumeDataMutation,
  // Export other hooks...
} = apiSlice;