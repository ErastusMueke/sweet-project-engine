import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { BanknoteIcon, TrendingDown, TrendingUp } from "lucide-react";
import { getPayments, getExpenses, getTenants } from "@/lib/store";

export default function Reports() {
  const [monthlyData, setMonthlyData] = useState<{ month: string; income: number; expenses: number }[]>([]);
  const [stats, setStats] = useState({ totalIncome: 0, totalExpenses: 0, outstanding: 0 });

  useEffect(() => {
    const payments = getPayments();
    const expenses = getExpenses();
    const tenants = getTenants();

    const months: Record<string, { income: number; expenses: number }> = {};
    payments.forEach(p => {
      const m = p.forMonth;
      if (!months[m]) months[m] = { income: 0, expenses: 0 };
      months[m].income += p.amount;
    });
    expenses.forEach(e => {
      const m = e.expenseDate.slice(0, 7);
      if (!months[m]) months[m] = { income: 0, expenses: 0 };
      months[m].expenses += e.amount;
    });

    const sorted = Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, data]) => ({ month: month.slice(5), ...data }));

    setMonthlyData(sorted);

    const totalIncome = payments.reduce((s, p) => s + p.amount, 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const outstanding = tenants
      .filter(t => t.paymentStatus === 'unpaid')
      .reduce((s, t) => s + t.rentAmount, 0);

    setStats({ totalIncome, totalExpenses, outstanding });
  }, []);

  const net = stats.totalIncome - stats.totalExpenses;

  return (
    <>
      <PageHeader title="📊 Reports" />
      <div className="p-4 space-y-4 max-w-lg mx-auto -mt-3">
        <div className="grid grid-cols-1 gap-3">
          <StatCard icon={<BanknoteIcon className="h-5 w-5 text-paid" />} label="Total Income" value={`KES ${stats.totalIncome.toLocaleString()}`} variant="success" />
          <StatCard icon={<TrendingDown className="h-5 w-5 text-unpaid" />} label="Total Expenses" value={`KES ${stats.totalExpenses.toLocaleString()}`} variant="danger" />
          <StatCard icon={<TrendingUp className="h-5 w-5 text-warning" />} label="Outstanding Rent" value={`KES ${stats.outstanding.toLocaleString()}`} variant="warning" />
        </div>

        {monthlyData.length > 0 && (
          <div className="rounded-2xl glass-card p-5">
            <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Monthly Overview</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} barGap={4}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} width={50} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: number) => `KES ${v.toLocaleString()}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="income" fill="hsl(152, 76%, 40%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" fill="hsl(0, 72%, 51%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-3 text-xs font-medium text-muted-foreground justify-center">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-paid" /> Income</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-unpaid" /> Expenses</span>
            </div>
          </div>
        )}

        <div className="rounded-2xl glass-card p-5">
          <h3 className="font-bold text-xs mb-1 uppercase tracking-wider text-muted-foreground">Net Profit</h3>
          <p className={`text-3xl font-extrabold ${net >= 0 ? 'text-paid' : 'text-unpaid'}`}>
            KES {net.toLocaleString()}
          </p>
        </div>
      </div>
    </>
  );
}
