import React from 'react';
import { useEffect, useState } from 'react';
import { storage } from '../../../utils/localStorage';
import { useAuthStore } from '../../../store/authStore';
import { User, Loan } from '../../../types';

export const UserList: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [users, setUsers] = useState<User[]>([]);
  const [loans, setLoans] = useState<Record<string, Loan[]>>({});

  useEffect(() => {
    if (!user) return;

    const lender = storage.getLenders().find(l => l.id === user.id);
    if (!lender) return;

    const usersData = storage.getUsers().filter(u => lender.users.includes(u.id));
    const loansData = storage.getLoans().filter(loan => loan.lenderId === user.id);
    
    const userLoans = usersData.reduce((acc, user) => {
      acc[user.id] = loansData.filter(loan => loan.userId === user.id);
      return acc;
    }, {} as Record<string, Loan[]>);

    setUsers(usersData);
    setLoans(userLoans);
  }, [user]);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Users</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">List of all users with active loans</p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {users.map(user => {
            const userLoans = loans[user.id] || [];
            const activeLoans = userLoans.filter(loan => loan.status === 'active');
            const totalAmount = userLoans.reduce((acc, loan) => acc + loan.amount, 0);
            
            return (
              <li key={user.id} className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Active Loans: {activeLoans.length}
                    </p>
                    <p className="text-sm text-gray-500">
                      Total Amount: ${totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};