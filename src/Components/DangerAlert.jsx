import PropTypes from "prop-types";

const DangerAlert = ({ message }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 pt-[0.3rem] pb-[0.3rem] rounded-[7px] relative" role="alert">
      <span className="block sm:inline"> {message}</span>
    </div>
  );
};
DangerAlert.propTypes = {
  message: PropTypes.string.isRequired,
};
export default DangerAlert;