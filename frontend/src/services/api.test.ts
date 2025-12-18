import { getInstitutions, connectInstitution, getDashboardData } from './api';
import axios from 'axios';
import { vi, Mock as ViMock } from 'vitest';

vi.mock('axios');

describe('API Service', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getInstitutions', () => {
    it('fetches institutions successfully', async () => {
      const mockInstitutions = [{ id: 1, external_id: 'inst1', name: 'Bank A', status: 'disconnected' }]; // id changed to number
      (axios.get as ViMock).mockResolvedValueOnce({ data: mockInstitutions });

      const institutions = await getInstitutions();
      expect(institutions).toEqual(mockInstitutions);
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/institutions/');
    });

    it('handles errors when fetching institutions', async () => {
      const errorMessage = 'Network Error';
      (axios.get as ViMock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(getInstitutions()).rejects.toThrow(errorMessage);
    });
  });

  describe('connectInstitution', () => {
    it('connects to an institution successfully', async () => {
      const mockRedirectUri = { redirect_uri: 'https://snaptrade.com/redirect' };
      (axios.post as ViMock).mockResolvedValueOnce({ data: mockRedirectUri });

      const result = await connectInstitution(1); // id changed to number
      expect(result).toEqual(mockRedirectUri);
      expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/snaptrade/connect', { institution_id: 1 }); // id changed to number
    });

    it('handles errors when connecting to an institution', async () => {
      const errorMessage = 'Connection Failed';
      (axios.post as ViMock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(connectInstitution(1)).rejects.toThrow(errorMessage); // id changed to number
    });
  });

  describe('getDashboardData', () => {
    it('fetches dashboard data successfully without asOfDate', async () => {
      const mockDashboardData = { grand_total: 1000, institutions: [] };
      (axios.get as ViMock).mockResolvedValueOnce({ data: mockDashboardData });

      const dashboardData = await getDashboardData();
      expect(dashboardData).toEqual(mockDashboardData);
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/dashboard/', { params: {} });
    });

    it('fetches dashboard data successfully with asOfDate', async () => {
      const mockDashboardData = { grand_total: 500, institutions: [] };
      (axios.get as ViMock).mockResolvedValueOnce({ data: mockDashboardData });

      const asOfDate = '2023-01-01';
      const dashboardData = await getDashboardData(asOfDate);
      expect(dashboardData).toEqual(mockDashboardData);
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/dashboard/', { params: { as_of_date: asOfDate } });
    });

    it('handles errors when fetching dashboard data', async () => {
      const errorMessage = 'Dashboard fetch failed';
      (axios.get as ViMock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(getDashboardData()).rejects.toThrow(errorMessage);
    });
  });
});
