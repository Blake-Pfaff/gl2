interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: "sm" | "md" | "lg";
  /** Color theme for the spinner */
  color?: "primary" | "purple" | "blue" | "gray";
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** Optional text to display below the spinner */
  text?: string;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

const colorClasses = {
  primary: "border-primary-500",
  purple: "border-purple-500",
  blue: "border-blue-500",
  gray: "border-gray-500",
};

/**
 * A reusable loading spinner component with customizable size, color, and text.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <LoadingSpinner />
 *
 * // With custom size and color
 * <LoadingSpinner size="lg" color="primary" text="Loading data..." />
 *
 * // With custom styling
 * <LoadingSpinner className="my-8" text="Please wait..." />
 * ```
 */
export default function LoadingSpinner({
  size = "md",
  color = "primary",
  className = "",
  text,
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex flex-col justify-center items-center py-12 ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`}
      />
      {text && <p className="mt-4 text-secondary text-body">{text}</p>}
    </div>
  );
}
