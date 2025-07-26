import React from "react";

// Dice rotation keyframes and animation styles
const diceAnimationStyle = `
@keyframes dice-spin {
  from { transform: rotateX(0deg) rotateY(0deg); }
  to { transform: rotateX(360deg) rotateY(360deg); }
}
.dice-animation .cube {
  animation: dice-spin 4s linear infinite;
  transition: animation-duration 0.3s;
}
.dice-animation:hover .cube {
  animation-duration: 2s;
}
@media (prefers-reduced-motion: reduce) {
  .dice-animation .cube {
    animation: none !important;
  }
}
 .dice-animation .face {
   box-shadow: 0 2px 8px 0 rgba(0,0,0,0.12);
   background: linear-gradient(135deg, #fff 80%, #e0e0e0 100%);
   border-radius: 8px;
 }
 .dice-animation .dot {
   background: #222;
   border: 2px solid #fff;
   box-shadow: 0 0 2px #000a;
 }
 .dice-animation .face {
   background-color: rgba(255,255,255,0.92);
 }
`;

/**
 * DiceAnimation - Basic structure for 3D dice animation component.
 * Will be styled and animated in subsequent tasks.
 */

export interface DiceAnimationProps {
  className?: string;
  style?: React.CSSProperties;
}

const DiceAnimation: React.FC<DiceAnimationProps> = ({ className = "", style = {} }) => {
  return (
    <>
      <div
      <style>{diceAnimationStyle}</style>
      <div
        className={`dice-animation relative ${className}`}
        style={{ height: "96px", width: "96px", perspective: 400, ...style }}
      >
        {/* Cube container with rotation animation */}
        <div
          className="cube absolute top-0 left-0 h-full w-full"
          style={{
            transformStyle: "preserve-3d",
            height: "100%",
            width: "100%",
          }}
        >
          {/* Dice faces - pixel art dots using Tailwind for simplicity */}
          {/* Front (1) */}
          <div
            className="face absolute flex items-center justify-center border border-gray-300 bg-white/90"
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
            className="face absolute grid grid-cols-3 grid-rows-2 gap-2 border border-gray-300 bg-white/90"
            style={{
              height: "96px",
              width: "96px",
              transform: "rotateY(180deg) translateZ(48px)",
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="dot mx-auto my-auto h-4 w-4 rounded-full"
              />
            ))}
          </div>
          {/* Top (2) */}
          <div
            className="face absolute flex flex-col items-center justify-between border border-gray-300 bg-white/90"
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
            className="face absolute grid grid-cols-3 grid-rows-3 gap-2 border border-gray-300 bg-white/90"
            style={{
              height: "96px",
              width: "96px",
              transform: "rotateX(-90deg) translateZ(48px)",
            }}
          >
            {[0, 2, 4, 6, 8].map((i) => (
              <div
                key={i}
                className="dot mx-auto my-auto h-4 w-4 rounded-full"
              />
            ))}
          </div>
          {/* Left (3) */}
          <div
            className="face absolute flex flex-col items-center justify-between border border-gray-300 bg-white/90"
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
            className="face absolute grid grid-cols-2 grid-rows-2 gap-2 border border-gray-300 bg-white/90"
            style={{
              height: "96px",
              width: "96px",
              transform: "rotateY(90deg) translateZ(48px)",
            }}
          >
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="dot mx-auto my-auto h-4 w-4 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DiceAnimation;
