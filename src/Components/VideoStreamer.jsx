import PropTypes from "prop-types";
import  { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const VideoStreamer = ({
  shouldStartRecording,
  previewUrl,
  setPreviewUrl,
  Edit,
  submitButton,
  StopRecorder,
  VideId
}) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);
  const recordedChunks = useRef([]);
  const speechRecognitionRef = useRef(null);
  const [countdown, setCountdown] = useState(60);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const localtion = useLocation()


   const selectedID = useSelector((state) => state.profile.selectedProfile);
   const EditVideo = useSelector((state) => state.profile.EditVideoID);
   const videoID = selectedID?.parentID ? selectedID.parentID : selectedID?.id;

  const constraints = {
    video: {
      width: { ideal: 640 },
      height: { ideal: 480 },
      facingMode: "user",
    },
    audio: true,
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Camera access denied or unavailable. Please check your browser settings.");
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;

    

    recognition.onerror = (event) => {
      if (event.error !== "aborted") {
        console.error("Speech recognition error:", event.error);
      }
    };

    speechRecognitionRef.current = recognition;
    recognition.start();
  };

  const stopSpeechRecognition = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      speechRecognitionRef.current = null;
    }
  };
  const isFirstChunkRef = useRef(true); // Ref ka use
  const beginRecording = useCallback(() => {
    if (!stream) {
      console.error("No stream available.");
      return;
    }

    setIsRecording(true);
    setIsPaused(false);

    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorderRef.current = mediaRecorder;

    startSpeechRecognition();

       mediaRecorder.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
        const formData = new FormData();
          formData.append("chunk", event.data);

         
          if(localtion?.search?.includes("New")){
            formData.append("userID", VideId);
          }else{
            if(localtion?.search?.includes("edit") || Edit){
              formData.append("userID", EditVideo);
            }else{
              formData.append("userID", VideId);
            }
          }
       
        if(Edit || localtion?.search?.includes("edit")){
         
          formData.append("isFirstChunk",  isFirstChunkRef.current  ? "true" : "false");
          isFirstChunkRef.current = false; // Directly update karo
          try {
            await fetch(import.meta.env.VITE_SERVER_URL + "/replace-video", {
              method: "POST",
              body: formData,
            });
          } catch (error) {
            console.error("Error during the POST request:", error);
          }
        }else{
          try {
            await fetch(import.meta.env.VITE_SERVER_URL + "/stream", {
              method: "POST",
              body: formData,
            });
          } catch (error) {
            console.error("Error during the POST request:", error);
          }
        }
      }
    };

    mediaRecorder.start(1000);

    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [stream]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    stopSpeechRecognition();

    if (recordedChunks.current.length > 0) {
      const blob = new Blob(recordedChunks.current, { type: "video/webm" });
      const videoUrl = URL.createObjectURL(blob);
      setPreviewUrl(videoUrl);
    }

    recordedChunks.current = [];
    setCountdown(0);
  }, [isRecording, setPreviewUrl]);

  const retakeRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    stopSpeechRecognition();

    recordedChunks.current = [];
    setPreviewUrl(null);
    setCountdown(60);
    startCamera();
  };

  useEffect(() => {
    if (shouldStartRecording && stream) {
      beginRecording();
    }
  }, [shouldStartRecording, stream, beginRecording]);

  useEffect(() => {
    startCamera();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      stopRecording();
    };
  }, []);

  return (
    <div>
     
      {previewUrl ? (
        <div>
          <h3 className="text-lg text-white font-bold">Recorded Video Preview:</h3>
          <video src={previewUrl} controls className="w-full h-[28rem] rounded-[11px]"></video>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-[28rem] rounded-[11px] transform scale-x-[-1]"
          ></video>
          {isRecording && (
            <div className="mt-2 text-lg font-semibold text-red-500">
              {isPaused ? "Paused" : `Recording... ${countdown}s left`}
            </div>
          )}
        </>
      )}
      <div className="mt-4 flex space-x-4">
        {isRecording && (
          <button
            className="px-4 py-2 bg-[#176A66] text-[16px] text-white p-2 rounded-[10px] h-[50px]"
            onClick={stopRecording}
          >
            Finish
          </button>
        )}
        {previewUrl && (
          <>
           <button
            className="px-4 py-2 bg-red-500 text-[16px] text-white p-2 rounded-[10px] h-[50px]"
            onClick={retakeRecording}
          >
            Retake
          </button>
         {submitButton &&  <button
           className="px-4 py-2 bg-[#176A66] text-[16px] text-white p-2 rounded-[10px] h-[50px]"
           onClick={() => {
            StopRecorder()
            stopRecording()
           }}
         >
           Submit
         </button>}
          </>
         
        )}

      </div>
    </div>
  );
};
VideoStreamer.propTypes = {
  shouldStartRecording: PropTypes.bool.isRequired, // or PropTypes.bool if not required
  previewUrl: PropTypes.string,
  setPreviewUrl: PropTypes.func,
  Edit: PropTypes.bool,
  submitButton: PropTypes.node,
  StopRecorder: PropTypes.func,
  VideId: PropTypes.string
};
export default VideoStreamer;