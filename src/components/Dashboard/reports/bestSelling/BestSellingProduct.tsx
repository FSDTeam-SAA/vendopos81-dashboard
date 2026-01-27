import React, { useState } from 'react'
import { Eye } from 'lucide-react'
import ViewModal from './ViewModal'

interface Product {
  rank: number;
  name: string;
  sku: string;
  unitsSold: number;
  revenue: string;
  rating: number;
  icon: string;
}

const BestSellingProduct = () => {
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const products: Product[] = [
    {
      rank: 1,
      name: 'Wireless Headphones Pro',
      sku: 'WHP-2024-001',
      unitsSold: 1240,
      revenue: '$49,600',
      rating: 4.8,
      icon: '🎧'
    },
    {
      rank: 2,
      name: 'USB-C Fast Charger',
      sku: 'UFC-2024-002',
      unitsSold: 985,
      revenue: '$19,700',
      rating: 4.6,
      icon: '🔌'
    },
    {
      rank: 3,
      name: 'Mechanical Keyboard RGB',
      sku: 'MKR-2024-003',
      unitsSold: 756,
      revenue: '$37,800',
      rating: 4.7,
      icon: '⌨️'
    },
    {
      rank: 4,
      name: 'Portable SSD 1TB',
      sku: 'PSS-2024-004',
      unitsSold: 542,
      revenue: '$32,520',
      rating: 4.9,
      icon: '💾'
    },
    {
      rank: 5,
      name: 'Webcam HD 1080p',
      sku: 'WCD-2024-005',
      unitsSold: 438,
      revenue: '$10,950',
      rating: 4.5,
      icon: '📹'
    }
  ]

  const handleView = (product: Product) => {
    setSelectedProduct(product)
    setViewModalOpen(true)
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
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rating</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">View</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.rank} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 text-sm">
                  <span className="text-2xl">{product.icon}</span>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sku}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded">
                    {product.unitsSold}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">{product.revenue}</td>
                <td className="py-4 px-4 text-sm">
                  <span className="text-yellow-500">⭐ {product.rating}</span>
                </td>
                <td className="py-4 px-4 text-center">
                  <button onClick={() => handleView(product)}>
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ViewModal 
        viewModalOpen={viewModalOpen} 
        setViewModalOpen={setViewModalOpen} 
        data={selectedProduct} 
      />
    </div>
  )
}

export default BestSellingProduct
