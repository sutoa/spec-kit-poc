export interface Connection {
  id: number;
  institution_name: string;
  status: 'active' | 'error' | 'disconnected';
}