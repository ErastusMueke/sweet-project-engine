import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addProperty } from "@/lib/store";
import { toast } from "sonner";

export default function AddProperty() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [totalUnits, setTotalUnits] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !totalUnits) {
      toast.error("Please fill in the required fields");
      return;
    }
    addProperty({ name, address, totalUnits: parseInt(totalUnits) });
    toast.success("Property added!");
    navigate("/properties");
  };

  return (
    <>
      <PageHeader title="➕ Add Property" back />
      <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-lg mx-auto">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Property Name *</Label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sunview Apartments" className="h-12 text-base" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Address</Label>
          <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. Moi Avenue, Nairobi" className="h-12 text-base" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Total Units *</Label>
          <Input type="number" value={totalUnits} onChange={e => setTotalUnits(e.target.value)} placeholder="e.g. 8" className="h-12 text-base" />
        </div>
        <Button type="submit" className="w-full h-14 text-base bg-primary text-primary-foreground" size="lg">
          ✓ Save Property
        </Button>
      </form>
    </>
  );
}
