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

export const updateDriverStatus = async (id: string, status: string) => {
  try {
    const response = await axiosInstance.put(`/driver/update-status/${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating driver status:', error);
    throw error;
  }
};
