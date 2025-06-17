import VideoRecording from "@/Components/VideoRecording";
import {
  useLazyGetResumeDetailsQuery,
  useLazyGetUserProfileQuery,
} from "@/redux/api/api";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  UpdateSelectedProfile,
  UpdateVideo,
} from "../redux/Slices/SelectedProfile";
import SocialShare from "@/Components/ShareSocialMedia";

import Charts from "@/Components/ResumeStrengthChart";
import ResumeImprovementSuggestions from "@/Components/ResumeImprovementSuggestions";
import VideoAnalysisDisplay from "@/Components/VideoAnalysisDisplay";

import { toast } from "sonner";
import ResumeAnalyzer from "@/pages/ResumeAnalyzer";

const DashboardPage = () => {
  const navigate = useNavigate();
  let userID = JSON.parse(localStorage.getItem("AuthUser"));
  let SelectedProfile = JSON.parse(localStorage.getItem("SelectedProfile"));
  const [VideoURL, setVideoURL] = useState();
  const [getUserProfile, { data: userProfile, isLoading, isError }] =
    useLazyGetUserProfileQuery();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [EditVideo, setEditVideo] = useState(false);
  const [resumeBlob, setResumeBlob] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [ProfileURL, setProfileURL] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [selectedProfile, setSelectedProfile] = useState(
    SelectedProfile?.parentID ? SelectedProfile?.parentID : SelectedProfile?.id
  );

  const [trigger, { data: resumeDetails, error: errorGeetingResumeDetails }] =
    useLazyGetResumeDetailsQuery();

  const dispatch = useDispatch();
  const selectedID = useSelector((state) => state.profile.selectedProfile);

  const SelectID = selectedID?.parentID ? selectedID.parentID : selectedID?.id;

  const handlerGetResumeDetails = useCallback(() => {
    getUserProfile({ id: selectedID?.id, parentId: selectedID?.parentID });
    trigger({ userID: userID?.user?.id, userProfileID: SelectID });
  }, [
    getUserProfile,
    selectedID?.id,
    selectedID?.parentID,
    trigger,
    userID?.user?.id,
    SelectID,
  ]);

  useEffect(() => {
    handlerGetResumeDetails();
  }, [handlerGetResumeDetails]);

  useEffect(() => {
    if (userProfile?.data?.videoId) {
      fetch(
        import.meta.env.VITE_SERVER_URL + "/video/" + userProfile?.data?.videoId
      )
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.blob();
        })
        .then((blob) => {
          const videoUrl = URL.createObjectURL(blob);
          setVideoURL(videoUrl);
        })
        .catch((error) => {
          console.error("Error fetching video:", error);
          setVideoURL(null);
        });
    }
  }, [userProfile, selectedID, EditVideo]);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_SERVER_URL}/get-resume?userId=${
        selectedID?.parentID ? selectedID?.parentID : selectedID?.id
      }`,
      {
        method: "GET",
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch resume");
        return response.blob();
      })
      .then((blob) => {
        setResumeBlob(blob);
      })
      .catch((error) => {
        console.error("Error fetching resume:", error);
      });
  }, [selectedID, EditVideo]);

  useEffect(() => {
    let url = "";
    if (SelectedProfile?.parentID) {
      const parentId = btoa(SelectedProfile?.parentID);
      const Id = btoa(userID?.user?.id);
      url = import.meta.env.VITE_RFONTEND_URL + `subprofile/${Id}/${parentId}`;
    } else {
      const base64Encoded = btoa(SelectedProfile?.id);
      url = import.meta.env.VITE_RFONTEND_URL + `profile/${base64Encoded}`;
    }
    setProfileURL(url);
  }, []);

  function StopRecorder() {
    setEditVideo(false);
    setVideoURL(null);
  }
  const { fullName, title, workExperience, skills, SubProfileIDs } =
    userProfile?.data || {};
  const resumeUrl = resumeBlob ? URL.createObjectURL(resumeBlob) : null;
  const updatedSubProfileIDs = userID?.user?.id
    ? [userID?.user?.id, ...(SubProfileIDs || [])]
    : SubProfileIDs;

  const handleLogout = () => {
    // First show confirmation modal
    setShowLogoutModal(true);
  };

  // Function to confirm and execute logout
  const confirmLogout = () => {
    // Clear local storage
    localStorage.removeItem("AuthUser");
    localStorage.removeItem("SelectedProfile");

    // Show logout toast notification
    toast.success("Logged out successfully");

    // Close modal
    setShowLogoutModal(false);

    // Navigate to login page
    navigate("/");
  };

  function handlerEditVideo() {
    setEditVideo(!EditVideo);
    dispatch(UpdateVideo(userProfile?.data?.videoId));
  }

  if (!errorGeetingResumeDetails) {
    return (
      <div className="flex flex-col h-screen text-gray-900">
        {isLoading && <p>Loading profile...</p>}
        {isError && <p>Failed to load profile.</p>}

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <div className="flex items-center justify-center mb-4 text-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to log out of your account? Your session
                will be ended.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="flex flex-col h-screen text-gray-900">
            {/* Header */}
            {/* Responsive Header */}
            <header className="sticky top-0 z-10 bg-white shadow-md">
              <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  {/* Left side - Action buttons */}
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {/* Add Profile Button - Hidden on very small screens */}
                    {updatedSubProfileIDs?.length < 5 && (
                      <button
                        className="bg-[#176A66] text-white p-2 rounded-lg hover:bg-[#145b55] transition flex items-center"
                        onClick={() => {
                          if (updatedSubProfileIDs?.length < 5) {
                            navigate("/?New");
                          } else {
                            toast.warning("Your limit has been reached.");
                          }
                        }}
                        title="Add New Profile"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <line x1="19" y1="8" x2="19" y2="14" />
                          <line x1="16" y1="11" x2="22" y2="11" />
                        </svg>
                        <span className="hidden sm:inline-block ml-2 text-sm">
                          Add Profile
                        </span>
                      </button>
                    )}

                    {/* Download Resume Button */}
                    <button
                      className="bg-[#176A66] text-white p-2 rounded-lg hover:bg-[#145b55] transition flex items-center"
                      title="Download Resume"
                    >
                      <a
                        href={resumeUrl}
                        download={`resume_${userID?.user?.id}.pdf`}
                        className="flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span className="hidden sm:inline-block ml-2 text-sm">
                          Download
                        </span>
                      </a>
                    </button>
                  </div>

                  {/* Right side - User info and actions */}
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* User info - Hidden on mobile, shown on tablet+ */}
                    <div className="hidden md:block text-right">
                      <p className="font-semibold text-gray-900 text-sm lg:text-base truncate max-w-32 lg:max-w-none">
                        {fullName}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-600 truncate max-w-32 lg:max-w-none">
                        {title}
                      </p>
                    </div>

                    {/* Profile Image with dropdown for mobile */}
                    <div className="relative group">
                      <img
                        src={
                          userProfile?.data?.image
                            ? userProfile?.data?.image
                            : "/user.png"
                        }
                        alt="Profile"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#176A66] cursor-pointer"
                      />

                      {/* Mobile dropdown for user info */}
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20 md:hidden">
                        <div className="p-3 border-b">
                          <p className="font-semibold text-gray-900 text-sm truncate">
                            {fullName}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {title}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons container */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      {/* Share Button */}
                      <button
                        className="bg-[#176A66] text-white p-2 rounded-lg hover:bg-[#145b55] transition"
                        onClick={() => setShowShare(true)}
                        title="Share Profile"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                      </button>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                        title="Logout"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile-only user info bar */}
                <div className="block md:hidden mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {fullName}
                      </p>
                      <p className="text-xs text-gray-600 truncate">{title}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-xs text-gray-500">
                        {updatedSubProfileIDs?.length || 1}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Modal */}
              {showShare && (
                <SocialShare
                  url={ProfileURL}
                  onClose={() => setShowShare(false)}
                />
              )}
            </header>
            {/* Profile button */}
            {updatedSubProfileIDs?.length > 1 && (
              <div className="flex flex-wrap px-8 gap-2 mt-4">
                {updatedSubProfileIDs &&
                  updatedSubProfileIDs.map((profileID, index) => (
                    <button
                      key={profileID}
                      onClick={() => {
                        if (index === 0) {
                          let SelectedProfile = {
                            parentID: "",
                            id: userID?.user?.id,
                          };
                          dispatch(UpdateSelectedProfile(SelectedProfile));
                          localStorage.setItem(
                            "SelectedProfile",
                            JSON.stringify(SelectedProfile)
                          );
                        } else {
                          let SelectedProfile = {
                            parentID: profileID,
                            id: userID?.user?.id,
                          };
                          dispatch(UpdateSelectedProfile(SelectedProfile));
                          localStorage.setItem(
                            "SelectedProfile",
                            JSON.stringify(SelectedProfile)
                          );
                        }
                        setSelectedProfile(profileID);
                      }}
                      className={`flex w-[180px] h-[40px] items-center justify-center px-5 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm ${
                        selectedProfile === profileID
                          ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white ring-2 ring-teal-500 ring-opacity-50"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow"
                      }`}
                    >
                      <span
                        className={`mr-2 flex text-[11px] items-center justify-center w-5 h-5 rounded-full ${
                          selectedProfile === profileID
                            ? "bg-white text-teal-600"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </span>
                      Selected Profile
                    </button>
                  ))}
              </div>
            )}

            <main className="flex-1  md:p-8">
              <section className="">
                <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Professional Profile
                    </h2>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                      <div className="lg:col-span-2 space-y-4 md:space-y-6">
                        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg md:rounded-xl p-4 md:p-6 shadow-md border border-teal-100">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
                            <h3 className="text-lg md:text-xl font-semibold text-teal-700 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 md:h-6 md:w-6 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              Professional Introduction
                            </h3>
                            <button
                              onClick={handlerEditVideo}
                              className="flex items-center gap-1 text-teal-600 hover:text-teal-800 bg-white px-3 py-1 rounded-full shadow-sm hover:shadow transition-all text-sm md:text-base"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                              <span className="font-medium">Edit</span>
                            </button>
                          </div>

                          {!EditVideo ? (
                            <div className="relative pt-2">
                              {VideoURL ? (
                                <div className="rounded-lg md:rounded-xl overflow-hidden shadow-lg bg-black">
                                  <div className="relative aspect-w-16 aspect-h-9">
                                    <div
                                      className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 flex items-center justify-center group cursor-pointer"
                                      onClick={() => {
                                        const videoElement =
                                          document.getElementById(
                                            "profile-video"
                                          );
                                        if (videoElement) {
                                          videoElement.play();
                                          document.getElementById(
                                            "video-thumbnail-overlay"
                                          ).style.display = "none";
                                        }
                                      }}
                                      id="video-thumbnail-overlay"
                                    >
                                      <div className="w-14 h-14 md:w-20 md:h-20 bg-teal-600 bg-opacity-90 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-teal-500">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6 md:h-10 md:w-10 text-white ml-0.5 md:ml-1"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path d="M8 5v14l11-7z" />
                                        </svg>
                                      </div>
                                      <div className="absolute bottom-4 md:bottom-8 left-0 right-0 text-center px-2">
                                        <p className="text-white text-sm md:text-xl font-medium tracking-wide shadow-text">
                                          Watch My Professional Introduction
                                        </p>
                                      </div>
                                    </div>

                                    <video
                                      id="profile-video"
                                      controls
                                      className="w-full h-full object-cover"
                                      src={VideoURL}
                                      poster={VideoURL + "?poster=true"}
                                      onError={(e) =>
                                        console.error("Video error:", e)
                                      }
                                      onPlay={() => {
                                        const overlay = document.getElementById(
                                          "video-thumbnail-overlay"
                                        );
                                        if (overlay)
                                          overlay.style.display = "none";
                                      }}
                                      onPause={() => {
                                        const overlay = document.getElementById(
                                          "video-thumbnail-overlay"
                                        );
                                        if (overlay)
                                          overlay.style.display = "flex";
                                      }}
                                    />
                                  </div>

                                  <div className="p-3 md:p-5 bg-white">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                      <div>
                                        <h4 className="font-medium text-gray-800 text-base md:text-lg">
                                          {userProfile?.data?.fullName}&apos;s
                                          Introduction
                                        </h4>
                                        <p className="text-xs md:text-sm text-gray-500 mt-1">
                                          Learn about my expertise and
                                          professional experience
                                        </p>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          className="p-1.5 md:p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                          title="Share"
                                          onClick={() => setShowShare(true)}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 md:h-5 md:w-5 text-gray-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                            />
                                          </svg>
                                        </button>
                                        <button
                                          className="p-1.5 md:p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                          title="Download"
                                        >
                                          <a
                                            href={resumeUrl}
                                            download={`resume_${userID?.user?.id}.pdf`}
                                            className="flex items-center"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-4 w-4 md:h-5 md:w-5"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            >
                                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                              <polyline points="7 10 12 15 17 10" />
                                              <line
                                                x1="12"
                                                y1="15"
                                                x2="12"
                                                y2="3"
                                              />
                                            </svg>
                                          </a>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="aspect-w-16 aspect-h-9 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg md:rounded-xl flex items-center justify-center">
                                  <div className="text-center p-4 md:p-8">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-14 w-14 md:h-20 md:w-20 text-gray-300 mx-auto"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                      />
                                    </svg>
                                    <p className="mt-4 md:mt-6 text-gray-500 text-sm md:text-lg">
                                      Your professional introduction video will
                                      appear here
                                    </p>
                                    <button
                                      className="mt-4 md:mt-6 px-4 py-2 md:px-6 md:py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all text-sm md:text-base"
                                      onClick={() => {
                                        setEditVideo(true);
                                        dispatch(
                                          UpdateVideo(
                                            userProfile?.data?.videoId
                                          )
                                        );
                                      }}
                                    >
                                      <span className="flex items-center justify-center gap-1 md:gap-2">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-4 w-4 md:h-5 md:w-5"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                          />
                                        </svg>
                                        Add Introduction Video
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="mt-2 md:mt-4">
                              <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm">
                                <h4 className="text-base md:text-lg font-medium text-gray-800 mb-3 md:mb-4">
                                  Record Your Professional Introduction
                                </h4>
                                <VideoRecording
                                  setPreviewUrl={setPreviewUrl}
                                  previewUrl={previewUrl}
                                  Edit={true}
                                  submitButton={true}
                                  StopRecorder={StopRecorder}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="bg-white p-4 md:p-5 rounded-lg md:rounded-xl shadow-sm border border-gray-100">
                          <h4 className="font-medium text-gray-800 flex items-center mb-2 md:mb-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 md:h-5 md:w-5 mr-2 text-teal-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Recording Tips
                          </h4>
                          <ul className="text-xs md:text-sm text-gray-600 space-y-1 md:space-y-2">
                            <li className="flex items-start">
                              <span className="text-teal-500 mr-2">•</span>
                              Use good lighting and a clean background
                            </li>
                            <li className="flex items-start">
                              <span className="text-teal-500 mr-2">•</span>
                              Speak clearly and maintain eye contact with the
                              camera
                            </li>
                            <li className="flex items-start">
                              <span className="text-teal-500 mr-2">•</span>
                              Keep your introduction between 30-90 seconds
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-4 md:space-y-6">
                        <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6 transition-all hover:shadow-md">
                          <div className="flex items-center justify-between mb-3 md:mb-4">
                            <h3 className="text-base md:text-lg font-semibold text-teal-700 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 md:h-5 md:w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              Basic Information
                            </h3>
                          </div>

                          <div className="space-y-3 md:space-y-4">
                            <div className="flex justify-between border-b border-gray-200 pb-1.5 md:pb-2">
                              <span className="text-xs md:text-sm text-gray-500 font-medium">
                                Full Name
                              </span>
                              <span className="text-xs md:text-sm font-medium text-gray-800">
                                {userProfile?.data?.fullName}
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-1.5 md:pb-2">
                              <span className="text-xs md:text-sm text-gray-500 font-medium">
                                Email
                              </span>
                              <span className="text-xs md:text-sm font-medium text-gray-800">
                                {userProfile?.data?.email}
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-1.5 md:pb-2">
                              <span className="text-xs md:text-sm text-gray-500 font-medium">
                                Phone
                              </span>
                              <span className="text-xs md:text-sm font-medium text-gray-800">
                                {userProfile?.data?.phoneNumber}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs md:text-sm text-gray-500 font-medium">
                                Experience
                              </span>
                              <span className="text-xs md:text-sm font-medium text-teal-700">
                                {
                                  userProfile?.data?.workExperience
                                    ?.totalYearsOfExperience
                                }
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6 transition-all hover:shadow-md">
                          <div className="flex items-center justify-between mb-3 md:mb-4">
                            <h3 className="text-base md:text-lg font-semibold text-teal-700 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 md:h-5 md:w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                />
                              </svg>
                              Skills
                            </h3>
                          </div>

                          <div className="flex flex-wrap gap-1.5 md:gap-2">
                            {skills?.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-10 mt-8 bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Skills & Experience Timeline
                    </h2>
                  </div>
                  <div className="p-6">
                    <Charts
                      View={true}
                      strengthData={
                        resumeDetails?.data?.evaluation_score?.resume_evaluation
                          ?.skill_scores
                      }
                      techTimeLine={
                        resumeDetails?.data?.evaluation_score?.resume_evaluation
                          ?.tech_timeline
                      }
                    />
                  </div>
                </div>
                <div className="mt-8">
                  <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 mr-2 text-teal-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Professional Experience
                      </h3>
                    </div>

                    <div className="p-6">
                      <div className="space-y-6">
                        {workExperience?.entries?.map((exp, index) => (
                          <div
                            key={index}
                            className="p-6 bg-gray-50 rounded-lg hover:bg-white transition-all border border-gray-200 hover:border-teal-500 hover:shadow-md"
                          >
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                              <div>
                                <p className="text-xl font-semibold text-teal-700">
                                  {exp.jobRole}
                                </p>
                                <p className="text-gray-600 flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1 text-gray-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                  </svg>
                                  {exp.companyName}
                                </p>
                                <p className="text-gray-500 text-sm mt-1 flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  {exp.start_date} - {exp.end_date}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                                {exp.toolsUsed.map((tool, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium"
                                  >
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {exp.description && (
                              <div className="mt-4">
                                <p className="text-gray-700 bg-white p-4 rounded-lg border border-gray-100">
                                  {exp.description}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-teal-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Resume Improvement Suggestions
                      </h3>
                    </div>
                    <div className="p-6">
                      <ResumeImprovementSuggestions
                        resumeDetails={resumeDetails?.data?.evaluation_score}
                        EditButton={() => {
                          dispatch(UpdateVideo(userProfile?.data?.videoId));
                          navigate("/?edit");
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-teal-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Video Analysis
                      </h3>
                    </div>
                    <div className="p-6">
                      <VideoAnalysisDisplay
                        videoAnalysis={
                          resumeDetails?.data?.evaluation_score?.video_analysis
                        }
                        video_suggestions={
                          resumeDetails?.data?.evaluation_score
                            ?.personalized_suggestions?.video_suggestions
                        }
                        handlerEditVideo={handlerEditVideo}
                      />
                    </div>
                  </div>
                </div>
              </section>
              <div></div>
            </main>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <ResumeAnalyzer
        handlerGetResumeDetails={handlerGetResumeDetails}
        errorGeetingResumeDetails={errorGeetingResumeDetails}
      />
    );
  }
};

export default DashboardPage;
