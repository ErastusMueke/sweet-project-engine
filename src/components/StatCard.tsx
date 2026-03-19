import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: "from-card to-card border-border/50",
  success: "from-paid/5 to-paid/10 border-paid/20",
  warning: "from-warning/5 to-warning/10 border-warning/20",
  danger: "from-unpaid/5 to-unpaid/10 border-unpaid/20",
};

export default function StatCard({ icon, label, value, variant = "default" }: StatCardProps) {
  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-4 flex items-center gap-3 animate-scale-in shadow-glass transition-shadow hover:shadow-card-hover ${variantStyles[variant]}`}>
      <div className="h-10 w-10 rounded-xl bg-background/60 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-sm">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider truncate">{label}</p>
        <p className="text-lg font-extrabold truncate mt-0.5">{value}</p>
      </div>
    </div>
  );
}
