import { User, Lender, Loan, Payment } from '../types';

const STORAGE_KEYS = {
  USERS: 'lms_users',
  LENDERS: 'lms_lenders',
  LOANS: 'lms_loans',
  PAYMENTS: 'lms_payments',
};

export const storage = {
  // Users
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },
  setUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
  
  // Lenders
  getLenders: (): Lender[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LENDERS) || '[]');
  },
  setLenders: (lenders: Lender[]) => {
    localStorage.setItem(STORAGE_KEYS.LENDERS, JSON.stringify(lenders));
  },
  
  // Loans
  getLoans: (): Loan[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOANS) || '[]');
  },
  setLoans: (loans: Loan[]) => {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  },
  
  // Payments
  getPayments: (): Payment[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');
  },
  setPayments: (payments: Payment[]) => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  },
};