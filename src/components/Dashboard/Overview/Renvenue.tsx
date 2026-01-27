"use client";

import { useOverviewRevenue } from "@/lib/hooks/useOverView";
import { RevenueChartApiResponse } from "@/lib/types/overall";
import { Loader2 } from "lucide-react";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Renvenue = () => {
  const { data, isLoading, isError } = useOverviewRevenue();

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
      </div>
    );
  }

  if (isError)
    return (
      <div className="h-[300px] flex items-center justify-center text-red-500">
        Error loading revenue data
      </div>
    );

  const chartData = (data as RevenueChartApiResponse)?.data?.chartData || [];

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <h2 className="text-lg font-semibold mb-1 text-gray-900">
        Revenue Overview
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Monthly revenue trends for{" "}
        {(data as RevenueChartApiResponse)?.data?.year ||
          new Date().getFullYear()}
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={true}
          />
          <XAxis
            dataKey="month"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#9ca3af' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value) => [`$${value}`, "Revenue"]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0d9488"
            strokeWidth={3}
            dot={{ fill: "#0d9488", r: 4, strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Revenue ($)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Renvenue;
