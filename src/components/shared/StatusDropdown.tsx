/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';

interface Props {
  product: any;
  onStatusChange: (status: string) => void;
}

const StatusDropdown = ({ product, onStatusChange }: Props) => {
  const [status, setStatus] = useState(product.status || 'pending');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;

    setStatus(newStatus);
    onStatusChange(newStatus);
  };

  const statusStyles: any = {
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm text-gray-500">Status :</p>

      <select
        value={status}
        onChange={handleChange}
        className={`px-3 py-1 rounded-full text-xs font-semibold outline-none cursor-pointer ${
          statusStyles[status] || 'bg-gray-100 text-gray-700'
        }`}
      >
        <option value="pending">PENDING</option>
        <option value="approved">APPROVED</option>
        <option value="rejected">REJECTED</option>
      </select>
    </div>
  );
};

export default StatusDropdown;
