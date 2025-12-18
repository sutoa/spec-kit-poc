import * as React from 'react';

interface Account {
  masked_account_number: string;
  balance: number;
  as_of_date: string;
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

const ReportTable: React.FC<ReportTableProps> = ({ institutions }) => {
  return (
    <div className="flex flex-col gap-4">
      {institutions.map((institution, instIndex) => (
        <div key={instIndex} className="bg-panel-light dark:bg-panel-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-gray-50 dark:bg-white/5">
            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">{institution.name}</h3>
            <div className="text-right">
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Sub-total</p>
              <p className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">${institution.sub_total.toFixed(2)}</p>
            </div>
          </div>
          <div className="divide-y divide-border-light dark:divide-border-dark">
            {institution.accounts.map((account, accIndex) => (
              <div key={accIndex} className="grid grid-cols-4 gap-4 p-3 items-center">
                <div className="col-span-2">
                  <p className="font-medium text-text-primary-light dark:text-text-primary-dark text-sm">Account</p>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark font-mono">•••• {account.masked_account_number}</p>
                </div>
                <div className="text-right col-span-2">
                  <p className="font-medium text-base text-text-primary-light dark:text-text-primary-dark">${account.balance.toFixed(2)}</p>
                  <p className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark">as of {new Date(account.as_of_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportTable;