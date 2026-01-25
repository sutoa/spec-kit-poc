import { db } from '../db';
import { Connection, ConnectionStatus } from '../types';

export class ConnectionModel {
  static async create(institutionId: string): Promise<Connection> {
    const result = await db.run(
      `INSERT INTO connections (institution_id, status) VALUES (?, ?)`,
      institutionId,
      'disconnected'
    );
    const newConnection = await db.get<Connection>('SELECT * FROM connections WHERE id = ?', result.lastID);
    if (!newConnection) throw new Error('Failed to create connection');

    return {
      ...newConnection,
      status: newConnection.status as ConnectionStatus,
      lastSyncAt: newConnection.lastSyncAt ? new Date(newConnection.lastSyncAt) : null,
      createdAt: new Date(newConnection.createdAt),
      updatedAt: new Date(newConnection.updatedAt),
    };
  }

  static async getById(id: number): Promise<Connection | null> {
    const result = await db.get<Connection>('SELECT * FROM connections WHERE id = ?', id);
    if (!result) return null;

    return {
      ...result,
      status: result.status as ConnectionStatus,
      lastSyncAt: result.lastSyncAt ? new Date(result.lastSyncAt) : null,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
    };
  }

  static async getByInstitutionId(institutionId: string): Promise<Connection | null> {
    const result = await db.get<Connection>('SELECT * FROM connections WHERE institution_id = ?', institutionId);
    if (!result) return null;

    return {
      ...result,
      status: result.status as ConnectionStatus,
      lastSyncAt: result.lastSyncAt ? new Date(result.lastSyncAt) : null,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
    };
  }

  static async getAll(): Promise<Connection[]> {
    const results = await db.all<Connection[]>('SELECT * FROM connections');
    return results.map(result => ({
      ...result,
      status: result.status as ConnectionStatus,
      lastSyncAt: result.lastSyncAt ? new Date(result.lastSyncAt) : null,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
    }));
  }

  static async updateStatus(id: number, status: ConnectionStatus, errorMessage: string | null = null): Promise<Connection | null> {
    await db.run(
      `UPDATE connections SET status = ?, error_message = ?, updated_at = datetime('now') WHERE id = ?`,
      status,
      errorMessage,
      id
    );
    return this.getById(id);
  }

  static async updateLastSyncAt(id: number, lastSyncAt: Date): Promise<Connection | null> {
    await db.run(
      `UPDATE connections SET last_sync_at = ?, updated_at = datetime('now') WHERE id = ?`,
      lastSyncAt.toISOString(),
      id
    );
    return this.getById(id);
  }

  static async delete(id: number): Promise<void> {
    await db.run('DELETE FROM connections WHERE id = ?', id);
  }
}
