import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Receipt } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { getPayments, getTenants, type Payment } from "@/lib/store";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const tenants = getTenants();

  useEffect(() => {
    setPayments(getPayments().sort((a, b) => b.paymentDate.localeCompare(a.paymentDate)));
  }, []);

  const getTenantName = (id: string) => tenants.find(t => t.id === id)?.name || "Unknown";

  return (
    <>
      <PageHeader
        title="💰 Payments"
        action={
          <Link to="/payments/add">
            <Button size="sm" className="gap-1.5 bg-paid text-paid-foreground rounded-xl shadow-lg">
              <Plus className="h-4 w-4" /> Record
            </Button>
          </Link>
        }
      />
      <div className="p-4 space-y-3 max-w-lg mx-auto -mt-3">
        {payments.length === 0 && (
          <p className="text-center py-8 text-muted-foreground animate-fade-in">No payments recorded yet</p>
        )}
        {payments.map((p, i) => (
          <Link key={p.id} to={`/receipt/${p.id}`}>
            <div className="rounded-2xl glass-card p-4 flex items-center gap-3 animate-slide-up mb-3 hover:shadow-card-hover transition-shadow" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="h-10 w-10 rounded-xl bg-paid/10 flex items-center justify-center flex-shrink-0">
                <Receipt className="h-5 w-5 text-paid" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{getTenantName(p.tenantId)}</p>
                <p className="text-xs text-muted-foreground">{p.paymentDate} • {p.forMonth}</p>
              </div>
              <p className="font-extrabold text-paid text-sm">KES {p.amount.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
