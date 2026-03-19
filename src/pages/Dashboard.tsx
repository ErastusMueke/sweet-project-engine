import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Users, BanknoteIcon, AlertTriangle, Plus, Phone, MessageSquare, TrendingUp, TrendingDown } from "lucide-react";
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

      <div className="p-4 space-y-4 max-w-lg mx-auto">
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
            label="Collected This Month"
            value={fmt(stats.totalRentCollected)}
            variant="success"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-warning" />}
            label="Profit This Month"
            value={fmt(stats.profit)}
            variant={stats.profit >= 0 ? "success" : "danger"}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/tenants/add">
            <Button className="w-full h-14 text-base gap-2 bg-primary text-primary-foreground" size="lg">
              <Plus className="h-5 w-5" /> Add Tenant
            </Button>
          </Link>
          <Link to="/payments/add">
            <Button className="w-full h-14 text-base gap-2 bg-paid text-paid-foreground" size="lg">
              <BanknoteIcon className="h-5 w-5" /> Record Payment
            </Button>
          </Link>
        </div>

        {/* Unpaid Tenants */}
        {stats.unpaidTenants.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-unpaid">
              <AlertTriangle className="h-4 w-4" />
              <h2 className="font-bold text-sm">UNPAID TENANTS ({stats.unpaidTenants.length})</h2>
            </div>
            {stats.unpaidTenants.map((tenant: Tenant) => (
              <UnpaidTenantCard key={tenant.id} tenant={tenant} />
            ))}
          </div>
        )}

        {stats.unpaidTenants.length === 0 && (
          <div className="rounded-lg border border-paid/30 bg-paid/5 p-6 text-center">
            <p className="text-paid font-bold text-lg">✅ All tenants paid!</p>
            <p className="text-muted-foreground text-sm mt-1">Great job collecting rent this month.</p>
          </div>
        )}
      </div>
    </>
  );
}

function UnpaidTenantCard({ tenant }: { tenant: Tenant }) {
  return (
    <div className="rounded-lg border border-unpaid/20 bg-card p-3 flex items-center gap-3 animate-slide-up">
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{tenant.name}</p>
        <p className="text-sm text-muted-foreground">Unit {tenant.unitNumber} • KES {tenant.rentAmount.toLocaleString()}</p>
      </div>
      <div className="flex gap-1">
        <a href={`tel:${tenant.phone}`} className="touch-target flex items-center justify-center rounded-lg bg-primary/10 text-primary p-2">
          <Phone className="h-4 w-4" />
        </a>
        <a href={`sms:${tenant.phone}`} className="touch-target flex items-center justify-center rounded-lg bg-warning/10 text-warning p-2">
          <MessageSquare className="h-4 w-4" />
        </a>
        <Link to={`/payments/add?tenantId=${tenant.id}`} className="touch-target flex items-center justify-center rounded-lg bg-paid/10 text-paid p-2">
          <BanknoteIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
