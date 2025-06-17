import PropTypes from "prop-types";
import {  useEffect } from "react";

const Countdown = ({ start , counter , setCounter }) => {
  useEffect(() => {
    if (start) {
      setCounter(3); // Reset counter when countdown starts
    }
  }, [start]);

  useEffect(() => {
    if (counter === null || counter < -1) return;

    const timer = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  return (
    <div className="text-3xl font-bold text-[#ff0000]">
      {counter !== null && counter >= -1 && (
        <span key={counter} className="countdown">
          {counter === -1 ? "SMILE!!" : counter}
        </span>
      )}
    </div>
  );
};
Countdown.propTypes = {
  start: PropTypes.number.isRequired,
  counter: PropTypes.number.isRequired,
  setCounter: PropTypes.func.isRequired, // Add this line
};
export default Countdown;
