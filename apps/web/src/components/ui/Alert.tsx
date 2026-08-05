import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

export const AlertVariant = {
  Success: "success",
  Error: "error",
  Warning: "warning",
} as const;
export type AlertVariant = (typeof AlertVariant)[keyof typeof AlertVariant];

const styles: Record<AlertVariant, { box: string; icon: IconName }> = {
  success: { box: "bg-success-100 border-success-200 text-success-800", icon: "check" },
  error: { box: "bg-error-100 border-error-200 text-error-800", icon: "alert" },
  warning: { box: "bg-warning-100 border-warning-200 text-warning-800", icon: "clock" },
};

export interface AlertProps {
  variant?: AlertVariant;
  className?: string;
  children: ReactNode;
}

export function Alert({ variant = AlertVariant.Success, className, children }: AlertProps) {
  const s = styles[variant];
  return (
    <div
      role={variant === AlertVariant.Error ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 px-4 py-3.5 rounded-sm border text-[14px]",
        s.box,
        className,
      )}
    >
      <Icon name={s.icon} size={18} className="mt-px shrink-0" />
      <span>{children}</span>
    </div>
  );
}
