import { getInstitutions, connectInstitution } from './api';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');

describe('API Service', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getInstitutions', () => {
    it('fetches institutions successfully', async () => {
      const mockInstitutions = [{ id: '1', name: 'Bank A', status: 'disconnected' }];
      (axios.get as Mock).mockResolvedValueOnce({ data: mockInstitutions });

      const institutions = await getInstitutions();
      expect(institutions).toEqual(mockInstitutions);
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/institutions/');
    });

    it('handles errors when fetching institutions', async () => {
      const errorMessage = 'Network Error';
      (axios.get as Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(getInstitutions()).rejects.toThrow(errorMessage);
    });
  });

  describe('connectInstitution', () => {
    it('connects to an institution successfully', async () => {
      const mockRedirectUri = { redirect_uri: 'https://snaptrade.com/redirect' };
      (axios.post as Mock).mockResolvedValueOnce({ data: mockRedirectUri });

      const result = await connectInstitution('test-inst-id');
      expect(result).toEqual(mockRedirectUri);
      expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/snaptrade/connect', { institution_id: 'test-inst-id' });
    });

    it('handles errors when connecting to an institution', async () => {
      const errorMessage = 'Connection Failed';
      (axios.post as Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(connectInstitution('test-inst-id')).rejects.toThrow(errorMessage);
    });
  });

  describe('getDashboardData', () => {
    it('fetches dashboard data successfully without asOfDate', async () => {
      const mockDashboardData = { grand_total: 1000, institutions: [] };
      (axios.get as Mock).mockResolvedValueOnce({ data: mockDashboardData });

      const dashboardData = await getDashboardData();
      expect(dashboardData).toEqual(mockDashboardData);
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/dashboard/', { params: {} });
    });

    it('fetches dashboard data successfully with asOfDate', async () => {
      const mockDashboardData = { grand_total: 500, institutions: [] };
      (axios.get as Mock).mockResolvedValueOnce({ data: mockDashboardData });

      const asOfDate = '2023-01-01';
      const dashboardData = await getDashboardData(asOfDate);
      expect(dashboardData).toEqual(mockDashboardData);
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/dashboard/', { params: { as_of_date: asOfDate } });
    });

    it('handles errors when fetching dashboard data', async () => {
      const errorMessage = 'Dashboard fetch failed';
      (axios.get as Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(getDashboardData()).rejects.toThrow(errorMessage);
    });
  });
});

