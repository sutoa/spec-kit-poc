import { db } from '../db';
import { Credential } from '../types';

export class CredentialModel {
  static async create(connectionId: number, encryptedData: Buffer, iv: Buffer, authTag: Buffer): Promise<Credential> {
    const result = await db.run(
      `INSERT INTO credentials (connection_id, encrypted_data, iv, auth_tag) VALUES (?, ?, ?, ?)`,
      connectionId,
      encryptedData,
      iv,
      authTag
    );
    const newCredential = await db.get<Credential>('SELECT * FROM credentials WHERE id = ?', result.lastID);
    if (!newCredential) throw new Error('Failed to create credential');

    return {
      ...newCredential,
      encryptedData: Buffer.from(newCredential.encryptedData),
      iv: Buffer.from(newCredential.iv),
      authTag: Buffer.from(newCredential.authTag),
      createdAt: new Date(newCredential.createdAt),
      updatedAt: new Date(newCredential.updatedAt),
    };
  }

  static async getByConnectionId(connectionId: number): Promise<Credential | null> {
    const result = await db.get<Credential>('SELECT * FROM credentials WHERE connection_id = ?', connectionId);
    if (!result) return null;

    return {
      ...result,
      encryptedData: Buffer.from(result.encryptedData),
      iv: Buffer.from(result.iv),
      authTag: Buffer.from(result.authTag),
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
    };
  }

  static async update(connectionId: number, encryptedData: Buffer, iv: Buffer, authTag: Buffer): Promise<Credential | null> {
    await db.run(
      `UPDATE credentials SET encrypted_data = ?, iv = ?, auth_tag = ?, updated_at = datetime('now') WHERE connection_id = ?`,
      encryptedData,
      iv,
      authTag,
      connectionId
    );
    return this.getByConnectionId(connectionId);
  }

  static async delete(connectionId: number): Promise<void> {
    await db.run('DELETE FROM credentials WHERE connection_id = ?', connectionId);
  }
}
