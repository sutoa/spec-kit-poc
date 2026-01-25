import { db } from '../db';
import { Account } from '../types';

export class AccountModel {
  static async create(connectionId: number, externalId: string, accountNumberMasked: string, accountName: string, accountType: string | null = null): Promise<Account> {
    const result = await db.run(
      `INSERT INTO accounts (connection_id, external_id, account_number_masked, account_name, account_type) VALUES (?, ?, ?, ?, ?)`,
      connectionId,
      externalId,
      accountNumberMasked,
      accountName,
      accountType
    );
    const newAccount = await db.get<Account>('SELECT * FROM accounts WHERE id = ?', result.lastID);
    if (!newAccount) throw new Error('Failed to create account');

    return {
      ...newAccount,
      isActive: Boolean(newAccount.isActive),
      createdAt: new Date(newAccount.createdAt),
      updatedAt: new Date(newAccount.updatedAt),
    };
  }

  static async getById(id: number): Promise<Account | null> {
    const result = await db.get<Account>('SELECT * FROM accounts WHERE id = ?', id);
    if (!result) return null;

    return {
      ...result,
      isActive: Boolean(result.isActive),
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
    };
  }

  static async getByConnectionId(connectionId: number): Promise<Account[]> {
    const results = await db.all<Account[]>('SELECT * FROM accounts WHERE connection_id = ?', connectionId);
    return results.map(result => ({
      ...result,
      isActive: Boolean(result.isActive),
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
    }));
  }

  static async getByConnectionIdAndExternalId(connectionId: number, externalId: string): Promise<Account | null> {
    const result = await db.get<Account>('SELECT * FROM accounts WHERE connection_id = ? AND external_id = ?', connectionId, externalId);
    if (!result) return null;

    return {
      ...result,
      isActive: Boolean(result.isActive),
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
    };
  }

  static async update(id: number, accountNumberMasked: string, accountName: string, accountType: string | null, isActive: boolean): Promise<Account | null> {
    await db.run(
      `UPDATE accounts SET account_number_masked = ?, account_name = ?, account_type = ?, is_active = ?, updated_at = datetime('now') WHERE id = ?`,
      accountNumberMasked,
      accountName,
      accountType,
      isActive ? 1 : 0,
      id
    );
    return this.getById(id);
  }

  static async deleteByConnectionId(connectionId: number): Promise<void> {
    await db.run('DELETE FROM accounts WHERE connection_id = ?', connectionId);
  }
}
