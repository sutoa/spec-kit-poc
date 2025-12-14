import React from 'react';

interface Account {
  masked_account_number: string;
  balance: number;
  as_of_date: string; // YYYY-MM-DD
}

interface InstitutionData {
  name: string;
  accounts: Account[];
  sub_total: number;
}

interface ReportTableProps {
  institutions: InstitutionData[];
  grandTotal: number;
}

const ReportTable: React.FC<ReportTableProps> = ({ institutions, grandTotal }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Account Report</h2>
      {institutions.map((institution) => (
        <div key={institution.name} className="mb-6">
          <h3 className="text-lg font-semibold">{institution.name} (Subtotal: ${institution.sub_total.toFixed(2)})</h3>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Account Number</th>
                <th className="py-2 px-4 border-b">Balance</th>
                <th className="py-2 px-4 border-b">As of Date</th>
              </tr>
            </thead>
            <tbody>
              {institution.accounts.map((account, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{account.masked_account_number}</td>
                  <td className="py-2 px-4 border-b">${account.balance.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{account.as_of_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <h2 className="text-xl font-bold mt-6">Grand Total: ${grandTotal.toFixed(2)}</h2>
    </div>
  );
};

export default ReportTable;