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
            <Button size="sm" className="gap-1 bg-primary text-primary-foreground">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </Link>
        }
      />
      <div className="p-4 space-y-3 max-w-lg mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tenants..." className="pl-10 h-11" />
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">No tenants found</p>
        )}

        {filtered.map(t => (
          <div key={t.id} className="rounded-lg border border-border bg-card p-3 flex items-center gap-3 animate-slide-up">
            <div className={`h-3 w-3 rounded-full flex-shrink-0 ${t.paymentStatus === 'paid' ? 'bg-paid' : 'bg-unpaid'}`} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{t.name}</p>
              <p className="text-xs text-muted-foreground truncate">{getPropName(t.propertyId)} • Unit {t.unitNumber}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-medium">KES {t.rentAmount.toLocaleString()}</span>
                <span className={`text-xs font-bold ${t.paymentStatus === 'paid' ? 'text-paid' : 'text-unpaid'}`}>
                  {t.paymentStatus === 'paid' ? '✓ PAID' : '⚠ UNPAID'}
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              <a href={`tel:${t.phone}`} className="p-2 rounded-lg bg-primary/10 text-primary"><Phone className="h-4 w-4" /></a>
              <a href={`sms:${t.phone}`} className="p-2 rounded-lg bg-warning/10 text-warning"><MessageSquare className="h-4 w-4" /></a>
              <Link to={`/payments/add?tenantId=${t.id}`} className="p-2 rounded-lg bg-paid/10 text-paid"><BanknoteIcon className="h-4 w-4" /></Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
