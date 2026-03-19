import { useState, useEffect } from "react";
import { Plus, Trash2, TrendingDown } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getExpenses, addExpense, deleteExpense, getProperties, type Expense } from "@/lib/store";
import { toast } from "sonner";

const categories = [
  { value: "repair", label: "🔧 Repair" },
  { value: "utilities", label: "💡 Utilities" },
  { value: "cleaning", label: "🧹 Cleaning" },
  { value: "security", label: "🔒 Security" },
  { value: "other", label: "📦 Other" },
];

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const properties = getProperties();

  // Form state
  const [propertyId, setPropertyId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    setExpenses(getExpenses().sort((a, b) => b.expenseDate.localeCompare(a.expenseDate)));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId || !description || !amount || !category) {
      toast.error("Please fill in all fields");
      return;
    }
    addExpense({ propertyId, description, amount: parseFloat(amount), expenseDate, category });
    toast.success("Expense recorded!");
    setExpenses(getExpenses().sort((a, b) => b.expenseDate.localeCompare(a.expenseDate)));
    setShowForm(false);
    setDescription("");
    setAmount("");
    setCategory("");
  };

  const handleDelete = (id: string) => {
    deleteExpense(id);
    setExpenses(getExpenses().sort((a, b) => b.expenseDate.localeCompare(a.expenseDate)));
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <>
      <PageHeader
        title="📉 Expenses"
        action={
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1 bg-primary text-primary-foreground">
            <Plus className="h-4 w-4" /> Add
          </Button>
        }
      />
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Total */}
        <div className="rounded-lg border border-unpaid/20 bg-unpaid/5 p-3 flex items-center gap-3">
          <TrendingDown className="h-5 w-5 text-unpaid" />
          <div>
            <p className="text-xs text-muted-foreground font-medium">Total Expenses</p>
            <p className="text-lg font-bold text-unpaid">KES {total.toLocaleString()}</p>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-4 space-y-3 animate-slide-up">
            <Select value={propertyId} onValueChange={setPropertyId}>
              <SelectTrigger className="h-11"><SelectValue placeholder="Select property" /></SelectTrigger>
              <SelectContent>{properties.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="h-11" />
            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount (KES)" className="h-11" />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-11"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>{categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="date" value={expenseDate} onChange={e => setExpenseDate(e.target.value)} className="h-11" />
            <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground">✓ Save Expense</Button>
          </form>
        )}

        {/* List */}
        {expenses.map(e => {
          const cat = categories.find(c => c.value === e.category);
          return (
            <div key={e.id} className="rounded-lg border border-border bg-card p-3 flex items-center gap-3">
              <span className="text-lg">{cat?.label.split(' ')[0] || '📦'}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{e.description}</p>
                <p className="text-xs text-muted-foreground">{e.expenseDate}</p>
              </div>
              <p className="font-bold text-unpaid">-KES {e.amount.toLocaleString()}</p>
              <button onClick={() => handleDelete(e.id)} className="p-2 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
