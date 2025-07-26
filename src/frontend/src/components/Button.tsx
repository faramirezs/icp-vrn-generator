import { ReactNode } from "react";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  variant?: "default" | "primary" | "secondary";
}

/**
 * Reusable button component with built-in styling
 */
export function Button({
  onClick,
  disabled = false,
  className = "",
  children,
  variant = "default",
}: ButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-pink-500 to-red-500 border-transparent text-white shadow-lg hover:from-pink-600 hover:to-red-600 hover:shadow-pink-500/25 hover:shadow-xl hover:scale-105 active:scale-95 transform transition-all duration-200";
      case "secondary":
        return "bg-gradient-to-r from-blue-500 to-blue-600 border-transparent text-white shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/25 hover:shadow-xl hover:scale-105 active:scale-95 transform transition-all duration-200";
      default:
        return "bg-gray-700 border-gray-500 text-white hover:border-blue-400 hover:bg-gray-600 transition-colors duration-200";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-inherit focus:outline-auto cursor-pointer rounded-lg px-5 py-3 text-base font-medium focus:outline-4 focus:outline-blue-400 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 ${getVariantClasses()} ${className}`.trim()}
    >
      {children}
    </button>
  );
}
