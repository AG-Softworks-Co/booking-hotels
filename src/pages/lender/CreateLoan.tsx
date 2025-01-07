import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { storage } from '../../utils/localStorage';
import { calculateLoanDetails } from '../../utils/loanCalculator';
import { User, Loan, PaymentFrequency } from '../../types';
import { generatePassword } from '../../utils/auth';

interface LoanFormData {
  userName: string;
  userEmail: string;
  userPassword: string;
  amount: string;
  interestRate: string;
  termMonths: string;
  frequency: PaymentFrequency;
}

export const CreateLoan: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState<LoanFormData>({
    userName: '',
    userEmail: '',
    userPassword: generatePassword(),
    amount: '',
    interestRate: '',
    termMonths: '',
    frequency: 'monthly'
  });
  const [previewData, setPreviewData] = useState<any>(null);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleCalculatePreview = () => {
    try {
      const amount = parseFloat(formData.amount);
      const interestRate = parseFloat(formData.interestRate);
      const termMonths = parseInt(formData.termMonths);

      if (amount <= 0 || interestRate <= 0 || termMonths <= 0) {
        setError('Please enter valid positive numbers');
        return;
      }

      const loanDetails = calculateLoanDetails(
        amount,
        interestRate,
        termMonths,
        formData.frequency,
        new Date()
      );

      setPreviewData(loanDetails);
      setError('');
    } catch (err) {
      setError('Please check your input values');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user || !previewData) return;

    try {
      const amount = parseFloat(formData.amount);
      const interestRate = parseFloat(formData.interestRate);
      const termMonths = parseInt(formData.termMonths);

      // Create or get user with provided password
      const users = storage.getUsers();
      let targetUser = users.find(u => u.email === formData.userEmail);
      
      if (!targetUser) {
        targetUser = {
          id: `user${Date.now()}`,
          name: formData.userName,
          email: formData.userEmail,
          password: formData.userPassword,
          role: 'user',
          loans: [],
        };
        users.push(targetUser);
        storage.setUsers(users);
      }

      // Create loan with payment schedule
      const loans = storage.getLoans();
      const newLoan: Loan = {
        id: `loan${Date.now()}`,
        userId: targetUser.id,
        lenderId: user.id,
        amount,
        interestRate,
        frequency: formData.frequency,
        installments: previewData.totalPeriods,
        paymentAmount: previewData.paymentAmount,
        totalInterest: previewData.totalInterest,
        totalAmount: previewData.totalAmount,
        paymentSchedule: previewData.schedule,
        status: 'active',
        createdAt: new Date().toISOString(),
        nextPaymentDate: previewData.schedule[0].dueDate
      };
      loans.push(newLoan);
      storage.setLoans(loans);

      // Update lender
      const lenders = storage.getLenders();
      const lender = lenders.find(l => l.id === user.id);
      if (lender) {
        if (!lender.users.includes(targetUser.id)) {
          lender.users.push(targetUser.id);
        }
        lender.loans.push(newLoan.id);
        storage.setLenders(lenders);
      }

      // Show success message with user credentials
      alert(`Loan created successfully!\n\nUser credentials:\nEmail: ${formData.userEmail}\nPassword: ${formData.userPassword}\n\nPlease save these credentials!`);
      navigate('/lender');
    } catch (err) {
      setError('Failed to create loan. Please check your inputs.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Loan</h1>
      
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">User Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="userName"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.userName}
                    onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="userEmail"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.userEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, userEmail: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700">
                    Temporary Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="userPassword"
                      required
                      className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      value={formData.userPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, userPassword: e.target.value }))}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Loan Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Loan Amount ($)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    required
                    min="1"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
                    Annual Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    id="interestRate"
                    required
                    min="0"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.interestRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="termMonths" className="block text-sm font-medium text-gray-700">
                    Term (months)
                  </label>
                  <input
                    type="number"
                    id="termMonths"
                    required
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.termMonths}
                    onChange={(e) => setFormData(prev => ({ ...prev, termMonths: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                    Payment Frequency
                  </label>
                  <select
                    id="frequency"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.frequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as PaymentFrequency }))}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleCalculatePreview}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Calculate Preview
            </button>
          </div>

          {previewData && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Payment Amount</p>
                  <p className="text-lg font-semibold">${previewData.paymentAmount.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Interest</p>
                  <p className="text-lg font-semibold">${previewData.totalInterest.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-lg font-semibold">${previewData.totalAmount.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Effective Annual Rate</p>
                  <p className="text-lg font-semibold">{previewData.effectiveRate.toFixed(2)}%</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Complete Payment Schedule</h4>
                <div className="max-h-96 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment #</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Principal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previewData.schedule.map((payment: any, index: number) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(payment.dueDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${payment.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${payment.principal.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${payment.interest.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${payment.remainingBalance.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/lender')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!previewData}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Create Loan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};