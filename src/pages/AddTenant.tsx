import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addTenant, getProperties } from "@/lib/store";
import { toast } from "sonner";

export default function AddTenant() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const properties = getProperties();

  const [propertyId, setPropertyId] = useState(searchParams.get("propertyId") || "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [rentAmount, setRentAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId || !name || !unitNumber || !rentAmount) {
      toast.error("Please fill in all required fields");
      return;
    }
    addTenant({
      propertyId,
      name,
      phone,
      unitNumber,
      rentAmount: parseFloat(rentAmount),
      moveInDate: new Date().toISOString().slice(0, 10),
    });
    toast.success("Tenant added!");
    navigate(-1);
  };

  return (
    <>
      <PageHeader title="➕ Add Tenant" back />
      <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-lg mx-auto">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Property *</Label>
          <Select value={propertyId} onValueChange={setPropertyId}>
            <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select property" /></SelectTrigger>
            <SelectContent>
              {properties.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Tenant Name *</Label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Mwangi" className="h-12 text-base" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Phone Number</Label>
          <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. +254712345678" className="h-12 text-base" type="tel" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Unit Number *</Label>
          <Input value={unitNumber} onChange={e => setUnitNumber(e.target.value)} placeholder="e.g. 3" className="h-12 text-base" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Monthly Rent (KES) *</Label>
          <Input type="number" value={rentAmount} onChange={e => setRentAmount(e.target.value)} placeholder="e.g. 8000" className="h-12 text-base" />
        </div>
        <Button type="submit" className="w-full h-14 text-base bg-primary text-primary-foreground" size="lg">
          ✓ Save Tenant
        </Button>
      </form>
    </>
  );
}
