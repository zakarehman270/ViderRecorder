import PropTypes from "prop-types";

export default function SidebarSteps({ stepMessages, currentStep, isUserRegistered }) {
  return (
    <div className="w-1/2 relative rounded-md bg-gradient-to-b from-[#176A66] to-[#176A66] text-white p-8">
      {stepMessages
        .filter((step, index) => {
          // Skip the "Already Registered" step if the user is not registered
          if (step.label === "Already Registered" && !isUserRegistered) {
            return false;
          }
          // Skip steps beyond index 2 if the user is already registered
          if (isUserRegistered && index > 2) {
            return false;
          }
          return true; // Include all other steps
        })
        .map((step, index) => (
          <div
            key={index}
            className="gap-3 px-7 mt-10 rounded-lg transition-all"
          >
            {currentStep > index ? (
              <CompletedStep step={step} />
            ) : currentStep === index ? (
              <CurrentStep step={step} />
            ) : (
              <FutureStep step={step} />
            )}
          </div>
        ))}
    </div>
  );
}



function CompletedStep({ step }) {
  return (
    <>
      <img
        src="/tickCircleWhite.svg"
        alt="checkmark"
        className="w-[40px] mb-2 ml-[-7px]"
      />
      <div>
        <h2 className="text-xl font-semibold mb-1 text-white">
          {step.label}
        </h2>
        <p className="text-base mb-0 w-[90%] text-white">
          {step.message}
        </p>
      </div>
    </>
  );
}

function CurrentStep({ step }) {
  return (
    <>
      <img
        src="/crossCircle.svg"
        alt="checkmark"
        className="w-[35px] mb-2 ml-[-7px]"
      />
      <div>
        <h2 className="text-xl font-semibold mb-1 text-gray-400">
          {step.label}
        </h2>
        <p className="text-base mb-0 w-[90%] text-gray-400">
          {step.message}
        </p>
      </div>
    </>
  );
}

function FutureStep({ step }) {
  return (
    <>
      <img
        src="/crossCircle.svg"
        alt="checkmark"
        className="w-[35px] mb-2 ml-[-7px]"
      />
      <div>
        <h2 className="text-xl font-semibold mb-1 text-gray-400">
          {step.label}
        </h2>
        <p className="text-base mb-0 w-[90%] text-gray-400">
          {step.message}
        </p>
      </div>
    </>
  );
}

CompletedStep.propTypes = {
  step: PropTypes.shape({
    label: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
  }).isRequired
};

CurrentStep.propTypes = {
  step: PropTypes.shape({
    label: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
  }).isRequired
};

FutureStep.propTypes = {
  step: PropTypes.shape({
    label: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
  }).isRequired
};

SidebarSteps.propTypes = {
  stepMessages: PropTypes.arrayOf(PropTypes.string).isRequired, // assuming it's an array of strings
  currentStep: PropTypes.number.isRequired,
  isUserRegistered: PropTypes.bool.isRequired,
};