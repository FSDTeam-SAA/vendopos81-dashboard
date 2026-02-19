"use client";

import { useOverviewSalesByRegion } from "@/lib/hooks/useOverView";
import {
  RegionAnalyticsApiResponse,
  RegionAnalyticsData,
} from "@/lib/types/overall";
import { Loader2 } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const SalesByRegion = () => {
  const { data, isLoading, isError } = useOverviewSalesByRegion();

  const dataFormatted: RegionAnalyticsData[] =
    (data as RegionAnalyticsApiResponse)?.data || [];

  // ✅ Loading State
  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
      </div>
    );
  }

  // ✅ Error State
  if (isError) {
    return (
      <div className="h-[300px] flex items-center justify-center text-red-500">
        Error loading regional data
      </div>
    );
  }

  // ✅ No Data State
  if (!dataFormatted.length) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-gray-500 text-center">
        <p className="text-lg font-medium text-gray-700">
          No Regional Sales Data Available
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Sales distribution will appear here once orders are generated across
          regions.
        </p>
      </div>
    );
  }


  const COLORS = ["#0d9488", "#f97316", "#3b82f6", "#8b5cf6", "#ec4899"];

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <h2 className="text-lg font-semibold mb-1 text-gray-900">
        Sales By Region
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Distribution of orders across different regions
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dataFormatted}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ payload }: { payload?: RegionAnalyticsData }) =>
              payload ? `${payload.region} (${payload.percentage}%)` : ""
            }
            outerRadius={80}
            innerRadius={60}
            paddingAngle={5}
            dataKey="percentage"
            nameKey="region"
          >
            {dataFormatted.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name, props) => [
              `${value}% (${props.payload.totalOrders} orders)`,
              name,
            ]}
            contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
          />

          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesByRegion;
