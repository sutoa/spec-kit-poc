import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { api } from '../services/api';

type QueryKey = [string, ...any[]];

export function useApiQuery<TData, TError = Error>(
  key: QueryKey,
  path: string,
  options?: UseQueryOptions<TData, TError>
) {
  return useQuery<TData, TError>({
    queryKey: key,
    queryFn: async () => api.get<TData>(path),
    ...options,
  });
}

export function useApiMutation<TData, TError = Error, TVariables = any>(
  method: 'post' | 'put' | 'delete',
  path: string,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (data) => {
      switch (method) {
        case 'post':
          return api.post<TData>(path, data);
        case 'put':
          return api.put<TData>(path, data);
        case 'delete':
          return api.delete<TData>(path);
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
    },
    ...options,
  });
}
