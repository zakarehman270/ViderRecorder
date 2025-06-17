import { useState, useEffect, useRef } from "react";
import { RefreshCw, FileText, Zap, CheckCircle } from "lucide-react";
import PropTypes from "prop-types";

export default function ResumeAnalyzer({
  handlerGetResumeDetails,
  errorGeetingResumeDetails,
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const intervalRef = useRef(null); // Store interval ID

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 3);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isRefreshing) {
      // Start polling
      intervalRef.current = setInterval(() => {
        handlerGetResumeDetails();
      }, 1000);
    } else {
      // Stop polling
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRefreshing]);

  const handleRefresh = async () => {
    handlerGetResumeDetails();

    // Preserve your existing logic
    if (!errorGeetingResumeDetails) {
      setIsRefreshing(true);
    } else {
      setIsRefreshing(true);
    }
  };

  const dots = ".".repeat(animationStep + 1);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ backgroundColor: "#0F766E" }}
        ></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"
          style={{ backgroundColor: "#CCFBF1" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse delay-500"
          style={{ backgroundColor: "#E6F2F3" }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-md w-full">
        {/* Glass morphism card */}
        <div
          className="backdrop-blur-md border rounded-3xl p-8 shadow-2xl"
          style={{
            backgroundColor: "rgba(230, 242, 243, 0.7)",
            borderColor: "rgba(15, 118, 110, 0.2)",
          }}
        >
          {/* Header icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300"
                style={{ backgroundColor: "#0F766E" }}
              >
                <FileText className="w-10 h-10 text-white" />
              </div>
              {/* Floating elements */}
              <div
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full animate-bounce delay-200"
                style={{ backgroundColor: "#CCFBF1" }}
              ></div>
              <div
                className="absolute -bottom-1 -left-2 w-4 h-4 rounded-full animate-bounce delay-700"
                style={{ backgroundColor: "#0F766E" }}
              ></div>
            </div>
          </div>

          {/* Status message */}
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-bold mb-4 tracking-tight"
              style={{ color: "#0F766E" }}
            >
              Resume Analysis
            </h1>

            {/* Animated processing text */}
            <div className="relative">
              <p className="text-lg mb-2" style={{ color: "#0F766E" }}>
                Waiting for resume analyzing processing{dots}
              </p>

              {/* Progress indicators */}
              <div className="flex justify-center space-x-2 mb-6">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      animationStep >= i ? "scale-125" : ""
                    }`}
                    style={{
                      backgroundColor:
                        animationStep >= i ? "#0F766E" : "#CCFBF1",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Status steps */}
            <div className="space-y-3 text-sm" style={{ color: "#0F766E" }}>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4" style={{ color: "#0F766E" }} />
                <span>Document uploaded</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div
                  className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: "#0F766E" }}
                ></div>
                <span>Analyzing content</span>
              </div>
               <div className="flex items-center justify-center space-x-2">
                <div
                  className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: "#0F766E" }}
                ></div>
                <span>Analyzing Video</span>
              </div>
              <div className="flex items-center justify-center space-x-2 opacity-50">
                <Zap className="w-4 h-4" style={{ color: "#0F766E" }} />
                <span>Generating insights</span>
              </div>
            </div>
          </div>

          {/* Refresh button */}
          <div className="flex justify-center">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="group relative px-8 py-4 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              style={{ backgroundColor: "#0F766E" }}
            >
              <div className="flex items-center space-x-2">
                <RefreshCw
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isRefreshing ? "animate-spin" : "group-hover:rotate-180"
                  }`}
                />
                <span>
                  {isRefreshing ? "Refreshing..." : "Refresh & Get Data"}
                </span>
              </div>

              {/* Button glow effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"
                style={{ backgroundColor: "#CCFBF1" }}
              ></div>
            </button>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-white rounded-full opacity-30 animate-ping`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 3) * 30}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: "2s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
ResumeAnalyzer.propTypes = {
  handlerGetResumeDetails: PropTypes.func.isRequired, // or .isOptional if not required
  errorGeetingResumeDetails: PropTypes.func.isRequired, // or .isOptional if not required
};
