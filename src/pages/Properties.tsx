import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Building2, Users, Trash2 } from "lucide-react";
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
            <Button size="sm" className="gap-1 bg-primary text-primary-foreground">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </Link>
        }
      />
      <div className="p-4 space-y-3 max-w-lg mx-auto">
        {properties.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No properties yet</p>
            <p className="text-sm">Tap "Add" to create your first property</p>
          </div>
        )}
        {properties.map(p => {
          const tenants = getTenantsByProperty(p.id);
          const occupied = tenants.length;
          const vacant = p.totalUnits - occupied;
          return (
            <Link key={p.id} to={`/properties/${p.id}`} className="block">
              <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-4 active:bg-accent transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{p.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{p.address}</p>
                  <div className="flex gap-3 mt-1 text-xs">
                    <span className="text-paid font-medium">{occupied} occupied</span>
                    <span className="text-muted-foreground">{vacant} vacant</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); handleDelete(p.id); }}
                  className="touch-target flex items-center justify-center text-muted-foreground hover:text-destructive p-2"
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
