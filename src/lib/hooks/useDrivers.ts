import { useQuery } from '@tanstack/react-query';
import { getAllDrivers } from '../services/Drivers';

export const useAllDrivers = () => {
  return useQuery({
    queryKey: ['all-drivers'],
    queryFn: getAllDrivers,
  });
};
