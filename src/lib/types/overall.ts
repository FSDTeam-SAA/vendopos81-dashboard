/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RevenueChartData {
  month: string;
  value: number;
}

export interface RevenueChartResponse {
  type: "revenue";
  year: number;
  chartData: RevenueChartData[];
}

export interface RevenueChartApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: RevenueChartResponse;
}

export interface RegionAnalyticsData {
  region: string;
  percentage: number;
  totalOrders: number;
  [key: string]: any; // Add this line
}

export interface RegionAnalyticsApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: RegionAnalyticsData[];
}

export interface DashboardAnalyticsData {
  totalOrder: number;
  totalRevenue: number;
  totalCustomer: number;
  totalSupplier: number;
}

export interface DashboardAnalyticsApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: DashboardAnalyticsData;
}
