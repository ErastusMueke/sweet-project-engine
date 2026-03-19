import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Building2, Receipt, TrendingDown, BarChart3 } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/properties", icon: Building2, label: "Properties" },
  { to: "/tenants", icon: Users, label: "Tenants" },
  { to: "/payments", icon: Receipt, label: "Payments" },
  { to: "/expenses", icon: TrendingDown, label: "Expenses" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-24 overflow-y-auto">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-card/80 backdrop-blur-xl border-t border-border/50 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
          <div className="flex justify-around items-center h-[68px] max-w-lg mx-auto px-2">
            {navItems.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex flex-col items-center justify-center gap-1 touch-target px-2 py-1.5 rounded-2xl transition-all duration-200 ${
                    active
                      ? "text-primary scale-105"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className={`relative ${active ? "" : ""}`}>
                    {active && (
                      <div className="absolute -inset-2 rounded-xl bg-primary/10 animate-scale-in" />
                    )}
                    <Icon className="h-5 w-5 relative z-10" strokeWidth={active ? 2.5 : 1.8} />
                  </div>
                  <span className={`text-[10px] leading-none ${active ? "font-bold" : "font-medium"}`}>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
