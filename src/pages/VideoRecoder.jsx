import React, { useState, useRef, useEffect } from "react";
import { useUploadVideoChunksMutation } from "../redux/api/api";
import { Button } from "../ui-components/Button";

const Maximum_Video_Recorded_Time_Second = 5;
const CountdownOverlay = ({ countdown }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
    <div className="text-6xl font-bold text-white">{countdown}</div>
  </div>
);

const VideoPlayer = ({ videoURL, videoRef, stream }) => (
  <>
    {videoURL ? (
      <div className="mt-6">
        <video src={videoURL} controls className="w-full rounded-lg mt-4" />
        <a
          href={videoURL}
          download="recording.webm"
          className="block mt-2 text-[#34919C] font-semibold"
        >
          Download Video
        </a>
      </div>
    ) : (
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full rounded-lg"
      ></video>
    )}
  </>
);

const RecordButton = ({ isRecording, onClick, elapsedTime }) => (
  <div
    onClick={!isRecording ? onClick : undefined}
    className={`absolute cursor-pointer bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 flex items-center justify-center rounded-full shadow-lg ${
      isRecording
        ? "bg-[#F44336] text-white"
        : "bg-[#34919C] hover:bg-[#227A70] text-white transition duration-300"
    }`}
  >
    {isRecording ? (
      <span className="text-lg">{elapsedTime}s</span>
    ) : (
      <span className="text-xl font-bold">REC</span>
    )}
  </div>
);

const AiQuestions = () => {
  const questions = ["Tell us about yourself."]; // Add more questions if needed.
  const [currentText, setCurrentText] = useState(""); // Stores the typed text
  const [charIndex, setCharIndex] = useState(0); // Tracks the character being typed

  useEffect(() => {
    // Ensure typing starts fresh
    if (charIndex < questions[0].length) {
      const typingTimeout = setTimeout(() => {
        setCurrentText((prev) => prev + questions[0][charIndex]); // Add the next character
        setCharIndex((prev) => prev + 1); // Move to the next character
      }, 100); // Adjust typing speed here

      return () => clearTimeout(typingTimeout); // Clear timeout on component unmount or state update
    }
  }, [charIndex, questions]);

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg shadow-sm bg-gradient-to-br from-[#E6F2F3] to-[#FFFFFF] hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 bg-[#34919C] text-white rounded-full text-lg font-semibold">
            1
          </span>
          <p className="text-lg font-medium text-gray-700">
            {currentText}
            <span className="animate-blink">|</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const VideoRecorder = () => {
  const [uploadVideoChunks] = useUploadVideoChunksMutation();
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isCountdownVisible, setIsCountdownVisible] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(
    Maximum_Video_Recorded_Time_Second
  );
  const [videoURL, setVideoURL] = useState(null);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);
  const recordedChunks = useRef([]);
  const timerRef = useRef(null);


  const constraints = {
    video: {
      width: { ideal: 640 },
      height: { ideal: 480 },
      facingMode: "user", // "user" for front camera, "environment" for back camera
    },
    audio: true,
  };

  const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      } catch (error) {
        console.error("Error accessing camera:", error);
        alert("Camera access denied or unavailable. Please check your browser settings.");
      }
   
  };
  
  
  

  const handleCountdown = (callback) => {
    setIsCountdownVisible(true);
    let countdownValue = 3;
    const countdownInterval = setInterval(() => {
      setCountdown(countdownValue);
      if (countdownValue === 0) {
        clearInterval(countdownInterval);
        setIsCountdownVisible(false);
        callback();
      }
      countdownValue -= 1;
    }, 1000);
  };

  const startRecording = () => {
    if (stream) {
      handleCountdown(beginRecording);
    }
  };

  const beginRecording = () => {
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorderRef.current = mediaRecorder;
    recordedChunks.current = [];

    mediaRecorder.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);

        const formData = new FormData();
        formData.append("videoChunk", event.data);

        try {
          const response = await uploadVideoChunks(formData).unwrap();
          if (response?.statusCode === 200) {
            console.log("Video chunk uploaded successfully");
          }
        } catch (error) {
          console.error("Error uploading video chunk:", error);
        }
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
      clearInterval(timerRef.current);
      setIsRecording(false);
    };

    mediaRecorder.start(1000);
    setIsRecording(true);

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          mediaRecorder.stop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="relative">
      <h1 className="text-3xl font-bold mb-4 text-[#34919C]">Video Recorder</h1>
      <p className="text-lg mb-6 text-gray-600">
        Start your interview and record a video.
      </p>

      <div className="flex justify-center mb-6">
        {!isRecording && (
          <Button
            onClick={startCamera}
            className="bg-[#34919C] text-white px-6 py-3 rounded-lg hover:bg-[#227A70] transition duration-300"
          >
            Start Your Interview
          </Button>
        )}
      </div>

      <VideoPlayer videoURL={videoURL} videoRef={videoRef} stream={stream} />

      {stream && elapsedTime > 0 && (
        <RecordButton
          isRecording={isRecording}
          onClick={startRecording}
          elapsedTime={elapsedTime}
        />
      )}

      {isCountdownVisible && <CountdownOverlay countdown={countdown} />}
    </div>
  );
};

const VideoStreamer = () => (
  <div className="bg-gray-100 text-gray-900 min-h-screen">
    <div className="container mx-auto px-4">
      <section className="flex flex-col lg:flex-row gap-12 text-center py-20">
        {/* Video Recorder */}
        <div className="w-full sm:w-3/4 lg:w-1/2 p-6 bg-white shadow-lg rounded-lg">
          <VideoRecorder />
        </div>

        {/* Interviewer Section */}
        <div className="w-full sm:w-3/4 lg:w-1/2 p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold mb-4 text-[#34919C]">
            Interviewer
          </h1>
          <p className="text-lg mb-6 text-gray-600">
            Please answer the following questions thoughtfully. Thank you!
          </p>
          <AiQuestions />
        </div>
      </section>
    </div>
  </div>
);

export default VideoStreamer;
