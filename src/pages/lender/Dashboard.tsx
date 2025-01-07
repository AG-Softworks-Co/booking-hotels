import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../utils/localStorage';
import { useAuthStore } from '../../store/authStore';
import { Loan, User } from '../../types';
import { PlusCircle, Users, Wallet } from 'lucide-react';
import { StatsCard } from '../admin/components/StatsCard';
import { LoansList } from './components/LoansList';

export const LenderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeLoans: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    if (!user) return;

    const loans = storage.getLoans().filter(loan => loan.lenderId === user.id);
    const lender = storage.getLenders().find(l => l.id === user.id);

    setStats({
      totalUsers: lender?.users.length || 0,
      activeLoans: loans.filter(loan => loan.status === 'active').length,
      totalAmount: loans.reduce((acc, loan) => acc + loan.amount, 0),
    });
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Lender Dashboard</h1>
        <button
          onClick={() => navigate('/lender/create-loan')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New Loan
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6" />}
          trend="+12%"
        />
        <StatsCard
          title="Active Loans"
          value={stats.activeLoans}
          icon={<Wallet className="w-6 h-6" />}
          trend="+8%"
        />
        <StatsCard
          title="Total Amount"
          value={stats.totalAmount}
          icon={<Wallet className="w-6 h-6" />}
          trend="+15%"
        />
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Loans</h2>
          <LoansList />
        </section>
      </div>
    </div>
  );
};