import axiosClient from './axiosClient';

export async function getCurrentUser() {
  try {
    const response = await axiosClient.get('/user/me');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    return null;
  }
}
