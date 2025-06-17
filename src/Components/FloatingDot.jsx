import Waveform from "@/pages/Waveform";
import PropTypes from "prop-types";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function FloatingDot({
  speaking,
  isCompleted,
  setCurrentOuterStep,
  loading,
}) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  const animationRef = useRef(null);
  const dotRef = useRef(null);

  const location = useLocation();

  // Get dot size based on viewport with better breakpoints
  const getDotSize = () => {
    const viewportWidth = window.innerWidth;

    // More granular responsive dot sizing
    if (viewportWidth <= 320) {
      // Very small mobile
      return { width: 60, height: 60 };
    } else if (viewportWidth <= 480) {
      // Mobile
      return { width: 72, height: 72 };
    } else if (viewportWidth <= 768) {
      // Tablet
      return { width: 96, height: 96 };
    } else if (viewportWidth <= 1024) {
      // Small desktop
      return { width: 108, height: 108 };
    } else {
      // Large desktop
      return { width: 112, height: 112 };
    }
  };

  // Get responsive margins for different screen sizes
  const getResponsiveMargins = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (viewportWidth <= 320) {
      // Very small mobile
      return {
        right: Math.min(15, viewportWidth * 0.03),
        bottom: Math.min(15, viewportHeight * 0.02),
        centerOffset: 80, // Reduced offset for very small screens
      };
    } else if (viewportWidth <= 480) {
      // Mobile
      return {
        right: Math.min(20, viewportWidth * 0.04),
        bottom: Math.min(20, viewportHeight * 0.025),
        centerOffset: 100,
      };
    } else if (viewportWidth <= 768) {
      // Tablet
      return {
        right: Math.min(25, viewportWidth * 0.035),
        bottom: Math.min(25, viewportHeight * 0.03),
        centerOffset: 120,
      };
    } else {
      // Desktop
      return {
        right: 30,
        bottom: 20,
        centerOffset: 120,
      };
    }
  };

  const [dotSize, setDotSize] = useState(getDotSize());
  const [margins, setMargins] = useState(getResponsiveMargins());

  useLayoutEffect(() => {
    const centerX = Math.max(0, window.innerWidth / 2 - dotSize.width / 2);
    const slightlyAboveCenterY = Math.max(
      0,
      window.innerHeight / 2 - dotSize.height / 2 - margins.centerOffset
    );

    setPosition({ x: centerX, y: slightlyAboveCenterY });
    setTargetPosition({ x: centerX, y: slightlyAboveCenterY });
  }, [dotSize, margins]);

  // Handle window resize with debouncing for better performance
  useEffect(() => {
    let resizeTimer;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newDotSize = getDotSize();
        const newMargins = getResponsiveMargins();

        setDotSize(newDotSize);
        setMargins(newMargins);

        // If completed, move to bottom right corner with responsive margin
        if (
          isCompleted ||
          location?.search?.includes("edit") ||
          location?.search?.includes("New")
        ) {
          const rightPos = Math.max(
            0,
            window.innerWidth - newDotSize.width - newMargins.right
          );
          const bottomPos = Math.max(
            0,
            window.innerHeight - newDotSize.height - newMargins.bottom
          );

          setTargetPosition({
            x: rightPos,
            y: bottomPos,
          });
        } else {
          // Recenter the dot with bounds checking
          const centerX = Math.max(
            0,
            window.innerWidth / 2 - newDotSize.width / 2
          );
          const centerY = Math.max(
            0,
            window.innerHeight / 2 -
              newDotSize.height / 2 -
              newMargins.centerOffset
          );

          setTargetPosition({
            x: centerX,
            y: centerY,
          });
        }
      }, 100); // Debounce resize events
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [isCompleted, location]);

  useEffect(() => {
    if (isCompleted) {
      const rightPos = Math.max(
        0,
        window.innerWidth - dotSize.width - margins.right
      );
      const bottomPos = Math.max(
        0,
        window.innerHeight - dotSize.height - margins.bottom
      );

      setTargetPosition({
        x: rightPos,
        y: bottomPos,
      });
    }
  }, [isCompleted, dotSize, margins]);

  useEffect(() => {
    if (
      location?.search?.includes("edit") ||
      location?.search?.includes("New")
    ) {
      const rightPos = Math.max(
        0,
        window.innerWidth - dotSize.width - margins.right
      );
      const bottomPos = Math.max(
        0,
        window.innerHeight - dotSize.height - margins.bottom
      );

      setTargetPosition({
        x: rightPos,
        y: bottomPos,
      });
    }
  }, [location, dotSize, margins]);

  // Animation effect - moves the dot to target position
  useEffect(() => {
    const moveDot = () => {
      setPosition((prev) => {
        // Calculate the distance between current position and target position
        const dx = targetPosition.x - prev.x;
        const dy = targetPosition.y - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Stop animation if close enough to target
        if (distance < 3) {
          // Reduced threshold for smoother animation
          if (isCompleted) {
            setCurrentOuterStep(1);
          }
          cancelAnimationFrame(animationRef.current);
          return prev;
        }

        // Dynamically adjust the interpolation factor based on distance
        const speedFactor = Math.min(1, distance / 10);
        const interpolationFactor = 0.08 + speedFactor * 0.35; // Slightly smoother animation

        const newX = prev.x + dx * interpolationFactor;
        const newY = prev.y + dy * interpolationFactor;

        // Ensure the dot stays within screen bounds
        const boundedX = Math.max(
          0,
          Math.min(window.innerWidth - dotSize.width, newX)
        );
        const boundedY = Math.max(
          0,
          Math.min(window.innerHeight - dotSize.height, newY)
        );

        animationRef.current = requestAnimationFrame(moveDot);
        return { x: boundedX, y: boundedY };
      });
    };

    // Only start animation if there's a significant distance to cover
    const dx = targetPosition.x - position.x;
    const dy = targetPosition.y - position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 3) {
      animationRef.current = requestAnimationFrame(moveDot);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [targetPosition, setCurrentOuterStep, isCompleted, dotSize]);

  // Get responsive SVG dimensions
  const getSVGDimensions = () => {
    const viewportWidth = window.innerWidth;

    if (viewportWidth <= 320) {
      return { width: 60, height: 45 };
    } else if (viewportWidth <= 480) {
      return { width: 70, height: 52 };
    } else {
      return { width: 80, height: 60 };
    }
  };

  const svgDimensions = getSVGDimensions();

  return (
    <div
      ref={dotRef}
      className={`bg-white rounded-full shadow-xl cursor-pointer absolute flex items-center justify-center ${
        speaking ? "animatePulse" : ""
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${dotSize.width}px`,
        height: `${dotSize.height}px`,
        transition: "none",
        zIndex: "3",
        pointerEvents: "auto",
        // Ensure the dot doesn't go outside viewport
        maxWidth: "100vw",
        maxHeight: "100vh",
      }}
    >
      {loading ? (
        <div className="loader"></div>
      ) : speaking ? (
        <Waveform />
      ) : (
        <div
          className="hero"
          style={{
            transform: `scale(${dotSize.width / 112})`,
            transformOrigin: "center",
            // Prevent scaling issues on very small screens
            minWidth: "0",
            minHeight: "0",
            overflow: "hidden",
          }}
        >
          <svg
            width={svgDimensions.width}
            height={svgDimensions.height}
            viewBox="5 0 80 60"
            style={{
              // Ensure SVG scales properly
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            <path
              className="wave"
              fill="none"
              stroke="#176A66"
              strokeWidth="4"
              strokeLinecap="round"
              d="M 0 37.5 c 7.684 0 7.172 -15 15 -15 s 7.172 15 15 15 s 7.172 -15 15 -15 s 7.172 15 15 15 s 7.172 -15 15 -15 s 7.172 15 15 15 s 7.172 -15 15 -15 s 7.172 15 15 15 s 7.172 -15 15 -15 s 7.172 15 15 15 s 7.172 -15 15 -15"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

FloatingDot.propTypes = {
  speaking: PropTypes.bool.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  setCurrentOuterStep: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  currentOuterStep: PropTypes.number.isRequired,
};
