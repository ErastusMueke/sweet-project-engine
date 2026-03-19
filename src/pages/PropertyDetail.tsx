import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, Phone, MessageSquare, BanknoteIcon, Trash2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { getProperties, getTenantsByProperty, deleteTenant, type Tenant } from "@/lib/store";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const property = getProperties().find(p => p.id === id);

  useEffect(() => {
    if (id) setTenants(getTenantsByProperty(id));
  }, [id]);

  if (!property) return <div className="p-8 text-center text-muted-foreground">Property not found</div>;

  const handleDelete = (tenantId: string) => {
    if (confirm("Remove this tenant?")) {
      deleteTenant(tenantId);
      setTenants(getTenantsByProperty(id!));
    }
  };

  return (
    <>
      <PageHeader
        title={property.name}
        back
        action={
          <Link to={`/tenants/add?propertyId=${id}`}>
            <Button size="sm" className="gap-1 bg-primary text-primary-foreground">
              <Plus className="h-4 w-4" /> Add Tenant
            </Button>
          </Link>
        }
      />
      <div className="p-4 space-y-3 max-w-lg mx-auto">
        <p className="text-sm text-muted-foreground">{property.address} • {property.totalUnits} units</p>

        {tenants.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">No tenants yet. Add one above!</p>
        )}

        {tenants.map(t => (
          <div key={t.id} className="rounded-lg border border-border bg-card p-3 flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full flex-shrink-0 ${t.paymentStatus === 'paid' ? 'bg-paid' : 'bg-unpaid'}`} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{t.name}</p>
              <p className="text-sm text-muted-foreground">Unit {t.unitNumber} • KES {t.rentAmount.toLocaleString()}</p>
              <span className={`text-xs font-bold ${t.paymentStatus === 'paid' ? 'text-paid' : 'text-unpaid'}`}>
                {t.paymentStatus === 'paid' ? '✓ PAID' : '⚠ NOT PAID'}
              </span>
            </div>
            <div className="flex gap-1">
              <a href={`tel:${t.phone}`} className="p-2 rounded-lg bg-primary/10 text-primary"><Phone className="h-4 w-4" /></a>
              <a href={`sms:${t.phone}`} className="p-2 rounded-lg bg-warning/10 text-warning"><MessageSquare className="h-4 w-4" /></a>
              <Link to={`/payments/add?tenantId=${t.id}`} className="p-2 rounded-lg bg-paid/10 text-paid"><BanknoteIcon className="h-4 w-4" /></Link>
              <button onClick={() => handleDelete(t.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
