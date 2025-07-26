import React from "react";

/**
 * DiceAnimation - Basic structure for 3D dice animation component.
 * Will be styled and animated in subsequent tasks.
 */

export interface DiceAnimationProps {
  className?: string;
  style?: React.CSSProperties;
}

const DiceAnimation: React.FC<DiceAnimationProps> = ({
  className = "",
  style = {},
}) => {
  return (
    <div
      className={`dice-animation relative ${className}`}
      style={{ height: "96px", width: "96px", perspective: "400px", ...style }}
      aria-label="Animated 3D dice"
      role="img"
    >
      {/* Cube container with rotation animation */}
      <div
        className="cube absolute top-0 left-0 h-full w-full"
        style={{ transformStyle: "preserve-3d", height: "100%", width: "100%" }}
      >
        {/* Dice faces - pixel art dots using Tailwind for simplicity */}
        {/* Front (1) */}
        <div
          className="face absolute flex items-center justify-center border border-gray-300"
          style={{
            height: "96px",
            width: "96px",
            transform: "rotateY(0deg) translateZ(48px)",
          }}
        >
          <div className="dot h-4 w-4 rounded-full" />
        </div>
        {/* Back (6) */}
        <div
          className="face absolute grid grid-cols-3 grid-rows-2 gap-2 border border-gray-300"
          style={{
            height: "96px",
            width: "96px",
            transform: "rotateY(180deg) translateZ(48px)",
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="dot mx-auto my-auto h-4 w-4 rounded-full" />
          ))}
        </div>
        {/* Top (2) */}
        <div
          className="face absolute flex flex-col items-center justify-between border border-gray-300"
          style={{
            height: "96px",
            width: "96px",
            transform: "rotateX(90deg) translateZ(48px)",
          }}
        >
          <div className="dot mt-4 h-4 w-4 rounded-full" />
          <div className="dot mb-4 h-4 w-4 rounded-full" />
        </div>
        {/* Bottom (5) */}
        <div
          className="face absolute grid grid-cols-3 grid-rows-3 gap-2 border border-gray-300"
          style={{
            height: "96px",
            width: "96px",
            transform: "rotateX(-90deg) translateZ(48px)",
          }}
        >
          {[0, 2, 4, 6, 8].map((i) => (
            <div key={i} className="dot mx-auto my-auto h-4 w-4 rounded-full" />
          ))}
        </div>
        {/* Left (3) */}
        <div
          className="face absolute flex flex-col items-center justify-between border border-gray-300"
          style={{
            height: "96px",
            width: "96px",
            transform: "rotateY(-90deg) translateZ(48px)",
          }}
        >
          <div className="dot mt-4 h-4 w-4 rounded-full" />
          <div className="dot h-4 w-4 rounded-full" />
          <div className="dot mb-4 h-4 w-4 rounded-full" />
        </div>
        {/* Right (4) */}
        <div
          className="face absolute grid grid-cols-2 grid-rows-2 gap-2 border border-gray-300"
          style={{
            height: "96px",
            width: "96px",
            transform: "rotateY(90deg) translateZ(48px)",
          }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="dot mx-auto my-auto h-4 w-4 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiceAnimation;
