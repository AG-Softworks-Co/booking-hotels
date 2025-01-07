import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { storage } from '../../utils/localStorage';
import { Loan, Payment, Lender } from '../../types';

export const MakePayment: React.FC = () => {
  const navigate = useNavigate();
  const { loanId } = useParams();
  const user = useAuthStore((state) => state.user);
  const [loan, setLoan] = useState<Loan | null>(null);
  const [lender, setLender] = useState<Lender | null>(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loanId || !user) return;

    const loanData = storage.getLoans().find(l => l.id === loanId && l.userId === user.id);
    if (!loanData) {
      navigate('/user');
      return;
    }

    const lenderData = storage.getLenders().find(l => l.id === loanData.lenderId);
    
    setLoan(loanData);
    setLender(lenderData || null);
    setAmount(loanData.monthlyPayment.toString());
  }, [loanId, user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loan || !user) return;

    try {
      const paymentAmount = parseFloat(amount);
      
      if (paymentAmount <= 0) {
        setError('Payment amount must be greater than 0');
        return;
      }

      if (paymentAmount > loan.amount) {
        setError('Payment amount cannot exceed loan amount');
        return;
      }

      // Create payment record
      const payments = storage.getPayments();
      const newPayment: Payment = {
        id: `payment${Date.now()}`,
        loanId: loan.id,
        userId: user.id,
        amount: paymentAmount,
        paymentDate: new Date().toISOString(),
      };
      payments.push(newPayment);
      storage.setPayments(payments);

      // Update loan status if fully paid
      const totalPaid = payments
        .filter(p => p.loanId === loan.id)
        .reduce((acc, p) => acc + p.amount, 0) + paymentAmount;

      if (totalPaid >= loan.amount) {
        const loans = storage.getLoans();
        const updatedLoan = loans.find(l => l.id === loan.id);
        if (updatedLoan) {
          updatedLoan.status = 'paid';
          storage.setLoans(loans);
        }
      }

      navigate('/user');
    } catch (err) {
      setError('Failed to process payment. Please try again.');
    }
  };

  if (!loan || !lender) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Make Payment</h1>
      
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Loan Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Lender</p>
            <p className="text-lg font-medium">{lender.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-lg font-medium">${loan.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Monthly Payment</p>
            <p className="text-lg font-medium">${loan.monthlyPayment.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-lg font-medium capitalize">{loan.status}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Payment Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              required
              min="1"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/user')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Make Payment
          </button>
        </div>
      </form>
    </div>
  );
};