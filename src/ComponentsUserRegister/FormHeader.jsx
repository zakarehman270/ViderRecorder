import PropTypes from "prop-types";

export default function FormHeader({ onPrevious, currentStep }) {
  return (
    <div className="flex items-center">
      {currentStep > 0 && (
        <div>
          <img
            src="/arrowBack.svg"
            alt="arrowBack"
            className="w-[25px] cursor-pointer mr-3 ml-[-5px]"
            onClick={onPrevious}
          />
        </div>
      )}
      <div>
        <div className="text-2xl md:text-3xl">
          <span className="text-[#45A6A6] font-bold">Talking</span>
          <span className="text-[#68B5B5] font-light">App</span>
        </div>
        <div className="text-[#9C9C9C] font-medium text-[0.7rem] md:text-[0.775rem] ml-2 mb-0 -mt-[7px]">
          By WebTronix
        </div>
      </div>
    </div>
  );
}
FormHeader.propTypes = {
  onPrevious: PropTypes.func.isRequired,   // assuming it's a required callback function
  currentStep: PropTypes.number.isRequired // assuming it's a required number
};