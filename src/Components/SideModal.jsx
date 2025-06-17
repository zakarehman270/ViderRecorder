import { Download, Play, Linkedin, Github, Globe, Code } from "lucide-react";
import Charts from "./ResumeStrengthChart";
import PropTypes from "prop-types";

const SideModal = ({ isOpen, onClose, userData }) => {
  const handleDownloadResume = () => {
    const resumeUrl =
      import.meta.env.VITE_SERVER_URL +
      "/get-resume?userId=" +
      userData?.userID;
    window.open(resumeUrl, "_blank");
  };

  const handlePlayVideo = () => {
    const videoUrl =
      import.meta.env.VITE_SERVER_URL + "/video/" + userData?.videoId;
    window.open(videoUrl, "_blank");
  };
  const getLinkIcon = (name) => {
    switch (name.toLowerCase()) {
      case "linkedin":
        return <Linkedin className="text-blue-600" />;
      case "github":
        return <Github className="text-gray-800" />;
      case "portfolio":
        return <Globe className="text-green-600" />;
      case "leetcode":
        return <Code className="text-orange-500" />;
      default:
        return null;
    }
  };
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div
      className={`fixed inset-0 bg-black flex justify-end transition-all duration-500 ${
        isOpen
          ? "bg-opacity-50 opacity-100 visible slide-in"
          : "bg-opacity-0 opacity-0 invisible slide-out"
      }`}
    >
      <div
        className={`bg-white w-3/5 max-w-4xl h-full p-6 shadow-lg overflow-y-auto transform transition-all duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Candidate Profile
          </h1>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            ✖
          </button>
        </div>

        <div className="border-b pb-6 mt-4">
          <div className="flex items-center space-x-4">
            <img
              src={userData?.image ? userData?.image : "/user.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                {userData?.fullName}
              </h2>
              <p className="text-xl text-blue-600 font-medium">
                {userData?.title}
              </p>
              <p className="text-gray-600 mt-1">
                {userData?.workExperience?.totalYearsOfExperience} of experience
              </p>

              <div className="flex mt-2 space-x-3">
                {userData?.links?.map(
                  (link, index) =>
                    link.link && (
                      <a
                        key={index}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                        title={link.name}
                      >
                        {getLinkIcon(link.name)}
                      </a>
                    )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-blue-600 font-medium">Seniority</p>
            <p className="text-2xl font-bold text-gray-800">
              {userData?.resumeDetails?.resume_evaluation?.seniority || "Mid"}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-green-600 font-medium">Overall Score</p>
            <p
              className={`text-2xl font-bold ${getScoreColor(
                userData?.resumeDetails?.evaluation_score?.final_score
              )}`}
            >
              {userData?.resumeDetails?.evaluation_score?.final_score}/100
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-purple-600 font-medium">Tech Stack</p>
            <p className="text-xl font-bold text-gray-800">
              {userData?.techStack?.slice(0, 2).join(", ")}{" "}
              {userData?.techStack?.length > 2 ? "+" : ""}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-gray-700 font-medium">
                {userData?.email}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Phone</span>
              <span className="text-gray-700 font-medium">
                {userData?.phoneNumber}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Address</span>
              <span className="text-gray-700 font-medium">
                {userData?.address || "Not provided"}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Resume Strength Analysis
          </h3>

          <Charts
            View={true}
            strengthData={
              userData?.resumeDetails?.evaluation_score?.resume_evaluation
                ?.skill_scores
            }
            techTimeLine={
              userData?.resumeDetails?.evaluation_score?.resume_evaluation
                ?.tech_timeline
            }
          />
        </div>
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={handleDownloadResume}
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            <Download />
            <span>Download Resume</span>
          </button>
          <button
            onClick={handlePlayVideo}
            className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            <Play />
            <span>Play Video</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-green-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-green-800">
              Strengths
            </h3>
            <ul className="space-y-2">
              {userData?.resumeDetails?.evaluation_score?.resume_evaluation?.strengths?.map(
                (item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-green-600">✓</span>
                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-amber-800">
              Weaknesses
            </h3>
            <ul className="space-y-2">
              {userData?.skill_gaps?.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-amber-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 bg-blue-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">Feedback</h3>
          <p className="text-gray-700">
            {userData?.resumeDetails?.evaluation_score?.feedback}
          </p>
        </div>
        {console.log("userData", userData)}
        <div className="mt-6 bg-purple-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-purple-800">
            Suggestions for Improvement
          </h3>
          <ul className="space-y-2">
            {userData?.resumeDetails?.evaluation_score?.personalized_suggestions?.resume_suggestions?.map(
              (item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-purple-600">→</span>
                  <span>{item}</span>
                </li>
              )
            )}
          </ul>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {userData?.skills?.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Work Experience
          </h3>
          <div className="space-y-4">
            {userData?.workExperience?.entries?.map((job, index) => (
              <div
                key={index}
                className="p-4 border-l-4 border-blue-500 bg-white rounded-lg shadow-sm"
              >
                <div className="flex justify-between">
                  <h4 className="font-bold text-gray-800">{job.companyName}</h4>
                  <p className="text-sm text-gray-500">
                    {job.start_date} - {job.end_date}
                  </p>
                </div>
                <p className="text-blue-600 font-medium">{job.jobRole}</p>
                {job.toolsUsed && job.toolsUsed.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {job.toolsUsed.map((tool, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userData?.projects?.map((project, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 transition-colors duration-200"
              >
                <h4 className="font-bold text-gray-800">{project.name}</h4>
                <p className="text-gray-700 mt-1">
                  {project.description || "No description provided"}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Education
          </h3>
          <div className="space-y-4">
            {userData?.education?.map((edu, index) => (
              <div
                key={index}
                className="p-4 border-l-4 border-green-500 bg-white rounded-lg shadow-sm"
              >
                <div className="flex justify-between">
                  <h4 className="font-bold text-gray-800">
                    {edu.institutionName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {edu.start_date} - {edu.end_date}
                  </p>
                </div>
                <p className="text-green-600 font-medium">{edu.degree}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

SideModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userData: PropTypes.object, // or define shape if you know the structure
};
export default SideModal;
