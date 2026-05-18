import axiosInstance from '../instance/axios-instance';

export const getAllDrivers = async () => {
  try {
    const response = await axiosInstance.get('/driver/all-drivers');
    return response.data;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    throw error;
  }
};
