import React, { useState, useRef, useEffect } from "react";
import { useUploadVideoChunksMutation } from "../redux/api/api";
import { Button } from "../ui-components/Button";
import VideoPlayer from "./Components/VideoPlayer";
import AiQuestions from "./Components/AiQuestions";
import CountdownOverlay from "./Components/CountdownOverlay";
import RecordButton from "./Components/RecordButton";

const Maximum_Video_Recorded_Time_Second = 39;

const VideoStreamer = () => {
  const [uploadVideoChunks] = useUploadVideoChunksMutation();
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isCountdownVisible, setIsCountdownVisible] = useState(false);

  const [isQuizActive, setIsQuizActive] = useState(false);

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
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play();
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Camera access denied or unavailable. Please check your browser settings."
      );
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
    setIsQuizActive(true);
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
    <div className="bg-[#E8EAFF] text-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <section className="flex flex-col lg:flex-row justify-center gap-12 text-center py-20">
          {/* Video Recorder */}
          <div className="w-full sm:w-3/4 lg:w-1/2 p-6 bg-white shadow-lg rounded-lg">
            <div className="relative">
              <h1 className="text-3xl font-bold mb-4 text-[#34919C]">
                Video Recorder
              </h1>
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
              <div className="">
                {/* <h1 className="text-3xl font-bold mb-4 text-[#34919C]">
                  Interviewer
                </h1> */}
                <AiQuestions
                  setIsQuizActive={setIsQuizActive}
                  isQuizActive={isQuizActive}
                />
              </div>

              <VideoPlayer
                videoURL={videoURL}
                videoRef={videoRef}
                stream={stream}
              />

              {stream && elapsedTime > 0 && (
                <RecordButton
                  isRecording={isRecording}
                  onClick={startRecording}
                  elapsedTime={elapsedTime}
                />
              )}

              {isCountdownVisible && <CountdownOverlay countdown={countdown} />}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VideoStreamer;
