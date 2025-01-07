import React from 'react';
import { Loan, Lender } from '../../../types';
import { CreditCard, DollarSign, Calendar } from 'lucide-react';

interface LoanCardProps {
  loan: Loan;
  lender: Lender;
  onMakePayment: () => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan, lender, onMakePayment }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Loan Details</h3>
            <p className="text-sm text-gray-500">From {lender.name}</p>
          </div>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-lg font-semibold">${loan.amount.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Monthly Payment</p>
              <p className="text-lg font-semibold">${loan.monthlyPayment.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Interest Rate</p>
              <p className="text-lg font-semibold">{loan.interestRate}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Installments</p>
              <p className="text-lg font-semibold">{loan.installments}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onMakePayment}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Make Payment
        </button>
      </div>
    </div>
  );
};