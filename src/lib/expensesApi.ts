export type ExpenseCategory =
  | 'advance'
  | 'fuel'
  | 'challan'
  | 'food'
  | 'salary'
  | 'enroute';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  vehicle?: string;
  tripId?: string;
  paymentMethod: string;
  receipt?: string;
}

// In-memory storage for mock API
let expensesStore: Expense[] = [
  {
    id: 'e1',
    category: 'fuel',
    description: 'Diesel Refill - Route Delhi to Mumbai',
    amount: 15000,
    date: '2024-10-28',
    status: 'paid',
    vehicle: 'DL-12-AB-3456',
    paymentMethod: 'Corporate Card',
    receipt: 'RCP-2024-001',
  },
  {
    id: 'e2',
    category: 'advance',
    description: 'Driver Advance - October 2024',
    amount: 8500,
    date: '2024-10-27',
    status: 'paid',
    vehicle: 'MH-14-CD-7890',
    paymentMethod: 'Bank Transfer',
    receipt: 'RCP-2024-002',
  },
  {
    id: 'e3',
    category: 'salary',
    description: 'Driver Salary - October 2024',
    amount: 45000,
    date: '2024-10-25',
    status: 'paid',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'e4',
    category: 'challan',
    description: 'Traffic Violation Fine',
    amount: 2000,
    date: '2024-10-30',
    status: 'pending',
    vehicle: 'KA-03-EF-1234',
    paymentMethod: 'Net Banking',
  },
  {
    id: 'e5',
    category: 'food',
    description: 'Driver Meal Allowance',
    amount: 1500,
    date: '2024-10-29',
    status: 'paid',
    vehicle: 'UP-16-GH-5678',
    paymentMethod: 'Cash',
    receipt: 'RCP-2024-003',
  },
  {
    id: 'e6',
    category: 'enroute',
    description: 'Toll Charges - National Highway',
    amount: 2800,
    date: '2024-10-20',
    status: 'overdue',
    vehicle: 'GJ-01-IJ-9012',
    paymentMethod: 'FASTag',
  },
];

// Category configuration for UI
export const categoryConfig = {
  advance: {
    color: '#f973a7',
    label: 'Advance',
  },
  fuel: {
    color: '#fb7185',
    label: 'Fuel',
  },
  challan: {
    color: '#60a5fa',
    label: 'Challan',
  },
  food: {
    color: '#34d399',
    label: 'Food',
  },
  salary: {
    color: '#fbbf24',
    label: 'Salary',
  },
  enroute: {
    color: '#a78bfa',
    label: 'Enroute',
  },
};

// Mock API functions with simulated delays
export const getExpenses = async (): Promise<Expense[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [...expensesStore];
};

export const addExpense = async (
  expense: Omit<Expense, 'id'>
): Promise<Expense> => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const newExpense: Expense = {
    ...expense,
    id: `e${Date.now()}`,
  };
  expensesStore.push(newExpense);
  return newExpense;
};

export const deleteExpense = async (id: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const initialLength = expensesStore.length;
  expensesStore = expensesStore.filter((expense) => expense.id !== id);
  return expensesStore.length < initialLength;
};

export const updateExpense = async (
  id: string,
  updates: Partial<Expense>
): Promise<Expense | null> => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const expenseIndex = expensesStore.findIndex((expense) => expense.id === id);
  if (expenseIndex === -1) return null;
  expensesStore[expenseIndex] = { ...expensesStore[expenseIndex], ...updates };
  return expensesStore[expenseIndex];
};
