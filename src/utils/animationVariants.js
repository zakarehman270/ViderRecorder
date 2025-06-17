// utils/animationVariants.js
export const variants = {
    enter: (direction) => ({ 
      x: direction > 0 ? 300 : -300, 
      opacity: 0 
    }),
    center: { 
      x: 0, 
      opacity: 1 
    },
    exit: (direction) => ({ 
      x: direction > 0 ? -300 : 300, 
      opacity: 0 
    }),
  };