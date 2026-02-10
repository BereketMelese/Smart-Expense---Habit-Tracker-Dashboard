// components/ui/FeatureCard.tsx
import React from "react";
import type { LucideIcon } from "lucide-react";
import Card from "./Card";
import type { CardProps } from "./Card";

export interface FeatureCardProps extends Omit<
  CardProps,
  "variant" | "hoverable"
> {
  featureIcon: LucideIcon;
  featureTitle: string;
  featureDescription: string;
  actionButton?: React.ReactNode;
  badge?: string;
  stats?: { label: string; value: string }[];
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  featureIcon: Icon,
  featureTitle,
  featureDescription,
  actionButton,
  badge,
  stats,
  children,
  ...cardProps
}) => {
  return (
    <Card variant="gradient" hoverable={true} className="h-full" {...cardProps}>
      {/* Feature Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-linear-to-br from-blue-100 to-indigo-100 rounded-xl">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800">
              {featureTitle}
            </h4>
            <p className="text-sm text-gray-600 mt-1">{featureDescription}</p>
          </div>
        </div>
        {badge && (
          <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            {badge}
          </span>
        )}
      </div>

      {/* Stats (if provided) */}
      {stats && stats.length > 0 && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mb-4">{children}</div>

      {/* Action Button */}
      {actionButton && <div className="mt-6">{actionButton}</div>}
    </Card>
  );
};

export default FeatureCard;
