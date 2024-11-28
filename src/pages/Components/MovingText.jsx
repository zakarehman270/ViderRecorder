import React, { useState, useEffect } from "react";

const MovingQuestions = () => {
  const [questions, setQuestions] = useState([
    "How would you architect a system using Python to handle real-time streaming data and ensure scalability and fault tolerance?",
    "To handle real-time streaming data with Python, how would you design the system for scalability and fault tolerance?",
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Function to cycle through questions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
    }, 5000); // Adjust time as needed
    return () => clearInterval(interval);
  }, [questions]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
      <div className="text-lg font-semibold text-gray-800 mb-4">
        AI Interviewer
      </div>
      <div className="overflow-hidden relative w-3/4 md:w-1/2 h-16 bg-white rounded-lg shadow-lg border border-gray-300 p-4">
        {/* Animated Question */}
        <div
          key={currentQuestionIndex}
          className="absolute inset-0 transition-transform duration-500 ease-in-out transform translate-y-0 animate-slide-up"
        >
          <p className="text-gray-700 text-center">{questions[currentQuestionIndex]}</p>
        </div>
      </div>
      <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Done Answering? Continue
      </button>
    </div>
  );
};
export default MovingQuestions;
