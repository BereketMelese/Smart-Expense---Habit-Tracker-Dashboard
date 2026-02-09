import React from "react";

export type LoaderSize = "small" | "medium" | "large" | "xlarge";
export type LoaderVariant = "spinner" | "dots" | "bars" | "ring";

export interface LoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  fullScreen?: boolean;
  text?: string;
  className?: string;
  textClassName?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = "medium",
  variant = "spinner",
  fullScreen = false,
  text = "Loading...",
  className = "",
  textClassName = "",
}) => {
  const sizeClasses: Record<LoaderSize, string> = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
    xlarge: "w-20 h-20",
  };

  const dotSize = sizeClasses[size].split(" ")[0].replace("w-", "w-");
  const dotHeight = sizeClasses[size].split(" ")[1].replace("h-", "h-");

  const variantStyles: Record<LoaderVariant, React.ReactNode> = {
    spinner: (
      <div
        className={`${sizeClasses[size]} border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin`}
        data-testid="spinner-loader"
      />
    ),
    dots: (
      <div className="flex space-x-2" data-testid="dots-loader">
        <div
          className={`${dotSize} ${dotHeight} bg-blue-600 rounded-full animate-bounce`}
          style={{ animationDelay: "0ms" }}
        />
        <div
          className={`${dotSize} ${dotHeight} bg-blue-600 rounded-full animate-bounce`}
          style={{ animationDelay: "150ms" }}
        />
        <div
          className={`${dotSize} ${dotHeight} bg-blue-600 rounded-full animate-bounce`}
          style={{ animationDelay: "300ms" }}
        />
      </div>
    ),
    bars: (
      <div
        className="flex items-end justify-center space-x-1"
        data-testid="bars-loader"
      >
        <div
          className="w-2 bg-blue-400 rounded-t animate-pulse"
          style={{ height: "1rem", animationDelay: "0ms" }}
        />
        <div
          className="w-2 bg-blue-500 rounded-t animate-pulse"
          style={{ height: "1.5rem", animationDelay: "150ms" }}
        />
        <div
          className="w-2 bg-blue-600 rounded-t animate-pulse"
          style={{ height: "2rem", animationDelay: "300ms" }}
        />
        <div
          className="w-2 bg-blue-700 rounded-t animate-pulse"
          style={{ height: "1.5rem", animationDelay: "450ms" }}
        />
        <div
          className="w-2 bg-blue-800 rounded-t animate-pulse"
          style={{ height: "1rem", animationDelay: "600ms" }}
        />
      </div>
    ),
    ring: (
      <div className="relative" data-testid="ring-loader">
        <div
          className={`${sizeClasses[size]} border-2 border-blue-200 rounded-full`}
        />
        <div
          className={`${sizeClasses[size]} border-2 border-transparent border-t-blue-600 border-r-blue-600 rounded-full animate-spin absolute top-0 left-0`}
        />
      </div>
    ),
  };

  const loaderContent = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {variantStyles[variant]}
      {text && (
        <p
          className={`mt-2 text-blue-600 dark:text-blue-400 text-sm font-medium ${textClassName}`}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80 flex flex-col items-center justify-center z-50"
        data-testid="fullscreen-loader"
      >
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;
