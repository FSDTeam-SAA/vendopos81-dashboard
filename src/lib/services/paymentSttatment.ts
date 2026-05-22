import axiosInstance from '../instance/axios-instance';

export const getAllPaymentSettlements = async () => {
  try {
    const response = await axiosInstance.get('/supplier-settlement/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

export const transferPaymentToSupplier = async (settlementId: string) => {
  try {
    const response = await axiosInstance.post(`/payment/transfer/${settlementId}`);

    return response.data;
  } catch (error) {
    console.error('Error transferring payment:', error);
    throw error;
  }
};
