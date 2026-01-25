import { db } from '../db';
import { Institution, InstitutionApiType, InstitutionAuthType } from '../types';

export class InstitutionModel {
  static async getById(id: string): Promise<Institution | null> {
    const result = await db.get<Omit<Institution, 'apiType' | 'authType'> & { api_type: string, auth_type: string }>(
      'SELECT * FROM institutions WHERE id = ?',
      id
    );
    if (!result) return null;

    return {
      ...result,
      apiType: result.api_type as InstitutionApiType,
      authType: result.auth_type as InstitutionAuthType,
    };
  }

  static async getAll(): Promise<Institution[]> {
    const results = await db.all<Omit<Institution, 'apiType' | 'authType'> & { api_type: string, auth_type: string }>(
      'SELECT * FROM institutions'
    );
    return results.map(result => ({
      ...result,
      apiType: result.api_type as InstitutionApiType,
      authType: result.auth_type as InstitutionAuthType,
    }));
  }
}
