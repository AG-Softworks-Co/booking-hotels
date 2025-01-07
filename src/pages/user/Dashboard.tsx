import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../utils/localStorage';
import { useAuthStore } from '../../store/authStore';
import { Loan, Payment, Lender } from '../../types';
import { Wallet, CreditCard, Calendar } from 'lucide-react';
import { StatsCard } from '../admin/components/StatsCard';
import { LoanCard } from './components/LoanCard';
import { PaymentHistory } from './components/PaymentHistory';

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [lenders, setLenders] = useState<Record<string, Lender>>({});
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    totalPaid: 0,
  });

  useEffect(() => {
    if (!user) return;

    const loansData = storage.getLoans().filter(loan => loan.userId === user.id);
    const lendersData = storage.getLenders();
    const paymentsData = storage.getPayments().filter(payment => 
      loansData.some(loan => loan.id === payment.loanId)
    );

    setLoans(loansData);
    setLenders(Object.fromEntries(lendersData.map(lender => [lender.id, lender])));
    setStats({
      totalLoans: loansData.length,
      activeLoans: loansData.filter(loan => loan.status === 'active').length,
      totalPaid: paymentsData.reduce((acc, payment) => acc + payment.amount, 0),
    });
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Loans"
          value={stats.totalLoans}
          icon={<Wallet className="w-6 h-6" />}
          trend=""
        />
        <StatsCard
          title="Active Loans"
          value={stats.activeLoans}
          icon={<CreditCard className="w-6 h-6" />}
          trend=""
        />
        <StatsCard
          title="Total Paid"
          value={stats.totalPaid}
          icon={<Calendar className="w-6 h-6" />}
          trend=""
        />
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Loans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loans
              .filter(loan => loan.status === 'active')
              .map(loan => (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  lender={lenders[loan.lenderId]}
                  onMakePayment={() => navigate(`/user/payment/${loan.id}`)}
                />
              ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h2>
          <PaymentHistory loans={loans} />
        </section>
      </div>
    </div>
  );
};