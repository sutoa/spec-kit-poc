export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'pending';

export interface Institution {
  id: number;
  external_id: string;
  name: string;
  status: ConnectionStatus;
  logoUrl?: string; // Optional as it might not always be available
}
