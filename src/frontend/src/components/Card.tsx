import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable card component that serves as a container
 */
export function Card({ title, children, className = "" }: CardProps) {
  return (
    <div
      className={`my-4 rounded-lg border border-white/20 bg-white/5 p-8 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out hover:border-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/10 ${className}`}
    >
      <h3 className="mb-6 bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-2xl font-bold text-transparent">
        {title}
      </h3>
      {children}
    </div>
  );
}
