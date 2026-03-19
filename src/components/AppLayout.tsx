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
      <main className="flex-1 pb-20 overflow-y-auto">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center justify-center gap-0.5 touch-target px-2 py-1 rounded-lg transition-colors duration-150 ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-medium leading-none">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
