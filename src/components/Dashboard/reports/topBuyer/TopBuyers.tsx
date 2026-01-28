import React from "react";
import { Eye } from "lucide-react";
import ViewModal from "./ViewModal";
import { useReportTopBuyers } from "@/lib/hooks/useReport";
import { TopBuyer } from "@/lib/types/report";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/shared/Pagination";

const ITEMS_PER_PAGE = 5;

const TopBuyers = () => {
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [selectedBuyer, setSelectedBuyer] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const { data, isLoading, isError } = useReportTopBuyers();
  const buyersData = data?.data || [];

  const totalPages = Math.ceil(buyersData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBuyers = buyersData.slice(startIndex, endIndex);

  const handleView = (id: string) => {
    setSelectedBuyer(id);
    setViewModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            🛍️ Top Buyers
          </h3>
          <p className="text-sm text-gray-600">
            Customers with highest purchase value
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
          📥 Export
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
                Rank
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
                Customer
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
                Total Orders
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
                Total Spent
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr
                    key={`skeleton-${i}`}
                    className="border-b border-gray-100"
                  >
                    <td className="py-4 px-4 whitespace-nowrap">
                      <Skeleton className="h-8 w-8 rounded" />
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <Skeleton className="h-6 w-20 rounded" />
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <Skeleton className="h-5 w-5 mx-auto" />
                    </td>
                  </tr>
                ))
              : paginatedBuyers.length > 0 ? (
                  paginatedBuyers.map((buyer: TopBuyer, index: number) => (
                  <tr
                    key={buyer._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 text-sm whitespace-nowrap">
                      <span className="text-2xl">{startIndex + index + 1}</span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">
                          {buyer.firstName} {buyer.lastName}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded">
                        {buyer.totalOrder} orders
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {buyer.totalSpent}
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button onClick={() => handleView(buyer._id)}>
                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No buyers found.</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <ViewModal
        viewModalOpen={viewModalOpen}
        setViewModalOpen={setViewModalOpen}
        id={selectedBuyer}
      />
    </div>
  );
};

export default TopBuyers;
