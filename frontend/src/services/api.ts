const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request<T>(
  method: string,
  path: string,
  data?: any
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, data: any) => request<T>('POST', path, data),
  put: <T>(path: string, data: any) => request<T>('PUT', path, data),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
