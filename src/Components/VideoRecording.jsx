import { useEffect, useState } from "react";
import Countdown from "./AnimatedCoundown";
import VideoStreamer from "./VideoStreamer";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

export default function VideoRecording({ VideId , setVideoID, previewUrl , setPreviewUrl , Edit = false , submitButton=false , StopRecorder}) {
    const [recording, setRecording] = useState(false);
    const [startCountdown, setStartCountdown] = useState(false);
    const [counter, setCounter] = useState(null);
    const [shouldStartRecording, setShouldStartRecording] = useState(false);
    const EditVideo = useSelector((state) => state.profile.EditVideoID);

    const localtion = useLocation()

    const handleRecording = () => {
      if (!recording) {
        setStartCountdown(true);
        setCounter(3); 
        const recordingId = crypto.randomUUID(); 
        if(localtion?.search?.includes("edit")){
          setVideoID(EditVideo)
        }else{
          setVideoID(recordingId)
        }
      } else {
        setStartCountdown(false);
        setRecording(false); 
      }
    };
  useEffect(() => {
    if (counter === 0) {
      setShouldStartRecording(true);
      setRecording(true);
    }
  }, [counter]);

    return(
        <>
        {counter === -2 ? (
        <VideoStreamer
          shouldStartRecording={shouldStartRecording}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
          Edit={Edit}
          submitButton={submitButton}
          StopRecorder={StopRecorder}
          VideId={VideId}
        />
      ) : (
        <div className="w-full h-[25rem] bg-[#176a66] rounded-[11px] flex items-center justify-center relative">
          <div className="flex justify-center items-center">
            <Countdown
              start={startCountdown}
              counter={counter}
              setCounter={setCounter}
            />
            {!startCountdown && (
              <div
                onClick={handleRecording}
                className="w-12 h-12 cursor-pointer border-[5px] border-[#ff0000] rounded-full flex justify-center items-center"
              >
                <div className="w-8 h-8 bg-[#ff0000] rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      )}
        </>
    )
}

VideoRecording.propTypes = {
  VideId: PropTypes.any, // Use a more specific type like PropTypes.string or PropTypes.number if possible
  setVideoID: PropTypes.func.isRequired,
  previewUrl: PropTypes.string,
  setPreviewUrl: PropTypes.func.isRequired,
  Edit: PropTypes.bool,
  submitButton: PropTypes.bool,
  StopRecorder: PropTypes.func.isRequired,
};