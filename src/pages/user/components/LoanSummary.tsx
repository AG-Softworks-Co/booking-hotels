import React from 'react';
import { useEffect, useState } from 'react';
import { storage } from '../../../utils/localStorage';
import { Loan, Payment } from '../../../types';

interface LoanSummaryProps {
  loan: Loan;
}

export const LoanSummary: React.FC<LoanSummaryProps> = ({ loan }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [progress, setProgress] = useState({
    totalPaid: 0,
    remainingAmount: 0,
    completionPercentage: 0,
  });

  useEffect(() => {
    const paymentsData = storage.getPayments().filter(p => p.loanId === loan.id);
    const totalPaid = paymentsData.reduce((acc, payment) => acc + payment.amount, 0);
    const remainingAmount = loan.amount - totalPaid;
    const completionPercentage = (totalPaid / loan.amount) * 100;

    setPayments(paymentsData);
    setProgress({
      totalPaid,
      remainingAmount,
      completionPercentage,
    });
  }, [loan]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Progress</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-500">Progress</span>
            <span className="text-gray-900">{progress.completionPercentage.toFixed(1)}%</span>
          </div>
          <div className="mt-2 relative">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${progress.completionPercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Paid</p>
            <p className="text-lg font-semibold text-gray-900">
              ${progress.totalPaid.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Remaining Amount</p>
            <p className="text-lg font-semibold text-gray-900">
              ${progress.remainingAmount.toLocaleString()}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500">Recent Payments</p>
          <ul className="mt-2 divide-y divide-gray-200">
            {payments.slice(-3).map(payment => (
              <li key={payment.id} className="py-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-900">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    ${payment.amount.toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};