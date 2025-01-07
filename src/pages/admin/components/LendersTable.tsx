import React from 'react';
import { useEffect, useState } from 'react';
import { storage } from '../../../utils/localStorage';
import { Lender, User, Loan } from '../../../types';

export const LendersTable: React.FC = () => {
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loans, setLoans] = useState<Loan[]>([]);
  const [expandedLender, setExpandedLender] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = () => {
      const lendersData = storage.getLenders();
      const usersData = storage.getUsers();
      const loansData = storage.getLoans();
      
      setLenders(lendersData);
      setUsers(Object.fromEntries(usersData.map(user => [user.id, user])));
      setLoans(loansData);
    };

    fetchData();
  }, []);

  const getLenderStats = (lenderId: string) => {
    const lenderLoans = loans.filter(loan => loan.lenderId === lenderId);
    return {
      totalLoans: lenderLoans.length,
      totalAmount: lenderLoans.reduce((acc, loan) => acc + loan.amount, 0),
      activeLoans: lenderLoans.filter(loan => loan.status === 'active').length,
    };
  };

  const getLenderUsers = (lenderId: string) => {
    const lender = lenders.find(l => l.id === lenderId);
    if (!lender) return [];
    
    return lender.users.map(userId => users[userId]).filter(Boolean);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lender Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Users
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Active Loans
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lenders.map(lender => {
            const stats = getLenderStats(lender.id);
            const isExpanded = expandedLender === lender.id;
            
            return (
              <React.Fragment key={lender.id}>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{users[lender.id]?.name}</div>
                    <div className="text-sm text-gray-500">{users[lender.id]?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lender.users.length}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{stats.activeLoans}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${stats.totalAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setExpandedLender(isExpanded ? null : lender.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {isExpanded ? 'Hide Users' : 'Show Users'}
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 bg-gray-50">
                      <div className="text-sm text-gray-900 font-medium mb-2">Users List:</div>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Email</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Active Loans</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Total Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getLenderUsers(lender.id).map(user => {
                            const userLoans = loans.filter(loan => loan.userId === user.id);
                            const activeLoans = userLoans.filter(loan => loan.status === 'active');
                            const totalAmount = userLoans.reduce((acc, loan) => acc + loan.amount, 0);
                            
                            return (
                              <tr key={user.id}>
                                <td className="px-3 py-2">{user.name}</td>
                                <td className="px-3 py-2">{user.email}</td>
                                <td className="px-3 py-2">{activeLoans.length}</td>
                                <td className="px-3 py-2">${totalAmount.toLocaleString()}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};