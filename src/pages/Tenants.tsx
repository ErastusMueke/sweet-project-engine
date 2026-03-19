import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Phone, MessageSquare, BanknoteIcon, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTenants, getProperties, type Tenant } from "@/lib/store";

export default function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [search, setSearch] = useState("");
  const properties = getProperties();

  useEffect(() => {
    setTenants(getTenants());
  }, []);

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.unitNumber.toLowerCase().includes(search.toLowerCase())
  );

  const getPropName = (propId: string) => properties.find(p => p.id === propId)?.name || "";

  return (
    <>
      <PageHeader
        title="👥 Tenants"
        action={
          <Link to="/tenants/add">
            <Button size="sm" className="gap-1.5 gradient-primary text-primary-foreground rounded-xl shadow-glow">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </Link>
        }
      />
      <div className="p-4 space-y-3 max-w-lg mx-auto -mt-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tenants..." className="pl-10 h-12 rounded-2xl bg-card border-border/50 shadow-glass" />
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-8 text-muted-foreground animate-fade-in">No tenants found</p>
        )}

        {filtered.map((t, i) => (
          <div key={t.id} className="rounded-2xl glass-card p-4 flex items-center gap-3 animate-slide-up hover:shadow-card-hover transition-shadow" style={{ animationDelay: `${i * 40}ms` }}>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${t.paymentStatus === 'paid' ? 'bg-paid/10 text-paid' : 'bg-unpaid/10 text-unpaid'}`}>
              {t.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{t.name}</p>
              <p className="text-xs text-muted-foreground truncate">{getPropName(t.propertyId)} • Unit {t.unitNumber}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold">KES {t.rentAmount.toLocaleString()}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${t.paymentStatus === 'paid' ? 'bg-paid/10 text-paid' : 'bg-unpaid/10 text-unpaid'}`}>
                  {t.paymentStatus === 'paid' ? '✓ Paid' : 'Unpaid'}
                </span>
              </div>
            </div>
            <div className="flex gap-1.5">
              <a href={`tel:${t.phone}`} className="h-9 w-9 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Phone className="h-4 w-4" /></a>
              <a href={`sms:${t.phone}`} className="h-9 w-9 flex items-center justify-center rounded-xl bg-warning/10 text-warning hover:bg-warning/20 transition-colors"><MessageSquare className="h-4 w-4" /></a>
              <Link to={`/payments/add?tenantId=${t.id}`} className="h-9 w-9 flex items-center justify-center rounded-xl bg-paid/10 text-paid hover:bg-paid/20 transition-colors"><BanknoteIcon className="h-4 w-4" /></Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
