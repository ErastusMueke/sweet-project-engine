// Local-first data store using localStorage

export interface Property {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  createdAt: string;
}

export interface Tenant {
  id: string;
  propertyId: string;
  name: string;
  phone: string;
  unitNumber: string;
  rentAmount: number;
  moveInDate: string;
  paymentStatus: 'paid' | 'unpaid';
}

export interface Payment {
  id: string;
  tenantId: string;
  amount: number;
  paymentDate: string;
  forMonth: string;
  receiptNumber: string;
}

export interface Expense {
  id: string;
  propertyId: string;
  description: string;
  amount: number;
  expenseDate: string;
  category: string;
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}

function getStore<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setStore<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Properties
export function getProperties(): Property[] {
  return getStore<Property>('rent_properties');
}

export function addProperty(p: Omit<Property, 'id' | 'createdAt'>): Property {
  const property: Property = { ...p, id: generateId('PROP'), createdAt: new Date().toISOString() };
  const all = getProperties();
  all.push(property);
  setStore('rent_properties', all);
  return property;
}

export function updateProperty(id: string, updates: Partial<Property>): void {
  const all = getProperties().map(p => p.id === id ? { ...p, ...updates } : p);
  setStore('rent_properties', all);
}

export function deleteProperty(id: string): void {
  setStore('rent_properties', getProperties().filter(p => p.id !== id));
  // Also delete related tenants, payments, expenses
  const tenants = getTenants().filter(t => t.propertyId === id);
  tenants.forEach(t => deleteTenant(t.id));
  setStore('rent_expenses', getExpenses().filter(e => e.propertyId !== id));
}

// Tenants
export function getTenants(): Tenant[] {
  return getStore<Tenant>('rent_tenants');
}

export function getTenantsByProperty(propertyId: string): Tenant[] {
  return getTenants().filter(t => t.propertyId === propertyId);
}

export function addTenant(t: Omit<Tenant, 'id' | 'paymentStatus'>): Tenant {
  const tenant: Tenant = { ...t, id: generateId('TEN'), paymentStatus: 'unpaid' };
  const all = getTenants();
  all.push(tenant);
  setStore('rent_tenants', all);
  return tenant;
}

export function updateTenant(id: string, updates: Partial<Tenant>): void {
  const all = getTenants().map(t => t.id === id ? { ...t, ...updates } : t);
  setStore('rent_tenants', all);
}

export function deleteTenant(id: string): void {
  setStore('rent_tenants', getTenants().filter(t => t.id !== id));
  setStore('rent_payments', getPayments().filter(p => p.tenantId !== id));
}

// Payments
export function getPayments(): Payment[] {
  return getStore<Payment>('rent_payments');
}

export function getPaymentsByTenant(tenantId: string): Payment[] {
  return getPayments().filter(p => p.tenantId === tenantId);
}

export function addPayment(p: Omit<Payment, 'id' | 'receiptNumber'>): Payment {
  const receiptNum = `R-${Date.now().toString().slice(-6)}`;
  const payment: Payment = { ...p, id: generateId('PAY'), receiptNumber: receiptNum };
  const all = getPayments();
  all.push(payment);
  setStore('rent_payments', all);
  // Update tenant status
  updateTenant(p.tenantId, { paymentStatus: 'paid' });
  return payment;
}

// Expenses
export function getExpenses(): Expense[] {
  return getStore<Expense>('rent_expenses');
}

export function addExpense(e: Omit<Expense, 'id'>): Expense {
  const expense: Expense = { ...e, id: generateId('EXP') };
  const all = getExpenses();
  all.push(expense);
  setStore('rent_expenses', all);
  return expense;
}

export function deleteExpense(id: string): void {
  setStore('rent_expenses', getExpenses().filter(e => e.id !== id));
}

// Dashboard stats
export function getDashboardStats() {
  const properties = getProperties();
  const tenants = getTenants();
  const payments = getPayments();
  const expenses = getExpenses();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthPayments = payments.filter(p => p.forMonth === currentMonth);
  const monthExpenses = expenses.filter(e => e.expenseDate.startsWith(currentMonth));

  const totalRentCollected = monthPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const occupiedUnits = tenants.length;
  const totalUnits = properties.reduce((sum, p) => sum + p.totalUnits, 0);
  const vacantUnits = totalUnits - occupiedUnits;
  const unpaidTenants = tenants.filter(t => t.paymentStatus === 'unpaid');

  return {
    totalProperties: properties.length,
    totalUnits,
    occupiedUnits,
    vacantUnits,
    totalRentCollected,
    totalExpenses,
    profit: totalRentCollected - totalExpenses,
    unpaidTenants,
    currentMonth,
  };
}

// Seed demo data
export function seedDemoData(): void {
  if (getProperties().length > 0) return;

  const prop1 = addProperty({ name: 'Sunview Apartments', address: 'Moi Avenue, Nairobi', totalUnits: 8 });
  const prop2 = addProperty({ name: 'Green Valley Flats', address: 'Kenyatta Road, Thika', totalUnits: 6 });

  const t1 = addTenant({ propertyId: prop1.id, name: 'John Mwangi', phone: '+254712345678', unitNumber: '3', rentAmount: 8000, moveInDate: '2024-01-15' });
  const t2 = addTenant({ propertyId: prop1.id, name: 'Anna Odhiambo', phone: '+254723456789', unitNumber: '7', rentAmount: 6500, moveInDate: '2024-03-01' });
  const t3 = addTenant({ propertyId: prop2.id, name: 'Peter Kamau', phone: '+254734567890', unitNumber: '2', rentAmount: 7000, moveInDate: '2024-02-10' });
  const t4 = addTenant({ propertyId: prop1.id, name: 'Mary Wanjiku', phone: '+254745678901', unitNumber: '1', rentAmount: 9000, moveInDate: '2023-11-01' });

  const currentMonth = new Date().toISOString().slice(0, 7);
  addPayment({ tenantId: t1.id, amount: 8000, paymentDate: new Date().toISOString().slice(0, 10), forMonth: currentMonth });
  addPayment({ tenantId: t4.id, amount: 9000, paymentDate: new Date().toISOString().slice(0, 10), forMonth: currentMonth });

  addExpense({ propertyId: prop1.id, description: 'Plumbing repair', amount: 3500, expenseDate: `${currentMonth}-05`, category: 'repair' });
  addExpense({ propertyId: prop2.id, description: 'Water bill', amount: 2000, expenseDate: `${currentMonth}-10`, category: 'utilities' });
}
