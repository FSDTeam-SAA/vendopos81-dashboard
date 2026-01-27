import React, { useState } from 'react'
import { Eye, Store } from 'lucide-react'
import ViewModal from './ViewModal'
import { useReportTopSuppliers } from '@/lib/hooks/useReport';
import { TopSupplier } from '@/lib/types/report';
import Pagination from '@/components/shared/Pagination';


const ITEMS_PER_PAGE = 5;

const TopSuppliers = () => {
  const [viewModalOpen, setViewModalOpen] = React.useState(false)
  const [selectedSupplier, setSelectedSupplier] = React.useState<string>('')
  const [currentPage, setCurrentPage] = useState(1);
  const {data, isLoading, isError} = useReportTopSuppliers()

  const suplliersData = data?.data || [];
  
  const totalPages = Math.ceil(suplliersData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSuppliers = suplliersData.slice(startIndex, endIndex);

  const handleView = (id:string,) => {
    setSelectedSupplier(id)
    setViewModalOpen(true)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading suppliers...</div>
  }
  
  if (isError) {
    return <div className="p-4 text-center text-red-500">Error loading suppliers</div>
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            🏢 Top Suppliers
          </h3>
          <p className="text-sm text-gray-600">Suppliers with highest order value</p>
        </div>
        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
          📥 Export
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Supplier</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Total Orders
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Total Value
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rating</th> 
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">View</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSuppliers.length > 0 ? (
                paginatedSuppliers.map((supplier: TopSupplier, index: number) => (
              <tr key={supplier.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 text-sm font-medium text-gray-500">
                  #{startIndex + index + 1}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {supplier.logo ? (
                        <img src={supplier.logo} alt={supplier.shopName} className="w-full h-full object-cover" />
                      ) : (
                        <Store className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{supplier.shopName}</p>
                      <p className="text-sm text-gray-500">{supplier.brandName}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded">
                    {supplier.totalOrders} orders
                  </span>
                </td>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">
                  ${supplier.totalValue.toLocaleString()}
                </td>
                 <td className="py-4 px-4 text-sm font-medium text-gray-900">
                  {supplier.rating}
                </td>
                <td className="py-4 px-4 text-center">
                  <button onClick={() => handleView(supplier.id)}>
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))
            ) : (
                <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">No suppliers found.</td>
                </tr>
            )}
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
        id={selectedSupplier} 
      />
    </div>
  )
}

export default TopSuppliers
