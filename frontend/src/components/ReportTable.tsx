import React from 'react';
import { DashboardInstitution, Account } from '../types/dashboard';

interface ReportTableProps {
  institutions: DashboardInstitution[];
}

const ReportTable: React.FC<ReportTableProps> = ({ institutions }) => {
  if (!institutions || institutions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 text-center text-gray-500 dark:text-gray-400">
        No institution data available.
      </div>
    );
  }

  return (
    <div className="mt-8">
      {institutions.map((instData) => (
        <div key={instData.institution.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{instData.institution.name}</h4>
            <span className="text-md font-bold text-gray-700 dark:text-gray-300">
              Subtotal: ${instData.sub_total.toFixed(2)}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Account Number
                  </th>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Balance
                  </th>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    As of Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {instData.accounts.map((account: Account) => (
                  <tr key={account.id}>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {account.masked_account_number}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      ${account.balance.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {account.as_of_date.toString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(ReportTable);