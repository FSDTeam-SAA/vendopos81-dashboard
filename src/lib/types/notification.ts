export interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: "order" | "payment" | "success" | "warning" | "info";
  isViewed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsParams {
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface NotificationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Notification[];
  meta: NotificationMeta;
}
