import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Building2, Trash2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { getProperties, deleteProperty, getTenantsByProperty, type Property } from "@/lib/store";

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    setProperties(getProperties());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Delete this property and all its tenants?")) {
      deleteProperty(id);
      setProperties(getProperties());
    }
  };

  return (
    <>
      <PageHeader
        title="🏢 Properties"
        action={
          <Link to="/properties/add">
            <Button size="sm" className="gap-1.5 gradient-primary text-primary-foreground rounded-xl shadow-glow">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </Link>
        }
      />
      <div className="p-4 space-y-3 max-w-lg mx-auto -mt-3">
        {properties.length === 0 && (
          <div className="text-center py-16 text-muted-foreground animate-fade-in">
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 opacity-40" />
            </div>
            <p className="font-semibold">No properties yet</p>
            <p className="text-sm mt-1">Tap "Add" to create your first property</p>
          </div>
        )}
        {properties.map((p, i) => {
          const tenants = getTenantsByProperty(p.id);
          const occupied = tenants.length;
          const vacant = p.totalUnits - occupied;
          const occupancyRate = p.totalUnits > 0 ? Math.round((occupied / p.totalUnits) * 100) : 0;
          return (
            <Link key={p.id} to={`/properties/${p.id}`} className="block animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="rounded-2xl glass-card p-4 flex items-center gap-4 active:scale-[0.98] transition-all hover:shadow-card-hover">
                <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow">
                  <Building2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{p.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{p.address}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-paid transition-all" style={{ width: `${occupancyRate}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{occupied}/{p.totalUnits}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); handleDelete(p.id); }}
                  className="h-9 w-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
