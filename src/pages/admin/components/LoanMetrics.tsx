import React from 'react';
import { useEffect, useState } from 'react';
import { storage } from '../../../utils/localStorage';
import { Loan } from '../../../types';

export const LoanMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalAmount: 0,
    averageInterestRate: 0,
    activeLoans: 0,
    paidLoans: 0,
  });

  useEffect(() => {
    const loans = storage.getLoans();
    const activeLoans = loans.filter(loan => loan.status === 'active');
    const paidLoans = loans.filter(loan => loan.status === 'paid');
    
    const totalAmount = loans.reduce((acc, loan) => acc + loan.amount, 0);
    const averageInterestRate = loans.reduce((acc, loan) => acc + loan.interestRate, 0) / loans.length || 0;

    setMetrics({
      totalAmount,
      averageInterestRate,
      activeLoans: activeLoans.length,
      paidLoans: paidLoans.length,
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Loan Amount</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">
          ${metrics.totalAmount.toLocaleString()}
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Average Interest Rate</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">
          {metrics.averageInterestRate.toFixed(2)}%
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Active Loans</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">
          {metrics.activeLoans}
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Paid Loans</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">
          {metrics.paidLoans}
        </p>
      </div>
    </div>
  );
};