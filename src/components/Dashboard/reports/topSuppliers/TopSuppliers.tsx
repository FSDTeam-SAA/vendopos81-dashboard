import React from 'react'
import { Eye } from 'lucide-react'
import ViewModal from './ViewModal'

interface Supplier {
  rank: number;
  name: string;
  email: string;
  totalOrders: number;
  totalValue: string;
  icon: string;
}

const TopSuppliers = () => {
  const [viewModalOpen, setViewModalOpen] = React.useState(false)
  const [selectedSupplier, setSelectedSupplier] = React.useState<Supplier | null>(null)

  const suppliers: Supplier[] = [
    {
      rank: 1,
      name: 'TechSupply Co.',
      email: 'contact@techsupply.com',
      totalOrders: 52,
      totalValue: '$18,900',
      icon: '⚙️'
    },
    {
      rank: 2,
      name: 'Global Logistics Inc',
      email: 'sales@globallog.com',
      totalOrders: 41,
      totalValue: '$15,320',
      icon: '📦'
    },
    {
      rank: 3,
      name: 'Premium Materials Ltd',
      email: 'info@premiummat.com',
      totalOrders: 35,
      totalValue: '$12,750',
      icon: '🏭'
    },
    {
      rank: 4,
      name: 'Quality Parts Distributor',
      email: 'orders@qparts.com',
      totalOrders: 28,
      totalValue: '$9,840',
      icon: '🔧'
    },
    {
      rank: 5,
      name: 'Express Wholesale',
      email: 'wholesale@express.com',
      totalOrders: 22,
      totalValue: '$8,120',
      icon: '🚚'
    }
  ]

  const handleView = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setViewModalOpen(true)
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
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">View</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.rank} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 text-sm">
                  <span className="text-2xl">{supplier.icon}</span>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{supplier.name}</p>
                    <p className="text-sm text-gray-500">{supplier.email}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded">
                    {supplier.totalOrders} orders
                  </span>
                </td>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">{supplier.totalValue}</td>
                <td className="py-4 px-4 text-center">
                  <button onClick={() => handleView(supplier)}>
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
        data={selectedSupplier} 
      />
    </div>
  )
}

export default TopSuppliers
