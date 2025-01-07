import React from 'react';
import { useEffect, useState } from 'react';
import { storage } from '../../../utils/localStorage';
import { User, Loan } from '../../../types';

export const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    const fetchData = () => {
      const usersData = storage.getUsers().filter(user => user.role === 'user');
      const loansData = storage.getLoans();
      setUsers(usersData);
      setLoans(loansData);
    };

    fetchData();
  }, []);

  const getUserStats = (userId: string) => {
    const userLoans = loans.filter(loan => loan.userId === userId);
    return {
      totalLoans: userLoans.length,
      activeLoans: userLoans.filter(loan => loan.status === 'active').length,
      totalAmount: userLoans.reduce((acc, loan) => acc + loan.amount, 0),
    };
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Active Loans
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => {
            const stats = getUserStats(user.id);
            return (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{stats.activeLoans}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${stats.totalAmount.toLocaleString()}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};