import { User, Lender, Loan } from '../types';

export const initializeMockData = () => {
  // Mock Users
  const users: User[] = [
    {
      id: 'admin1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    },
    {
      id: 'lender1',
      name: 'John Lender',
      email: 'lender@example.com',
      role: 'lender',
    },
    {
      id: 'user1',
      name: 'Alice Cooper',
      email: 'user@example.com',
      role: 'user',
      loans: ['loan1'],
    },
  ];

  // Mock Lenders
  const lenders: Lender[] = [
    {
      id: 'lender1',
      name: 'John Lender',
      users: ['user1'],
      loans: ['loan1'],
    },
  ];

  // Mock Loans
  const loans: Loan[] = [
    {
      id: 'loan1',
      userId: 'user1',
      lenderId: 'lender1',
      amount: 10000,
      interestRate: 5,
      installments: 12,
      monthlyPayment: 879.16,
      status: 'active',
      createdAt: '2024-03-15',
    },
  ];

  // Initialize localStorage with mock data
  localStorage.setItem('lms_users', JSON.stringify(users));
  localStorage.setItem('lms_lenders', JSON.stringify(lenders));
  localStorage.setItem('lms_loans', JSON.stringify(loans));
};