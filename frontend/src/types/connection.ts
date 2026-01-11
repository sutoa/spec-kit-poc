// frontend/src/types/connection.ts

export type InstitutionStatus = 'connected' | 'disconnected' | 'error' | 'pending';

export interface Institution {
  id: number;
  external_id: string;
  name: string;
  status: InstitutionStatus; // Maps to backend's string status
}