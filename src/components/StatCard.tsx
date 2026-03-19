import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantClasses = {
  default: "bg-card border-border",
  success: "bg-paid/10 border-paid/30",
  warning: "bg-warning/10 border-warning/30",
  danger: "bg-unpaid/10 border-unpaid/30",
};

export default function StatCard({ icon, label, value, variant = "default" }: StatCardProps) {
  return (
    <div className={`rounded-lg border p-3 flex items-center gap-3 animate-slide-up ${variantClasses[variant]}`}>
      <div className="flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium truncate">{label}</p>
        <p className="text-lg font-bold truncate">{value}</p>
      </div>
    </div>
  );
}
