import { useState, useEffect } from "react";

/**
 * Dice rolling loader component
 */
export function Loader() {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  // Dice dot patterns for faces 1-6
  const diceFaces = {
    1: [{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }],
    2: [
      { top: "25%", left: "25%", transform: "translate(-50%, -50%)" },
      { top: "75%", left: "75%", transform: "translate(-50%, -50%)" },
    ],
    3: [
      { top: "25%", left: "25%", transform: "translate(-50%, -50%)" },
      { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
      { top: "75%", left: "75%", transform: "translate(-50%, -50%)" },
    ],
    4: [
      { top: "25%", left: "25%", transform: "translate(-50%, -50%)" },
      { top: "25%", left: "75%", transform: "translate(-50%, -50%)" },
      { top: "75%", left: "25%", transform: "translate(-50%, -50%)" },
      { top: "75%", left: "75%", transform: "translate(-50%, -50%)" },
    ],
    5: [
      { top: "25%", left: "25%", transform: "translate(-50%, -50%)" },
      { top: "25%", left: "75%", transform: "translate(-50%, -50%)" },
      { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
      { top: "75%", left: "25%", transform: "translate(-50%, -50%)" },
      { top: "75%", left: "75%", transform: "translate(-50%, -50%)" },
    ],
    6: [
      { top: "25%", left: "25%", transform: "translate(-50%, -50%)" },
      { top: "25%", left: "75%", transform: "translate(-50%, -50%)" },
      { top: "50%", left: "25%", transform: "translate(-50%, -50%)" },
      { top: "50%", left: "75%", transform: "translate(-50%, -50%)" },
      { top: "75%", left: "25%", transform: "translate(-50%, -50%)" },
      { top: "75%", left: "75%", transform: "translate(-50%, -50%)" },
    ],
  } as const;

  useEffect(() => {
    const rollDice = () => {
      setIsRolling(true);

      // Change numbers rapidly while spinning
      const rapidChange = setInterval(() => {
        setDiceValue(Math.floor(Math.random() * 6) + 1);
      }, 100); // Change every 100ms while spinning

      // Stop spinning and rapid changes, then set final value
      setTimeout(() => {
        clearInterval(rapidChange);
        setIsRolling(false);
        setDiceValue(Math.floor(Math.random() * 6) + 1);
      }, 1200); // Animation completes, then show final number
    };

    // Initial roll
    rollDice();

    // Continue rolling every 3 seconds (1.2s animation + 1.8s pause)
    const interval = setInterval(rollDice, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto mt-8 flex justify-center">
      <div
        className={`relative h-16 w-16 rounded-lg border-2 border-gray-300 bg-white shadow-lg ${
          isRolling ? "dice-rolling" : ""
        }`}
        style={{ perspective: "200px" }}
      >
        {diceFaces[diceValue as keyof typeof diceFaces].map((dot, index) => (
          <div key={index} className="dice-dot" style={dot} />
        ))}
      </div>
    </div>
  );
}
