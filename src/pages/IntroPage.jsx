import { useEffect, useState } from "react";
import FloatingDot from "../Components/FloatingDot";
import TypewriterEffect from "../Components/TyppeWriter";
import { motion, AnimatePresence } from "framer-motion";
import UserRegister from "./UserRegister";
import { useLocation, useNavigate } from "react-router-dom";

const IntroPage = () => {
  const [IsSpeak, setIsspeak] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentOuterStep, setCurrentOuterStep] = useState(0);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [permissionError, setPermissionError] = useState("");
  const [currentAudio, setCurrentAudio] = useState(null);
  const [LoadingSpeech, setLoadingSpeech] = useState(false);
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [requestingPermission, setRequestingPermission] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("AuthUser"));

  if (storedUser) {
    if (
      !(location?.search?.includes("edit") || location?.search?.includes("New"))
    ) {
      navigate("/dashboard");
    }
  }

  async function StartSpeaks(text) {
    setLoadingSpeech(true);
    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER_URL + "/text-to-speech",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: text, lang: "en" }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to convert text to speech.");
      }
      setIsspeak(true);
      setLoadingSpeech(false);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      setCurrentAudio(audio);
      audio.addEventListener("ended", () => {
        URL.revokeObjectURL(url);
        if (currentOuterStep > 0) {
          setIsspeak(false);
          setCurrentAudio(null);
        }
      });
    } catch (error) {
      console.error("Error converting text to speech:", error);
    }
  }

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setIsspeak(false);
    }
  };
  useEffect(() => {
    const checkExistingPermissions = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoAccess = devices.some(
          (device) => device.kind === "videoinput" && device.label
        );
        const hasAudioAccess = devices.some(
          (device) => device.kind === "audioinput" && device.label
        );

        if (hasVideoAccess && hasAudioAccess) {
          setHasPermissions(true);
        }
      } catch (err) {
        console.log("Permission check error:", err);
      } finally {
        setPermissionChecked(true);
      }
    };

    checkExistingPermissions();
  }, []);

  const handleRequestPermission = async () => {
    setRequestingPermission(true);
    setPermissionError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setHasPermissions(true);

      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.error("Media permission error:", err);
      // Error handling...
    } finally {
      setRequestingPermission(false);
    }
  };

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
  };

  useEffect(() => {
    if (
      location?.search?.includes("edit") ||
      location?.search?.includes("New")
    ) {
      setCurrentOuterStep(1);
    }
  }, []);

  if (!permissionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking device permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {!hasPermissions && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 md:p-8 rounded-lg text-center max-w-md w-full shadow-xl mx-auto">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-4">
              Camera & Microphone Access
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
              Talking App needs access to your camera and microphone to function
              properly. When you click &quot;Allow Access&quot; below, your
              browser will show a permission dialog.
            </p>

            {permissionError && (
              <div className="text-red-500 text-xs md:text-sm mb-4 md:mb-6 p-2 md:p-3 bg-red-50 rounded border border-red-200">
                <p className="font-semibold mb-1">Permission Error:</p>
                <p>{permissionError}</p>
              </div>
            )}

            <div className="mb-4 md:mb-6">
              <img
                src="/BrowserPermissionDialog.jpg"
                alt="Browser permission dialog example"
                className="mx-auto rounded-md shadow-md w-[100px] md:w-[120px]"
              />
              <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">
                👆 Please click &quot;Allow&quot; when prompted by your browser
              </p>
            </div>

            <button
              onClick={handleRequestPermission}
              disabled={requestingPermission}
              className={`w-full bg-teal-600 hover:bg-teal-700 text-white py-2 md:py-3 px-4 md:px-6 rounded-md transition-colors text-sm md:text-base ${
                requestingPermission ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {requestingPermission ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 border-t-2 border-b-2 border-white rounded-full"></span>
                  Requesting Access...
                </span>
              ) : (
                "Allow Access"
              )}
            </button>
          </div>
        </div>
      )}

      <AnimatePresence custom={1} mode="wait">
        <motion.div
          key={currentOuterStep}
          variants={variants}
          custom={1}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          {currentOuterStep === 0 && (
            <div className="min-h-screen flex flex-col items-center justify-center from-teal-100 to-teal-300 relative gap-2 md:gap-4 p-4">
              {!IsSpeak && (
                <>
                  <h1 className="text-lg sm:text-xl md:text-2xl text-center whitespace-normal sm:whitespace-nowrap">
                    Hello, and welcome to Talking App—your ultimate tool for
                    crafting the perfect profile!
                  </h1>
                  <h1 className="text-lg sm:text-xl md:text-2xl text-center whitespace-normal sm:whitespace-nowrap">
                    Click the agent to continue
                  </h1>
                </>
              )}
              {IsSpeak && (
                <div className="w-full md:w-1/2 px-2">
                  <TypewriterEffect
                    setIsCompleted={setIsCompleted}
                    setIsspeak={setIsspeak}
                  />
                </div>
              )}
            </div>
          )}

          {currentOuterStep === 1 && (
            <UserRegister
              setCurrentOuterStep={setCurrentOuterStep}
              StartSpeaks={StartSpeaks}
              stopAudio={stopAudio}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div
        onClick={() => {
          if (currentOuterStep === 0 && hasPermissions) {
            StartSpeaks(
              "Please provide the required details. Then proceed to the dashboard to begin."
            );
          }
        }}
      >
        <FloatingDot
          speaking={IsSpeak}
          positionDefault={"mmm"}
          isCompleted={isCompleted}
          setCurrentOuterStep={setCurrentOuterStep}
          loading={LoadingSpeech}
          setIsspeak={setIsspeak}
          currentOuterStep={currentOuterStep}
        />
      </div>
    </div>
  );
};

export default IntroPage;
