import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllNotifications, markNotificationAsViewed } from "../services/notificationService";



export const useAllNotifications = (userId: string) => {
  return useQuery({
    queryKey: ["all-notifications", userId],
    queryFn: () => getAllNotifications(userId),
    enabled: !!userId,
  });
};

export const useMarkNotificationAsViewed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markNotificationAsViewed(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-notifications"] });
    },
  });
};
