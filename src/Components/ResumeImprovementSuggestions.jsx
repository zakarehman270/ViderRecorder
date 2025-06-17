import {
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Award,
  Target,
} from "lucide-react";
import PropTypes from "prop-types";

const ResumeImprovementSuggestions = ({ resumeDetails, EditButton }) => {
  const resume_evaluation = resumeDetails?.resume_evaluation || {};
  const personalized_suggestions =
    resumeDetails?.personalized_suggestions?.resume_suggestions || [];
  const overall_score =
    resumeDetails?.final_score || resume_evaluation?.resume_score || 0;
  const score_breakdown = resume_evaluation.score_breakdown || {
    skills: 0,
    projects: 0,
    experience: 0,
    seniority_fit: 0,
  };
  const strengths = resume_evaluation.strengths || [];
  const skill_gaps = resume_evaluation.skill_gaps || [];

  const getScoreColor = (score) => {
    if (score > 75) return "text-green-600";
    if (score > 50) return "text-yellow-600";
    return "text-red-600";
  };

  const scorePercent = Math.round(overall_score);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-4 sm:p-6 rounded-t-lg -mt-4 sm:-mt-6 -mx-4 sm:-mx-6 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center leading-tight">
          Apply These Changes to Your Resume and Boost Your Interview Chances!
        </h2>
        <p className="text-white text-center mt-2 text-xs sm:text-sm">
          Personalized recommendations for{" "}
          {resume_evaluation.inferred_role || "Your Role"} •{" "}
          {resume_evaluation.seniority || "Level"}
        </p>
      </div>

      {/* Score Section */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Resume Score Circle */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg flex flex-col items-center justify-center w-full lg:w-auto lg:min-w-[280px]">
          <h3 className="text-lg font-semibold text-center mb-3">
            Resume Score
          </h3>
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-3">
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`text-2xl sm:text-3xl font-bold ${getScoreColor(
                  scorePercent
                )}`}
              >
                {scorePercent}%
              </span>
            </div>
            <svg className="w-24 h-24 sm:w-32 sm:h-32" viewBox="0 0 36 36">
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
                  scorePercent > 75
                    ? "#4CAF50"
                    : scorePercent > 50
                    ? "#FF9800"
                    : "#F44336"
                }
                strokeWidth="3"
                strokeDasharray={`${scorePercent}, 100`}
              />
            </svg>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 text-center">
            {scorePercent > 75
              ? "Excellent"
              : scorePercent > 50
              ? "Good, but can improve"
              : "Needs significant improvement"}
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg flex-1">
          <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
          <div className="space-y-3 sm:space-y-4">
            {[
              { label: "Skills", value: score_breakdown.skills, color: "blue" },
              {
                label: "Projects",
                value: score_breakdown.projects,
                color: "red",
              },
              {
                label: "Experience",
                value: score_breakdown.experience,
                color: "green",
              },
              {
                label: "Seniority Fit",
                value: score_breakdown.seniority_fit,
                color: "purple",
              },
            ].map(({ label, value, color }, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center gap-2"
              >
                <span className="text-gray-700 text-sm sm:text-base min-w-[100px] sm:min-w-[120px]">
                  {label}:
                </span>
                <div className="flex items-center flex-1">
                  <div className="w-full max-w-[200px] sm:max-w-none sm:flex-1 h-3 bg-gray-200 rounded-full mr-3">
                    <div
                      className={`h-3 bg-${color}-500 rounded-full transition-all duration-300`}
                      style={{ width: `${(value / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span
                    className={`text-${color}-800 font-semibold text-sm sm:text-base min-w-[35px]`}
                  >
                    {value}/5
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths Section */}
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Your Strengths</h3>
        <ul className="space-y-3">
          {strengths.map((strength, index) => (
            <li key={index} className="flex items-start">
              <Award
                className="text-green-500 mr-3 flex-shrink-0 mt-1"
                size={16}
              />
              <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {strength}
              </span>
            </li>
          ))}
          {strengths.length === 0 && (
            <li className="text-sm text-gray-500 italic">
              No strengths identified yet
            </li>
          )}
        </ul>
      </div>

      {/* Areas for Improvement */}
      <div className="mb-8">
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 flex items-center">
          <Target className="mr-2 text-red-500 flex-shrink-0" size={20} />
          <span>Areas for Improvement</span>
        </h3>
        <div className="bg-red-50 p-4 sm:p-6 rounded-lg border border-red-100">
          <ul className="space-y-3 sm:space-y-4">
            {skill_gaps.map((gap, index) => (
              <li key={index} className="flex items-start">
                <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-xs font-semibold">{index + 1}</span>
                </div>
                <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {gap}
                </span>
              </li>
            ))}
            {skill_gaps.length === 0 && (
              <li className="text-sm text-gray-500 italic">
                No specific improvement areas identified
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Personalized Suggestions */}
      <div className="mb-8">
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 flex items-center">
          <CheckCircle
            className="mr-2 text-green-500 flex-shrink-0"
            size={20}
          />
          <span>Personalized Resume Suggestions</span>
        </h3>
        <ul className="space-y-4">
          {personalized_suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="bg-white border-l-4 border-blue-500 p-4 sm:p-6 shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-xs sm:text-sm font-semibold">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {suggestion}
                </p>
              </div>
            </li>
          ))}
          {personalized_suggestions.length === 0 && (
            <li className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500 italic">
                No personalized suggestions available yet
              </p>
            </li>
          )}
        </ul>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <AlertCircle className="text-blue-500 flex-shrink-0 mt-1" size={24} />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              Ready to boost your chances?
            </h3>
            <p className="text-sm sm:text-base text-blue-800 mb-4 leading-relaxed">
              Implementing these suggestions could increase your resume&apos;s
              effectiveness by up to {Math.min(100 - scorePercent, 30)}% and
              help you stand out to potential employers.
            </p>
            <button
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center justify-center sm:justify-start transition-colors text-sm sm:text-base font-medium"
              onClick={EditButton}
            >
              Update My Resume Now
              <ChevronRight className="ml-2" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ResumeImprovementSuggestions.propTypes = {
  resumeDetails: PropTypes.shape({
    resume_evaluation: PropTypes.shape({
      resume_score: PropTypes.number,
      score_breakdown: PropTypes.shape({
        skills: PropTypes.number,
        projects: PropTypes.number,
        experience: PropTypes.number,
        seniority_fit: PropTypes.number,
      }),
      strengths: PropTypes.arrayOf(PropTypes.string),
      skill_gaps: PropTypes.arrayOf(PropTypes.string),
      inferred_role: PropTypes.string,
      seniority: PropTypes.string,
    }),
    personalized_suggestions: PropTypes.shape({
      resume_suggestions: PropTypes.arrayOf(PropTypes.string),
    }),
    final_score: PropTypes.number,
  }),
  EditButton: PropTypes.func.isRequired,
};

export default ResumeImprovementSuggestions;
