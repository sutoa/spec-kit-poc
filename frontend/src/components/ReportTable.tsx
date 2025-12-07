import React from 'react';

interface Account {
  snaptrade_account_id: string;
  masked_account_number: string;
  balance: number;
  currency: string;
  as_of_date: string;
}

interface Institution {
  name: string;
  accounts: Account[];
}

interface ReportTableProps {
  institutions: Institution[];
}

const ReportTable: React.FC<ReportTableProps> = ({ institutions }) => {
  return (
    <div className="flex flex-col gap-4">
      {institutions.map((institution) => {
        const subTotal = institution.accounts.reduce((acc, account) => acc + account.balance, 0);

        return (
          <div key={institution.name} className="bg-panel-light dark:bg-panel-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
            <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-gray-50 dark:bg-white/5">
              <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">{institution.name}</h3>
              <div className="text-right">
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Sub-total</p>
                <p className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">
                  {subTotal.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD', // Assuming USD for sub-total for now
                  })}
                </p>
              </div>
            </div>
            <div className="divide-y divide-border-light dark:divide-border-dark">
              {institution.accounts.map((account) => (
                <div key={account.snaptrade_account_id} className="grid grid-cols-3 gap-4 p-3 items-center">
                  <div className="col-span-1">
                    <p className="font-medium text-text-primary-light dark:text-text-primary-dark text-sm">{account.masked_account_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-base text-text-primary-light dark:text-text-primary-dark">
                      {account.balance.toLocaleString('en-US', {
                        style: 'currency',
                        currency: account.currency,
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{new Date(account.as_of_date).toISOString().split('T')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportTable;

