"use client";

import { motion } from "framer-motion";

const Waveform = () => {
  return (
    <div className="flex items-center justify-center space-x-1">
      {[1, 2, 3, 4, 5].map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-8 bg-[#176A66] rounded-lg"
          animate={{
            scaleY: [1, 1.5, 1, 0.8, 1.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.6,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default Waveform;
