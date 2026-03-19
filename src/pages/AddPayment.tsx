import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addPayment, getTenants } from "@/lib/store";
import { toast } from "sonner";

export default function AddPayment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tenants = getTenants();

  const [tenantId, setTenantId] = useState(searchParams.get("tenantId") || "");
  const [amount, setAmount] = useState(() => {
    const tid = searchParams.get("tenantId");
    if (tid) {
      const t = tenants.find(t => t.id === tid);
      return t ? t.rentAmount.toString() : "";
    }
    return "";
  });
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [forMonth, setForMonth] = useState(new Date().toISOString().slice(0, 7));

  const handleTenantChange = (id: string) => {
    setTenantId(id);
    const t = tenants.find(t => t.id === id);
    if (t) setAmount(t.rentAmount.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }
    const payment = addPayment({
      tenantId,
      amount: parseFloat(amount),
      paymentDate,
      forMonth,
    });
    toast.success("Payment recorded! ✅");
    navigate(`/receipt/${payment.id}`);
  };

  return (
    <>
      <PageHeader title="💰 Record Payment" back />
      <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-lg mx-auto">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Select Tenant *</Label>
          <Select value={tenantId} onValueChange={handleTenantChange}>
            <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Choose tenant" /></SelectTrigger>
            <SelectContent>
              {tenants.map(t => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name} — Unit {t.unitNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Amount (KES) *</Label>
          <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 8000" className="h-12 text-base" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Payment Date</Label>
          <Input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} className="h-12 text-base" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">For Month</Label>
          <Input type="month" value={forMonth} onChange={e => setForMonth(e.target.value)} className="h-12 text-base" />
        </div>
        <Button type="submit" className="w-full h-14 text-base bg-paid text-paid-foreground" size="lg">
          ✓ Confirm Payment
        </Button>
      </form>
    </>
  );
}
