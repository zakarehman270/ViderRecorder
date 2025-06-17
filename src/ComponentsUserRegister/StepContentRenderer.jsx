import  { useState } from "react";
import { Controller } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import SideModal from "@/Components/ResumeForm";
import VideoRecording from "@/Components/VideoRecording";
import ResumeUploader from "./ResumeUploader";
import PropTypes from "prop-types";

export default function StepContentRenderer({
  currentStep,
  steps,
  isUserRegistered,
  control,
  errors,
  resumeData,
  setFinalResumeData,
  setPreviewUrl,
  previewUrl,
  setVideoId,
  videoId
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(null);

  // Video recording step
  if (steps[currentStep]?.isVideo && !isUserRegistered) {
    return (
      <div className="mb-5">
        <VideoRecording
          setPreviewUrl={setPreviewUrl}
          previewUrl={previewUrl}
          setVideoID={setVideoId}
          VideId={videoId}
        />
      </div>
    );
  }

  // Resume form modal step
  if (steps[currentStep]?.isModal && !isUserRegistered) {
    return (
      <SideModal
        initialData={resumeData}
        setFinalResumeData={setFinalResumeData}
      />
    );
  }

  // Resume upload step
  if (steps[currentStep]?.type === "file" && !isUserRegistered) {
    return (
      <div className="mb-6">
        <label className="block text-gray-700 text-base font-semibold mb-2">
          {steps[currentStep].label}
        </label>
        <ResumeUploader
          control={control}
          errors={errors}
          setFileUploadError={setFileUploadError}
          fileUploadError={fileUploadError}
        />
      </div>
    );
  }

  // Password or text input steps
  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-base font-semibold mb-2">
        {steps[currentStep].label}
      </label>
      
      {steps[currentStep]?.name === "password" ? (
        <div className="relative w-full">
          <Controller
            name="password"
            control={control}
            rules={steps[currentStep]?.rules}
            render={({ field }) => (
              <input
                {...field}
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2"
                placeholder="Enter your password"
              />
            )}
          />
          <span
            className="absolute right-3 top-3 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </span>
        </div>
      ) : (
        <Controller
          name={steps[currentStep]?.name}
          control={control}
          rules={steps[currentStep]?.rules}
          render={({ field }) => (
            <input
              {...field}
              type={steps[currentStep]?.type}
              className="w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2"
              placeholder={`Enter your ${steps[currentStep]?.label}`}
            />
          )}
        />
      )}
    </div>
  );
}


StepContentRenderer.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired, // You can specify arrayOf if you know the shape
  isUserRegistered: PropTypes.bool.isRequired,
  control: PropTypes.object.isRequired, // often react-hook-form control object
  errors: PropTypes.object,             // react-hook-form errors object
  resumeData: PropTypes.object,         // adjust if resumeData has a specific shape
  setFinalResumeData: PropTypes.func.isRequired,
  setPreviewUrl: PropTypes.func.isRequired,
  previewUrl: PropTypes.string,
  setVideoId: PropTypes.func.isRequired,
  videoId: PropTypes.string
};