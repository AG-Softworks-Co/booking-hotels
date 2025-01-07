import React from 'react';
import { useEffect, useState } from 'react';
import { storage } from '../../utils/localStorage';
import { User, Lender, Loan } from '../../types';
import {  Users, Wallet } from 'lucide-react';
import { StatsCard } from './components/StatsCard';
import { LendersTable } from './components/LendersTable';
import { UsersTable } from './components/UsersTable';
import { LoansTable } from './components/LoansTable';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalLenders: 0,
    totalUsers: 0,
    totalLoans: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    const lenders = storage.getLenders();
    const users = storage.getUsers();
    const loans = storage.getLoans();

    setStats({
      totalLenders: lenders.length,
      totalUsers: users.filter(user => user.role === 'user').length,
      totalLoans: loans.length,
      totalAmount: loans.reduce((acc, loan) => acc + loan.amount, 0),
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Lenders"
          value={stats.totalLenders}
          icon={<Users className="w-6 h-6" />}
          trend="+5%"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="w-6 h-6" />}
          trend="+12%"
        />
        <StatsCard
          title="Total Loans"
          value={stats.totalLoans}
          icon={<Wallet className="w-6 h-6" />}
          trend="+8%"
        />
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lenders Overview</h2>
          <LendersTable />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Users Overview</h2>
          <UsersTable />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Loans Overview</h2>
          <LoansTable />
        </section>
      </div>
    </div>
  );
};