import {
  Video,
  BarChart2,
  MessageCircle,
  AlertTriangle,
  Award,
  Briefcase,
} from "lucide-react";
import PropTypes from "prop-types";

const VideoAnalysisDisplay = ({
  videoAnalysis,
  video_suggestions,
  handlerEditVideo,
}) => {
  const { confidence, clarity, communication } = videoAnalysis || {};
  const scores = [
    confidence?.score || 0,
    clarity?.score || 0,
    communication?.score || 0,
  ];
  const overallScore =
    scores.reduce((sum, score) => sum + score, 0) / scores.length;

  const getScoreColor = (score) => {
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-blue-600";
    if (score >= 2) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 4) return "bg-green-100";
    if (score >= 3) return "bg-blue-100";
    if (score >= 2) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getScoreIcon = (score) => {
    if (score >= 4) return <Award className="text-green-500" size={18} />;
    if (score >= 3) return <Award className="text-blue-500" size={18} />;
    if (score >= 2)
      return <AlertTriangle className="text-yellow-500" size={18} />;
    return <AlertTriangle className="text-red-500" size={18} />;
  };

  // Convert score to visual bars (out of 5)
  const renderScoreBars = (score) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-2 w-3 sm:w-4 rounded-sm ${
              i <= score
                ? getScoreColor(score).replace("text-", "bg-")
                : "bg-gray-200"
            }`}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 lg:p-6 w-full max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-500 p-4 sm:p-6 rounded-t-lg -mt-3 sm:-mt-4 lg:-mt-6 -mx-3 sm:-mx-4 lg:-mx-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white text-center">
          Video Presentation Analysis
        </h2>
        <p className="text-white text-center mt-1 sm:mt-2 text-xs sm:text-sm">
          Professional feedback to improve your interview presentation skills
        </p>
      </div>

      {/* Overall Score and Breakdown Section */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Overall Score - Full width on mobile, first column on desktop */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg flex flex-col items-center justify-center order-1 lg:col-span-1">
          <h3 className="text-base sm:text-lg font-semibold text-center mb-2 sm:mb-3">
            Overall Score
          </h3>
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mb-2 sm:mb-3">
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`text-xl sm:text-2xl lg:text-3xl font-bold ${getScoreColor(
                  overallScore
                )}`}
              >
                {overallScore.toFixed(1)}/5
              </span>
            </div>
            <svg
              className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32"
              viewBox="0 0 36 36"
            >
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E6E6E6"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={
                  overallScore >= 4
                    ? "#4CAF50"
                    : overallScore >= 3
                    ? "#2196F3"
                    : overallScore >= 2
                    ? "#FF9800"
                    : "#F44336"
                }
                strokeWidth="3"
                strokeDasharray={`${(overallScore / 5) * 100}, 100`}
              />
            </svg>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 text-center px-2">
            {overallScore >= 4
              ? "Excellent presentation skills"
              : overallScore >= 3
              ? "Good presentation skills"
              : overallScore >= 2
              ? "Average presentation skills"
              : "Needs significant improvement"}
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg order-2 lg:col-span-2">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
            Score Breakdown
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 min-w-0">
                <Video
                  className="text-purple-500 mr-2 flex-shrink-0"
                  size={16}
                />
                <span className="text-gray-700 text-sm sm:text-base truncate">
                  Confidence:
                </span>
              </div>
              <div className="flex items-center space-x-2 ml-2">
                {renderScoreBars(confidence?.score || 0)}
                <span
                  className={`${getScoreColor(
                    confidence?.score || 0
                  )} font-semibold text-sm sm:text-base whitespace-nowrap`}
                >
                  {confidence?.score || 0}/5
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 min-w-0">
                <BarChart2
                  className="text-blue-500 mr-2 flex-shrink-0"
                  size={16}
                />
                <span className="text-gray-700 text-sm sm:text-base truncate">
                  Clarity:
                </span>
              </div>
              <div className="flex items-center space-x-2 ml-2">
                {renderScoreBars(clarity?.score || 0)}
                <span
                  className={`${getScoreColor(
                    clarity?.score || 0
                  )} font-semibold text-sm sm:text-base whitespace-nowrap`}
                >
                  {clarity?.score || 0}/5
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 min-w-0">
                <MessageCircle
                  className="text-indigo-500 mr-2 flex-shrink-0"
                  size={16}
                />
                <span className="text-gray-700 text-sm sm:text-base truncate">
                  Communication:
                </span>
              </div>
              <div className="flex items-center space-x-2 ml-2">
                {renderScoreBars(communication?.score || 0)}
                <span
                  className={`${getScoreColor(
                    communication?.score || 0
                  )} font-semibold text-sm sm:text-base whitespace-nowrap`}
                >
                  {communication?.score || 0}/5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Feedback Section */}
      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 flex items-center">
          <Video className="mr-2 text-purple-500 flex-shrink-0" size={20} />
          <span className="truncate">Detailed Feedback</span>
        </h3>

        <div
          className={`${getScoreBgColor(
            confidence?.score || 0
          )} p-3 sm:p-4 rounded-lg border border-${getScoreColor(
            confidence?.score || 0
          ).replace("text-", "")}-200`}
        >
          <div className="flex items-start">
            <div
              className={`${getScoreColor(confidence?.score || 0).replace(
                "text-",
                "bg-"
              )} text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0`}
            >
              <span className="text-xs sm:text-sm">
                {getScoreIcon(confidence?.score || 0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4
                className={`${getScoreColor(
                  confidence?.score || 0
                )} font-semibold text-sm sm:text-base`}
              >
                Confidence
              </h4>
              <p className="text-gray-700 mt-1 text-xs sm:text-sm leading-relaxed">
                {confidence?.explanation || "No analysis available"}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${getScoreBgColor(
            clarity?.score || 0
          )} p-3 sm:p-4 rounded-lg border border-${getScoreColor(
            clarity?.score || 0
          ).replace("text-", "")}-200`}
        >
          <div className="flex items-start">
            <div
              className={`${getScoreColor(clarity?.score || 0).replace(
                "text-",
                "bg-"
              )} text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0`}
            >
              <span className="text-xs sm:text-sm">
                {getScoreIcon(clarity?.score || 0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4
                className={`${getScoreColor(
                  clarity?.score || 0
                )} font-semibold text-sm sm:text-base`}
              >
                Clarity
              </h4>
              <p className="text-gray-700 mt-1 text-xs sm:text-sm leading-relaxed">
                {clarity?.explanation || "No analysis available"}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${getScoreBgColor(
            communication?.score || 0
          )} p-3 sm:p-4 rounded-lg border border-${getScoreColor(
            communication?.score || 0
          ).replace("text-", "")}-200`}
        >
          <div className="flex items-start">
            <div
              className={`${getScoreColor(communication?.score || 0).replace(
                "text-",
                "bg-"
              )} text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0`}
            >
              <span className="text-xs sm:text-sm">
                {getScoreIcon(communication?.score || 0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4
                className={`${getScoreColor(
                  communication?.score || 0
                )} font-semibold text-sm sm:text-base`}
              >
                Communication
              </h4>
              <p className="text-gray-700 mt-1 text-xs sm:text-sm leading-relaxed">
                {communication?.explanation || "No analysis available"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Improvement Tips Section */}
      <div className="mt-6 sm:mt-8 bg-indigo-50 p-4 sm:p-6 rounded-lg border border-indigo-100">
        <div className="flex items-center mb-4">
          <Video
            className="text-indigo-600 mr-2 sm:mr-3 flex-shrink-0"
            size={20}
          />
          <h3 className="text-base sm:text-lg font-semibold text-indigo-700 truncate">
            Video Presentation Improvement Tips
          </h3>
        </div>
        <ul className="mt-4 space-y-3 sm:space-y-4">
          <li className="flex items-start">
            <div className="bg-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
              <span className="text-xs">1</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {overallScore < 3
                ? "Practice your presentation in front of a mirror or record yourself to increase confidence."
                : "Continue building on your confidence by practicing complex technical explanations."}
            </span>
          </li>
          <li className="flex items-start">
            <div className="bg-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
              <span className="text-xs">2</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {clarity?.score < 3
                ? "Structure your presentation with a clear introduction, key points, and conclusion."
                : "Enhance your clarity by using technical examples that demonstrate your expertise."}
            </span>
          </li>
          <li className="flex items-start">
            <div className="bg-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
              <span className="text-xs">3</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {communication?.score < 3
                ? "Improve your communication by maintaining eye contact and using concise, clear language."
                : "Refine your communication by incorporating storytelling techniques to convey complex ideas."}
            </span>
          </li>
        </ul>

        {/* Video Suggestions */}
        {video_suggestions && video_suggestions.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <h3 className="text-base sm:text-lg font-bold mb-4 text-gray-800 flex items-center">
              <Briefcase
                className="mr-2 text-purple-500 flex-shrink-0"
                size={20}
              />
              <span className="truncate">Video Presentation Tips</span>
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {video_suggestions?.map((suggestion, index) => (
                <li
                  key={index}
                  className="bg-white border-l-4 border-purple-500 p-3 sm:p-4 shadow rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="bg-purple-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center mr-2 sm:mr-3 mt-1 flex-shrink-0">
                      <span className="text-xs">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed flex-1">
                      {suggestion}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          className="mt-4 sm:mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center w-full sm:w-auto transition-colors text-sm sm:text-base"
          onClick={() => {
            window.scrollTo(0, 0);
            handlerEditVideo();
          }}
        >
          Schedule Practice Session
        </button>
      </div>
    </div>
  );
};

VideoAnalysisDisplay.propTypes = {
  videoAnalysis: PropTypes.object.isRequired,
  video_suggestions: PropTypes.array.isRequired,
  handlerEditVideo: PropTypes.func.isRequired,
};

export default VideoAnalysisDisplay;
