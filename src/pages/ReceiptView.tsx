import { useParams } from "react-router-dom";
import { Share2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { getPayments, getTenants, getProperties } from "@/lib/store";

export default function ReceiptView() {
  const { id } = useParams<{ id: string }>();
  const payment = getPayments().find(p => p.id === id);
  const tenant = payment ? getTenants().find(t => t.id === payment.tenantId) : null;
  const property = tenant ? getProperties().find(p => p.id === tenant.propertyId) : null;

  if (!payment || !tenant) {
    return <div className="p-8 text-center text-muted-foreground">Receipt not found</div>;
  }

  const receiptText = `RENT RECEIPT\n${payment.receiptNumber}\n\nTenant: ${tenant.name}\nUnit: ${tenant.unitNumber}${property ? ` - ${property.name}` : ''}\nAmount: KES ${payment.amount.toLocaleString()}\nDate: ${payment.paymentDate}\nFor: ${payment.forMonth}\n\nThank you!`;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: "Rent Receipt", text: receiptText });
    } else {
      navigator.clipboard.writeText(receiptText);
      alert("Receipt copied to clipboard!");
    }
  };

  return (
    <>
      <PageHeader
        title="📄 Receipt"
        back
        action={
          <Button size="sm" variant="ghost" onClick={handleShare} className="text-nav-foreground gap-1">
            <Share2 className="h-4 w-4" /> Share
          </Button>
        }
      />
      <div className="p-4 max-w-lg mx-auto">
        <div className="rounded-xl border-2 border-paid/30 bg-card p-6 space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold">RENT RECEIPT</h2>
            <div className="inline-block rounded-full bg-paid/10 text-paid font-bold text-sm px-4 py-1">
              ✓ PAID
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-3 text-sm">
            <Row label="Receipt #" value={payment.receiptNumber} />
            <Row label="Date" value={payment.paymentDate} />
            <Row label="Tenant" value={tenant.name} />
            <Row label="Unit" value={`${tenant.unitNumber}${property ? ` — ${property.name}` : ''}`} />
            <Row label="Amount" value={`KES ${payment.amount.toLocaleString()}`} highlight />
            <Row label="For Month" value={payment.forMonth} />
          </div>

          <div className="border-t border-border pt-4 grid grid-cols-2 gap-2">
            <Button onClick={handleShare} className="h-12 bg-paid text-paid-foreground gap-2">
              📱 WhatsApp
            </Button>
            <Button onClick={handleShare} variant="outline" className="h-12 gap-2">
              💬 SMS
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "font-bold text-lg text-paid" : "font-medium"}>{value}</span>
    </div>
  );
}
