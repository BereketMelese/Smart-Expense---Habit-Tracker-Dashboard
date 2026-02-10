// components/ui/Card.tsx
import React from "react";
import type { LucideIcon } from "lucide-react";

export type CardVariant = "default" | "outline" | "ghost" | "gradient";
export type CardSize = "sm" | "md" | "lg" | "xl";
export type CardColor = "blue" | "indigo" | "green" | "red" | "gray" | "purple";

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  variant?: CardVariant;
  size?: CardSize;
  color?: CardColor;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  hoverable?: boolean;
  shadow?: boolean;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  padding?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  description,
  icon: Icon,
  variant = "default",
  size = "md",
  color = "blue",
  className = "",
  titleClassName = "",
  bodyClassName = "",
  footer,
  headerAction,
  hoverable = false,
  shadow = true,
  rounded = "lg",
  padding = true,
}) => {
  // Size classes
  const sizeClasses: Record<CardSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  // Rounded classes
  const roundedClasses: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  // Variant classes
  const variantClasses: Record<CardVariant, string> = {
    default: "bg-white",
    outline: "bg-transparent border",
    ghost: "bg-transparent",
    gradient: "bg-gradient-to-br from-white to-gray-50",
  };

  // Color classes for borders and accents
  const colorClasses: Record<
    CardColor,
    { border: string; text: string; bg: string; gradient: string }
  > = {
    blue: {
      border: "border-blue-200",
      text: "text-blue-700",
      bg: "bg-blue-50",
      gradient: "from-blue-50 to-blue-100",
    },
    indigo: {
      border: "border-indigo-200",
      text: "text-indigo-700",
      bg: "bg-indigo-50",
      gradient: "from-indigo-50 to-indigo-100",
    },
    green: {
      border: "border-green-200",
      text: "text-green-700",
      bg: "bg-green-50",
      gradient: "from-green-50 to-green-100",
    },
    red: {
      border: "border-red-200",
      text: "text-red-700",
      bg: "bg-red-50",
      gradient: "from-red-50 to-red-100",
    },
    gray: {
      border: "border-gray-200",
      text: "text-gray-700",
      bg: "bg-gray-50",
      gradient: "from-gray-50 to-gray-100",
    },
    purple: {
      border: "border-purple-200",
      text: "text-purple-700",
      bg: "bg-purple-50",
      gradient: "from-purple-50 to-purple-100",
    },
  };

  // Gradient variant specific class
  const gradientClass =
    variant === "gradient"
      ? `bg-gradient-to-br ${colorClasses[color].gradient}`
      : "";

  const baseClasses = `
    ${sizeClasses[size]}
    ${roundedClasses[rounded]}
    ${variantClasses[variant]}
    ${gradientClass}
    ${shadow ? "shadow-md" : ""}
    ${hoverable ? "transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5" : ""}
    ${variant === "outline" ? colorClasses[color].border : ""}
    ${className}
  `;

  const headerClasses = `
    ${padding ? "px-6 pt-6" : "px-0 pt-0"}
    ${description || headerAction ? "pb-4" : "pb-0"}
  `;

  const bodyClasses = `
    ${padding ? "px-6 py-6" : "px-0 py-0"}
    ${bodyClassName}
  `;

  const footerClasses = `
    ${padding ? "px-6 pb-6" : "px-0 pb-0"}
    pt-0
  `;

  return (
    <section className={baseClasses.trim()}>
      {/* Header Section */}
      {(title || Icon || description || headerAction) && (
        <div className={`border-b border-gray-100 ${headerClasses}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {Icon && (
                <div className={`p-2 rounded-lg ${colorClasses[color].bg}`}>
                  <Icon className={`h-5 w-5 ${colorClasses[color].text}`} />
                </div>
              )}
              <div>
                {title && (
                  <h3
                    className={`text-xl font-semibold text-gray-800 ${titleClassName}`}
                  >
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-1 text-sm text-gray-600">{description}</p>
                )}
              </div>
            </div>
            {headerAction && <div className="shrink-0">{headerAction}</div>}
          </div>
        </div>
      )}

      {/* Body Section */}
      <div className={bodyClasses.trim()}>{children}</div>

      {/* Footer Section */}
      {footer && (
        <div className={`border-t border-gray-100 ${footerClasses}`}>
          {footer}
        </div>
      )}
    </section>
  );
};

export default Card;
