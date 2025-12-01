import React from 'react';

interface Account {
  masked_account_number: string;
  balance: number;
  currency: string;
  as_of_date: string;
}

interface Institution {
  name: string;
  accounts: Account[];
  sub_total: number;
}

interface ReportTableProps {
  institutions: Institution[];
}

export const ReportTable: React.FC<ReportTableProps> = ({ institutions }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow h-full overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Account Report</h2>
      {institutions.length === 0 ? (
        <p>No account data available.</p>
      ) : (
        institutions.map((institution) => (
          <div key={institution.name} className="mb-6">
            <h3 className="text-lg font-bold mb-2">{institution.name}</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">As of Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {institution.accounts.map((account, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.masked_account_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.balance.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.currency}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(account.as_of_date).toLocaleDateString()}</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Subtotal</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{institution.sub_total.toFixed(2)}</td>
                  <td colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};