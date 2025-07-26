import React from "react";

/**
 * DiceAnimation - 3D animated dice component with pixel art styling
 * Features continuous rotation, hover effects, responsive behavior, and accessibility support
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
    <>
      {/* CSS keyframes and animations */}
      <style>
        {`
          @keyframes dice-rotate {
            0% {
              transform: rotateX(0deg) rotateY(0deg);
            }
            25% {
              transform: rotateX(90deg) rotateY(90deg);
            }
            50% {
              transform: rotateX(180deg) rotateY(180deg);
            }
            75% {
              transform: rotateX(270deg) rotateY(270deg);
            }
            100% {
              transform: rotateX(360deg) rotateY(360deg);
            }
          }

          .dice-animation .cube {
            animation: dice-rotate 4s infinite linear;
            transition: animation-duration 0.3s ease;
          }

          .dice-animation:hover .cube,
          .dice-animation:focus .cube,
          .dice-animation:active .cube {
            animation-duration: 2s;
          }

          .dice-face {
            background: linear-gradient(145deg, #f3f4f6, #e5e7eb);
            border: 2px solid #d1d5db;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .dice-dot {
            background: #374151;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          }

          /* Responsive perspective adjustments */
          .dice-animation {
            perspective: 400px;
          }

          @media (max-width: 480px) {
            .dice-animation {
              perspective: 300px;
            }
          }

          @media (min-width: 1024px) {
            .dice-animation {
              perspective: 500px;
            }
          }

          /* Touch device optimizations */
          @media (hover: none) and (pointer: coarse) {
            .dice-animation .cube {
              /* Slightly faster animation on touch devices for better feedback */
              animation-duration: 3.5s;
            }
          }

          /* Accessibility: Respect reduced motion preference */
          @media (prefers-reduced-motion: reduce) {
            .dice-animation .cube {
              animation: none;
              /* Provide a subtle static rotation for visual interest */
              transform: rotateX(15deg) rotateY(15deg);
            }
            .dice-animation:hover .cube,
            .dice-animation:focus .cube,
            .dice-animation:active .cube {
              animation: none;
            }
          }

          /* Ensure proper rendering on different pixel densities */
          .dice-animation,
          .dice-face {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            transform-style: preserve-3d;
            -webkit-transform-style: preserve-3d;
          }
        `}
      </style>

      {/* Centered dice container with responsive behavior */}
      <div
        className={`dice-animation mx-auto flex items-center justify-center ${className}`}
        style={{
          ...style,
          minHeight: "120px", // Ensure adequate space on all screen sizes
          width: "fit-content", // Prevent overflow issues
        }}
        tabIndex={0} // Enable keyboard focus for accessibility
        role="img"
        aria-label="Animated 3D dice showing random number generation"
      >
        <div
          className="cube relative"
          style={{
            height: "96px",
            width: "96px",
            transformStyle: "preserve-3d",
            // Ensure the cube stays centered in its container
            margin: "0 auto",
          }}
        >
          {/* Front face - 1 dot */}
          <div
            className="dice-face absolute flex items-center justify-center"
            style={{
              height: "96px",
              width: "96px",
              transform: "rotateY(0deg) translateZ(48px)",
            }}
          >
            <div className="dice-dot h-3 w-3 rounded-full" />
          </div>

          {/* Back face - 6 dots */}
          <div
            className="dice-face absolute p-2"
            style={{
              height: "96px",
              width: "96px",
              transform: "rotateY(180deg) translateZ(48px)",
            }}
          >
            <div className="grid h-full w-full grid-cols-2 gap-2">
              <div className="flex flex-col justify-between">
                <div className="dice-dot h-3 w-3 rounded-full" />
                <div className="dice-dot h-3 w-3 rounded-full" />
                <div className="dice-dot h-3 w-3 rounded-full" />
              </div>
              <div className="flex flex-col justify-between">
                <div className="dice-dot h-3 w-3 rounded-full" />
                <div className="dice-dot h-3 w-3 rounded-full" />
                <div className="dice-dot h-3 w-3 rounded-full" />
              </div>
            </div>
          </div>

          {/* Top face - 2 dots */}
          <div
            className="dice-face absolute flex items-center justify-between p-4"
            style={{
              height: "96px",
              width: "96px",
              transform: "rotateX(90deg) translateZ(48px)",
            }}
          >
            <div className="dice-dot h-3 w-3 rounded-full" />
            <div className="dice-dot h-3 w-3 rounded-full" />
          </div>

          {/* Bottom face - 5 dots */}
          <div
            className="dice-face absolute p-2"
            style={{
              height: "96px",
              width: "96px",
              transform: "rotateX(-90deg) translateZ(48px)",
            }}
          >
            <div className="grid h-full w-full grid-cols-3 gap-1">
              <div className="dice-dot h-3 w-3 rounded-full" />
              <div></div>
              <div className="dice-dot h-3 w-3 rounded-full" />
              <div></div>
              <div className="dice-dot h-3 w-3 rounded-full" />
              <div></div>
              <div className="dice-dot h-3 w-3 rounded-full" />
              <div></div>
              <div className="dice-dot h-3 w-3 rounded-full" />
            </div>
          </div>

          {/* Left face - 3 dots */}
          <div
            className="dice-face absolute flex flex-col items-center justify-between p-4"
            style={{
              height: "96px",
              width: "96px",
              transform: "rotateY(-90deg) translateZ(48px)",
            }}
          >
            <div className="dice-dot h-3 w-3 rounded-full" />
            <div className="dice-dot h-3 w-3 rounded-full" />
            <div className="dice-dot h-3 w-3 rounded-full" />
          </div>

          {/* Right face - 4 dots */}
          <div
            className="dice-face absolute p-3"
            style={{
              height: "96px",
              width: "96px",
              transform: "rotateY(90deg) translateZ(48px)",
            }}
          >
            <div className="grid h-full w-full grid-cols-2 gap-4">
              <div className="flex flex-col justify-between">
                <div className="dice-dot h-3 w-3 rounded-full" />
                <div className="dice-dot h-3 w-3 rounded-full" />
              </div>
              <div className="flex flex-col justify-between">
                <div className="dice-dot h-3 w-3 rounded-full" />
                <div className="dice-dot h-3 w-3 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiceAnimation;
