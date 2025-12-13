import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export const getInstitutions = async () => {
  const response = await axios.get(`${API_URL}/institutions/`);
  return response.data;
};

export const connectInstitution = async (institutionId: string) => {
  const response = await axios.post(`${API_URL}/snaptrade/connect`, { institution_id: institutionId });
  return response.data;
};