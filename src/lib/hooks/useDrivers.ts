import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllDrivers, updateDriverStatus } from '../services/Drivers';
import { toast } from 'sonner';

export const useAllDrivers = () => {
  return useQuery({
    queryKey: ['all-drivers'],
    queryFn: getAllDrivers,
  });
};

export const useUpdateDriverStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateDriverStatus(id, status),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['all-drivers'],
      });

      toast.success(`Driver status updated to ${variables.status}`);
    },

    onError: () => {
      toast.error('Failed to update driver status');
    },
  });
};
