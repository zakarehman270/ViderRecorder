import React, { useState, useEffect } from "react";
import { useGetQuestionsQuery } from "../../redux/api/api";

const AiQuestions = ({ isQuizActive, setIsQuizActive }) => {
  const { data: getQuestions, isLoading, isError } = useGetQuestionsQuery();
  const TIMER_DURATION = 5; // Timer duration in seconds

  const [questionNumber, setQuestionNumber] = useState(0);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [quizEnded, setQuizEnded] = useState(false);
  
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isQuizActive && !quizEnded && getQuestions?.length) {
      speak(getQuestions[questionNumber]?.question);

      const timerId = setInterval(() => {
        setTimer((prev) => {
          if (prev === 0) {
            clearInterval(timerId);
            handleNextQuestion();
            return TIMER_DURATION;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [isQuizActive, quizEnded, questionNumber, getQuestions]);

  const handleNextQuestion = () => {
    if (questionNumber >= getQuestions?.length - 1) {
      setQuizEnded(true);
    } else {
      setQuestionNumber((prev) => prev + 1);
      setTimer(TIMER_DURATION);
    }
  };

  if (isLoading) {
    return <p>Loading questions...</p>;
  }

  if (isError || !getQuestions?.length) {
    return <p>Failed to load questions. Please try again later.</p>;
  }

  const currentQuestion = getQuestions[questionNumber];

  return (
    <div className="">
      {isQuizActive && (
        <div className="">
          <p className="text-lg mb-6 text-gray-600">
            Please answer the following questions thoughtfully. Thank you!
          </p>
          {quizEnded ? (
            <div className="quiz-result flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-4">Interview Ended</h2>
            </div>
          ) : (
            <>
              <div className="timer text-right text-lg font-bold mb-4">
                Time Left: {timer}s
              </div>
              <h2 className="text-xl font-semibold mb-4">
                Question {questionNumber + 1}/{getQuestions?.length}:{" "}
                {currentQuestion?.question}
              </h2>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AiQuestions;
