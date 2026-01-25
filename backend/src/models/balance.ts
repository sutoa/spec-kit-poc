import { db } from '../db';
import { BalanceRecord } from '../types';

export class BalanceRecordModel {
  static async createOrUpdate(accountId: number, totalValue: number, cashBalance: number | null, portfolioValue: number | null, asOfDate: string): Promise<BalanceRecord> {
    await db.run(
      `INSERT INTO balance_records (account_id, total_value, cash_balance, portfolio_value, as_of_date)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(account_id, as_of_date) DO UPDATE SET
        total_value = EXCLUDED.total_value,
        cash_balance = EXCLUDED.cash_balance,
        portfolio_value = EXCLUDED.portfolio_value,
        fetched_at = datetime('now')`,
      accountId,
      totalValue,
      cashBalance,
      portfolioValue,
      asOfDate
    );
    const newRecord = await db.get<BalanceRecord>('SELECT * FROM balance_records WHERE account_id = ? AND as_of_date = ?', accountId, asOfDate);
    if (!newRecord) throw new Error('Failed to create or update balance record');

    return {
      ...newRecord,
      asOfDate: new Date(newRecord.asOfDate),
      fetchedAt: new Date(newRecord.fetchedAt),
    };
  }

  static async getLatestByAccountId(accountId: number): Promise<BalanceRecord | null> {
    const result = await db.get<BalanceRecord>('SELECT * FROM balance_records WHERE account_id = ? ORDER BY as_of_date DESC LIMIT 1', accountId);
    if (!result) return null;

    return {
      ...result,
      asOfDate: new Date(result.asOfDate),
      fetchedAt: new Date(result.fetchedAt),
    };
  }

  static async getByAccountIdAndDate(accountId: number, asOfDate: string): Promise<BalanceRecord | null> {
    const result = await db.get<BalanceRecord>('SELECT * FROM balance_records WHERE account_id = ? AND as_of_date = ?', accountId, asOfDate);
    if (!result) return null;

    return {
      ...result,
      asOfDate: new Date(result.asOfDate),
      fetchedAt: new Date(result.fetchedAt),
    };
  }

  static async getHistoryByAccountId(accountId: number): Promise<BalanceRecord[]> {
    const results = await db.all<BalanceRecord[]>('SELECT * FROM balance_records WHERE account_id = ? ORDER BY as_of_date ASC', accountId);
    return results.map(result => ({
      ...result,
      asOfDate: new Date(result.asOfDate),
      fetchedAt: new Date(result.fetchedAt),
    }));
  }

  static async deleteByAccountId(accountId: number): Promise<void> {
    await db.run('DELETE FROM balance_records WHERE account_id = ?', accountId);
  }
}
