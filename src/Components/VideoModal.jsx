import PropTypes from "prop-types";
import { useState, useRef } from "react";

const DeactivateModal = ({ url }) => {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef(null);

  const openModal = () => {
    setIsOpen(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play(); // Start playing the video
      }
    }, 100); // Small delay to ensure video is loaded
  };

  return (
    <div>
      <p
        onClick={openModal}
        className="cursor-pointer underline text-[#176A66] font-bold"
      >
        Play Video
      </p>
      {isOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-gray-500/75 transition-opacity"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="relative p-6 rounded-2xl shadow-md z-20 w-full max-w-lg bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg transition-transform transform opacity-100 translate-y-0 sm:scale-100">
            <div className="flex justify-end">
              <img
                src="/close.svg"
                alt="close.svg"
                className="cursor-pointer w-[30px]"
                onClick={() => setIsOpen(false)}
              />
            </div>
            <div className="bg-white px-4 mb-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <video
                  ref={videoRef}
                  width="640"
                  height="640"
                  controls
                  autoPlay
                  className="overflow-x-auto rounded-2xl shadow-md"
                >
                  <source src={url} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
DeactivateModal.propTypes = {
  url: PropTypes.string.isRequired, // or PropTypes.string if not required
};
export default DeactivateModal;
