import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Users, BanknoteIcon, AlertTriangle, Plus, Phone, MessageSquare, TrendingUp } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { getDashboardStats, seedDemoData, type Tenant } from "@/lib/store";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [stats, setStats] = useState(getDashboardStats());

  useEffect(() => {
    seedDemoData();
    setStats(getDashboardStats());
  }, []);

  const fmt = (n: number) => `KES ${n.toLocaleString()}`;

  return (
    <>
      <PageHeader title="🏠 Rent Manager" />

      <div className="p-4 space-y-5 max-w-lg mx-auto -mt-3">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Building2 className="h-5 w-5 text-primary" />}
            label="Properties"
            value={stats.totalProperties}
          />
          <StatCard
            icon={<Users className="h-5 w-5 text-primary" />}
            label="Occupied / Vacant"
            value={`${stats.occupiedUnits} / ${stats.vacantUnits}`}
          />
          <StatCard
            icon={<BanknoteIcon className="h-5 w-5 text-paid" />}
            label="Collected"
            value={fmt(stats.totalRentCollected)}
            variant="success"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-warning" />}
            label="Net Profit"
            value={fmt(stats.profit)}
            variant={stats.profit >= 0 ? "success" : "danger"}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/tenants/add">
            <Button className="w-full h-14 text-sm font-semibold gap-2 gradient-primary text-primary-foreground rounded-2xl shadow-glow hover:shadow-lg transition-all" size="lg">
              <Plus className="h-5 w-5" /> Add Tenant
            </Button>
          </Link>
          <Link to="/payments/add">
            <Button className="w-full h-14 text-sm font-semibold gap-2 bg-paid text-paid-foreground rounded-2xl shadow-lg hover:shadow-xl transition-all hover:brightness-110" size="lg">
              <BanknoteIcon className="h-5 w-5" /> Record Payment
            </Button>
          </Link>
        </div>

        {/* Unpaid Tenants */}
        {stats.unpaidTenants.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-unpaid px-1">
              <AlertTriangle className="h-4 w-4" />
              <h2 className="font-bold text-xs uppercase tracking-wider">Unpaid Tenants ({stats.unpaidTenants.length})</h2>
            </div>
            {stats.unpaidTenants.map((tenant: Tenant, i: number) => (
              <div key={tenant.id} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <UnpaidTenantCard tenant={tenant} />
              </div>
            ))}
          </div>
        )}

        {stats.unpaidTenants.length === 0 && (
          <div className="rounded-2xl border border-paid/20 bg-gradient-to-br from-paid/5 to-paid/10 p-8 text-center animate-scale-in">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-paid font-bold text-lg">All tenants paid!</p>
            <p className="text-muted-foreground text-sm mt-1">Great job collecting rent this month.</p>
          </div>
        )}
      </div>
    </>
  );
}

function UnpaidTenantCard({ tenant }: { tenant: Tenant }) {
  return (
    <div className="rounded-2xl glass-card p-4 flex items-center gap-3 hover:shadow-card-hover transition-shadow">
      <div className="h-10 w-10 rounded-xl bg-unpaid/10 flex items-center justify-center flex-shrink-0">
        <span className="text-unpaid font-bold text-sm">{tenant.name.charAt(0)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{tenant.name}</p>
        <p className="text-sm text-muted-foreground">Unit {tenant.unitNumber} • KES {tenant.rentAmount.toLocaleString()}</p>
      </div>
      <div className="flex gap-1.5">
        <a href={`tel:${tenant.phone}`} className="h-9 w-9 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
          <Phone className="h-4 w-4" />
        </a>
        <a href={`sms:${tenant.phone}`} className="h-9 w-9 flex items-center justify-center rounded-xl bg-warning/10 text-warning hover:bg-warning/20 transition-colors">
          <MessageSquare className="h-4 w-4" />
        </a>
        <Link to={`/payments/add?tenantId=${tenant.id}`} className="h-9 w-9 flex items-center justify-center rounded-xl bg-paid/10 text-paid hover:bg-paid/20 transition-colors">
          <BanknoteIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
