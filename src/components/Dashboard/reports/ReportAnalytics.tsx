'use client'

import React, { useState } from 'react'
import TopBuyers from './topBuyer/TopBuyers'
import TopSuppliers from './topSuppliers/TopSuppliers'
import BestSellingProduct from './bestSelling/BestSellingProduct'


type TabType = 'buyers' | 'suppliers' | 'products'

const ReportAnalytics = () => {
  const [activeTab, setActiveTab] = useState<TabType>('buyers')

  const tabs: { id: TabType; label: string }[] = [
    { id: 'buyers', label: 'Top Buyers' },
    { id: 'suppliers', label: 'Top Suppliers' },
    { id: 'products', label: 'Bestselling Products' }
  ]

  return (
    <section className="w-full py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Reports & Analytics</h2>
        <p className="text-gray-600">Generate and download business reports</p>
      </div>

      <div className="mb-8">
        <div className="flex gap-0 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 font-medium text-sm border-b-2 border-gray-900 transition-colors ${
                activeTab === tab.id
                  ? 'text-gray-900 border-x-2  border-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        {activeTab === 'buyers' && <TopBuyers />}
        {activeTab === 'suppliers' && <TopSuppliers />}
        {activeTab === 'products' && <BestSellingProduct />}
      </div>
    </section>
  )
}

export default ReportAnalytics
