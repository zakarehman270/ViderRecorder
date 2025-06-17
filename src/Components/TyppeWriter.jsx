import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const TypewriterEffect = ({ setIsCompleted }) => {
  const [displayedText, setDisplayedText] = useState("");

  const text =
    "Please provide the required details. Then proceed to the dashboard to begin.";
  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    const startTyping = () => {
      const interval = setInterval(() => {
        if (index < text.length - 1) {
          setDisplayedText((prev) => prev + text[index]);
          index++;
        } else {
          clearInterval(interval);
          setIsCompleted(true);
        }
      }, 80);
    };

    const timeout = setTimeout(startTyping, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [setIsCompleted]);

  return (
    <div className="flex justify-center">
      <motion.span
        className="text-2xl text-center font-bold text-[#176A66] max-w-[600px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {displayedText}
      </motion.span>
    </div>
  );
};
TypewriterEffect.propTypes = {
  setIsCompleted: PropTypes.func.isRequired,
};
export default TypewriterEffect;
