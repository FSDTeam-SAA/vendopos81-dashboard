import React from 'react'
import { Eye } from 'lucide-react'
import ViewModal from './ViewModal'

interface Buyer {
  rank: number;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: string;
  icon: string;
}

const TopBuyers = () => {
  const [viewModalOpen, setViewModalOpen] = React.useState(false)
  const [selectedBuyer, setSelectedBuyer] = React.useState<Buyer | null>(null)

  const buyers: Buyer[] = [
    {
      rank: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      totalOrders: 45,
      totalSpent: '$12,450',
      icon: '👑'
    },
    {
      rank: 2,
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      totalOrders: 38,
      totalSpent: '$10,890',
      icon: '🎭'
    },
    {
      rank: 3,
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      totalOrders: 32,
      totalSpent: '$9,650',
      icon: '🍎'
    },
    {
      rank: 4,
      name: 'James Wilson',
      email: 'james.w@email.com',
      totalOrders: 28,
      totalSpent: '$8,320',
      icon: '🎪'
    },
    {
      rank: 5,
      name: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      totalOrders: 25,
      totalSpent: '$7,850',
      icon: '🍊'
    }
  ]

  const handleView = (buyer: Buyer) => {
    setSelectedBuyer(buyer)
    setViewModalOpen(true)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            🛍️ Top Buyers
          </h3>
          <p className="text-sm text-gray-600">Customers with highest purchase value</p>
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
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Total Orders
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Total Spent
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">View</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map((buyer) => (
              <tr key={buyer.rank} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 text-sm">
                  <span className="text-2xl">{buyer.icon}</span>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{buyer.name}</p>
                    <p className="text-sm text-gray-500">{buyer.email}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded">
                    {buyer.totalOrders} orders
                  </span>
                </td>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">{buyer.totalSpent}</td>
                <td className="py-4 px-4 text-center">
                  <button onClick={() => handleView(buyer)}>
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
        data={selectedBuyer} 
      />
    </div>
  )
}

export default TopBuyers
