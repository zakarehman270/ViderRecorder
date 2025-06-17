
import { Link } from "react-router-dom";
import LoadingButton from "../Components/LoadingButton";
import PropTypes from "prop-types";

export default function FormStepController({
  isUserRegistered,
  currentStep,
  steps,
  isStepValid,
  handleNext,
  handleLogin,
  createProfile,
  isLoading,
  loadingSubmitResume,
  previewUrl
}) {
  // Already registered case
  if (isUserRegistered && currentStep === 1) {
    return (
      <div className="flex justify-between items-center relative">
        <button
          type="button"
          className="ml-auto w-[30%] px-4 py-3 text-base bg-[#176A66] text-white rounded-md hover:brightness-90"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    );
  }

  // Go to login case
  if (isUserRegistered && currentStep === 2) {
    return (
      <div className="flex justify-between items-center relative">
        <Link to="/login" className="w-full">
          <button
            type="button"
            className="ml-auto w-[30%] px-4 py-3 text-base bg-[#176A66] text-white rounded-md hover:brightness-90"
          >
            Go to Login
          </button>
        </Link>
      </div>
    );
  }

  // Mid-flow navigation
  if (currentStep < steps.length - 1) {
    return (
      <div className="flex justify-between items-center relative">
        <button
          type="button"
          onClick={handleNext}
          disabled={!isStepValid()}
          className={`ml-auto w-[100%] px-4 py-3 justify-center text-base bg-[#176A66] text-white rounded-md ${
            !isStepValid() ? "opacity-50 cursor-not-allowed" : "hover:brightness-90"
          }`}
        >
          {!isLoading ? "Next" : <LoadingButton />}
        </button>
      </div>
    );
  }

  // Final submission
  return (
    <div className="flex justify-between items-center relative">
      {previewUrl && (
        <button
          onClick={createProfile}
          type="button"
          className="ml-auto w-[30%] px-4 py-3 text-base bg-[#176A66] text-white rounded-md hover:brightness-90"
        >
          {loadingSubmitResume ? <LoadingButton /> : "Submit"}
        </button>
      )}
    </div>
  );
}

FormStepController.propTypes = {
  isUserRegistered: PropTypes.bool.isRequired,
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.array.isRequired, // or PropTypes.arrayOf(PropTypes.string/object/etc)
  isStepValid: PropTypes.bool.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
  createProfile: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  loadingSubmitResume: PropTypes.bool,
  previewUrl: PropTypes.string
};