// components/auth/AuthCard.tsx
import React from "react";
import { Lock, UserPlus, LogIn } from "lucide-react";
import Card from "../ui/Card";
import type { CardProps } from "../ui/Card";
import type { LucideIcon } from "lucide-react";

export type AuthType =
  | "login"
  | "register"
  | "forgot-password"
  | "reset-password";

export interface AuthCardProps extends Omit<
  CardProps,
  "title" | "icon" | "color"
> {
  authType?: AuthType;
  showHeader?: boolean;
}

const AuthCard: React.FC<AuthCardProps> = ({
  authType = "login",
  showHeader = true,
  children,
  ...cardProps
}) => {
  const authConfig: Record<
    AuthType,
    {
      title: string;
      description: string;
      icon: LucideIcon;
      color: CardProps["color"];
    }
  > = {
    login: {
      title: "Welcome Back",
      description: "Sign in to your account to continue",
      icon: LogIn,
      color: "blue",
    },
    register: {
      title: "Create Account",
      description: "Sign up to get started with your financial journey",
      icon: UserPlus,
      color: "indigo",
    },
    "forgot-password": {
      title: "Reset Password",
      description: "Enter your email to receive reset instructions",
      icon: Lock,
      color: "purple",
    },
    "reset-password": {
      title: "Set New Password",
      description: "Create a new password for your account",
      icon: Lock,
      color: "green",
    },
  };

  const config = authConfig[authType];
  const Icon = config.icon;

  return (
    <Card
      title={showHeader ? config.title : undefined}
      description={showHeader ? config.description : undefined}
      icon={showHeader ? Icon : undefined}
      color={config.color}
      variant="default"
      size="md"
      shadow={true}
      hoverable={false}
      className="w-full"
      {...cardProps}
    >
      {children}
    </Card>
  );
};

export default AuthCard;
