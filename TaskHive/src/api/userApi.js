import axiosClient from './axiosClient';

export async function getCurrentUser(token) {
  try {
    const response = await axiosClient.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    return null;
  }
}
