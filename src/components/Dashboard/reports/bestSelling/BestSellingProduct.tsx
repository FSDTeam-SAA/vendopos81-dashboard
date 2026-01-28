import React, { useState } from 'react'
import { Eye, Package } from 'lucide-react'
import ViewModal from './ViewModal'
import { useReportBestSellingProduct } from '@/lib/hooks/useReport';
import { BestsellingProduct } from '@/lib/types/report';
import Pagination from '@/components/shared/Pagination';

const ITEMS_PER_PAGE = 5;

const BestSellingProduct = () => {
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1);
  const {data,isLoading,isError} = useReportBestSellingProduct();

  const bestSellingProducts = data?.data || [];
  
  const totalPages = Math.ceil(bestSellingProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = bestSellingProducts.slice(startIndex, endIndex);

  const handleView = (id: string) => {
    setSelectedProductId(id)
    setViewModalOpen(true)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading best selling products...</div>
  }
  
  if (isError) {
    return <div className="p-4 text-center text-red-500">Error loading data</div>
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            ⭐ Bestselling Products
          </h3>
          <p className="text-sm text-gray-600">Top performing products by revenue</p>
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
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Units Sold</th>
              {/* <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th> */}
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rating</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">View</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product: BestsellingProduct, index: number) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm font-medium text-gray-500">
                    #{startIndex + index + 1}
                    </td>
                    <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                        <p className="font-medium text-gray-900">{product.title}</p>
                        <p className="text-sm text-gray-500">{product.categoryRegion || 'General'}</p>
                        </div>
                    </div>
                    </td>
                    <td className="py-4 px-4">
                    <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded">
                        {product.totalSold}
                    </span>
                    </td>
                    <td className="py-4 px-4 text-sm">
                    <span className="text-yellow-500 font-medium">⭐ {product.rating}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                    <button onClick={() => handleView(product.id)}>
                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                    </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">No products found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <ViewModal 
        viewModalOpen={viewModalOpen} 
        setViewModalOpen={setViewModalOpen} 
        id={selectedProductId} 
      />
    </div>
  )
}

export default BestSellingProduct
