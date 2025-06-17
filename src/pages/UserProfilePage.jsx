import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLazyGetUserProfileQuery } from "@/redux/api/api";

const ResumeUI = () => {
  const videoRef = useRef(null);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("experience");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  let ID = atob(location?.pathname.split("/")[2]);

  const [getUserProfile, { data: userProfile, isLoading, isError }] =
    useLazyGetUserProfileQuery();

  useEffect(() => {
    if (location?.pathname?.includes("/subprofile")) {
      let parentId = atob(location?.pathname.split("/")[3]);
      getUserProfile({ id: ID, parentId: parentId });
    } else {
      getUserProfile({ id: ID, parentId: "" });
    }
  }, [ID, location, getUserProfile]);

  useEffect(() => {
    if (userProfile?.data?.videoId && videoRef.current) {
      fetch(
        import.meta.env.VITE_SERVER_URL + "/video/" + userProfile?.data?.videoId
      )
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.blob();
        })
        .then((blob) => {
          const videoUrl = URL.createObjectURL(blob);
          videoRef.current.src = videoUrl;
        })
        .catch((error) => {
          console.error("Error fetching video:", error);
        });
    }
  }, [userProfile]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="text-red-600 text-center">
          <p className="text-2xl font-bold">Failed to load profile</p>
          <p className="mt-2">Please try again later</p>
        </div>
      </div>
    );

  const handleDownloadResume = () => {
    const resumeUrl =
      import.meta.env.VITE_SERVER_URL + "/get-resume?userId=" + ID;
    window.open(resumeUrl, "_blank");
  };

  const handleVideoPlay = () => {
    const videoElement = document.getElementById("profile-video");
    if (videoElement) {
      videoElement.play();
      setIsVideoPlaying(true);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "experience":
        return (
          <div className="space-y-6">
            {userProfile?.data?.workExperience?.entries.map((job, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">
                      {job.companyName}
                    </h4>
                    <p className="text-teal-600 font-medium">{job.jobRole}</p>
                  </div>
                  <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                    {job.start_date} - {job.end_date}
                  </span>
                </div>
                <div className="mt-4">
                  <h5 className="text-sm font-semibold text-gray-600 mb-2">
                    Technologies & Tools
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {job.toolsUsed?.map((tool, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case "education":
        return (
          <div className="space-y-6">
            {userProfile?.data?.education?.map((edu, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">
                      {edu.institutionName}
                    </h4>
                    <p className="text-teal-600 font-medium">
                      {edu.degree || "Degree not specified"}
                    </p>
                  </div>
                  <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                    {edu.start_date
                      ? `${edu.start_date} - ${edu.end_date}`
                      : edu.end_date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );

      case "projects":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userProfile?.data?.projects.map((project, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h4 className="text-lg font-bold text-gray-800">
                  {project.name}
                </h4>
                <p className="text-gray-600 mt-2 text-sm">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        );

      case "skills":
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userProfile?.data?.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 rounded-lg text-center"
                >
                  <span className="font-medium text-gray-800">{skill}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-3">
                {userProfile?.data?.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-gradient-to-r from-teal-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <div className="flex items-start gap-6">
                {/* Profile Image */}
                <div className="hidden md:block">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={
                        userProfile?.data?.image
                          ? userProfile?.data?.image
                          : "/user.png"
                      }
                      alt={userProfile?.data?.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Profile Details */}
                <div>
                  {/* Mobile Profile Image */}
                  <div className="flex justify-center mb-4 md:hidden">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={
                          userProfile?.data?.image &&
                          userProfile?.data?.image[0]?.base64
                            ? `data:image/jpeg;base64,${userProfile?.data?.image[0]?.base64}`
                            : "/user.png"
                        }
                        alt={userProfile?.data?.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold">
                    {userProfile?.data?.fullName}
                  </h1>
                  <h2 className="text-xl md:text-2xl font-light mt-1">
                    {userProfile?.data?.title}
                  </h2>

                  <div className="mt-4">
                    <span className="bg-teal-700 text-white px-4 py-1 rounded-full inline-block">
                      {
                        userProfile?.data?.workExperience
                          ?.totalYearsOfExperience
                      }{" "}
                      Years Experience
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-6">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{userProfile?.data?.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{userProfile?.data?.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>{userProfile?.data?.email}</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      className="bg-white hover:bg-gray-100 text-teal-800 px-5 py-2 rounded-lg font-medium transition-colors flex items-center text-sm"
                      onClick={handleDownloadResume}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Download Resume
                    </button>
                    <button className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Contact Me
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Feature Video */}
            <div className="order-1 md:order-2">
              <div className="relative rounded-xl overflow-hidden shadow-xl border-2 border-white/30">
                {/* Professional video wrapper with aspect ratio */}
                <div className="aspect-w-16 aspect-h-9">
                  {/* Video element */}
                  <video
                    id="profile-video"
                    ref={videoRef}
                    className="w-full  object-cover h-[350px]"
                    controls={isVideoPlaying}
                    poster={
                      userProfile?.data?.image &&
                      userProfile?.data?.image[0]?.base64
                        ? `data:image/jpeg;base64,${userProfile?.data?.image[0]?.base64}`
                        : "/video-poster.png"
                    }
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    onEnded={() => setIsVideoPlaying(false)}
                  >
                    Your browser does not support the video tag.
                  </video>

                  {/* Professional video play overlay */}
                  {!isVideoPlaying && (
                    <div
                      className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-opacity-30"
                      onClick={handleVideoPlay}
                    >
                      <div className="w-16 h-16 bg-white bg-opacity-25 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 transform transition-transform duration-300 hover:scale-110">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <p className="mt-4 text-white font-medium text-sm">
                        Watch Introduction
                      </p>
                    </div>
                  )}
                </div>

                {/* Video title overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-500 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <circle cx="10" cy="10" r="8" />
                    </svg>
                    <p className="text-white text-sm font-medium">
                      Professional Introduction
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto space-x-4 pb-2 mb-6">
          <button
            onClick={() => setActiveTab("experience")}
            className={`px-6 py-2 font-medium rounded-full whitespace-nowrap transition-colors ${
              activeTab === "experience"
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Experience
          </button>
          <button
            onClick={() => setActiveTab("education")}
            className={`px-6 py-2 font-medium rounded-full whitespace-nowrap transition-colors ${
              activeTab === "education"
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Education
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-6 py-2 font-medium rounded-full whitespace-nowrap transition-colors ${
              activeTab === "projects"
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`px-6 py-2 font-medium rounded-full whitespace-nowrap transition-colors ${
              activeTab === "skills"
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Skills
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">{renderTabContent()}</div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold">
            Looking for a skilled {userProfile?.data?.title}?
          </h3>
          <p className="mt-2 text-gray-300">
            Connect with {userProfile?.data?.fullName} today and explore new
            opportunities!
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center"
              onClick={handleDownloadResume}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download Resume
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 px-8 py-3 rounded-full font-medium transition-colors flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Contact Me
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResumeUI;
