export type Role = 'admin' | 'lender' | 'user';
export type PaymentFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
export type LoanStatus = 'active' | 'paid' | 'overdue';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Hashed password
  role: Role;
  loans?: string[];
  resetToken?: string;
  resetTokenExpiry?: number;
}

export interface Lender {
  id: string;
  name: string;
  users: string[];
  loans: string[];
}

export interface LoanPaymentSchedule {
  dueDate: string;
  amount: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  status: 'pending' | 'paid' | 'overdue';
}

export interface Loan {
  id: string;
  userId: string;
  lenderId: string;
  amount: number;
  interestRate: number;
  frequency: PaymentFrequency;
  installments: number;
  paymentAmount: number;
  totalInterest: number;
  totalAmount: number;
  paymentSchedule: LoanPaymentSchedule[];
  status: LoanStatus;
  createdAt: string;
  nextPaymentDate: string;
}

export interface Payment {
  id: string;
  loanId: string;
  userId: string;
  scheduledPaymentIndex: number;
  amount: number;
  paymentDate: string;
  lateFee?: number;
}