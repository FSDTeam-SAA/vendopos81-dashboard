// Drivers.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Eye, MoreHorizontal } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAllDrivers, useUpdateDriverStatus } from '../../../lib/hooks/useDrivers';
import Loading from '../../shared/Loading';
import DriverDetailsModal from './DriverDetailsModal';

const Drivers = () => {
  const { data, isLoading, isError } = useAllDrivers();

  // ✅ Status Update Mutation
  const { mutate: updateStatus, isPending: statusUpdating } = useUpdateDriverStatus();

  const drivers = data?.data || [];

  const [open, setOpen] = useState(false);

  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  const handleViewDetails = (driver: any) => {
    setSelectedDriver(driver);
    setOpen(true);
  };

  // ✅ Handle Status Update
  const handleStatusUpdate = (id: string, status: string) => {
    updateStatus({
      id,
      status,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="h-[300px] flex items-center justify-center text-red-500">
        Something went wrong while loading drivers.
      </div>
    );
  }

  return (
    <>
      <div className="p-4 md:p-6">
        <div className="rounded-2xl border bg-white overflow-hidden">
          <div className="border-b px-6 py-4">
            <h2 className="text-xl font-semibold">Drivers List</h2>

            <p className="text-sm text-muted-foreground mt-1">
              Manage and monitor all registered drivers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {drivers.map((driver: any) => (
                  <TableRow key={driver._id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {driver.firstName} {driver.lastName}
                        </span>

                        <span className="text-sm text-muted-foreground">{driver.email}</span>
                      </div>
                    </TableCell>

                    <TableCell>{driver.yearsOfExperience} Years</TableCell>

                    <TableCell>{driver.city}</TableCell>

                    <TableCell>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          driver.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : driver.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {driver.status}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewDetails(driver)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              disabled={statusUpdating}
                              onClick={() => handleStatusUpdate(driver._id, 'approved')}
                            >
                              Approve
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              disabled={statusUpdating}
                              onClick={() => handleStatusUpdate(driver._id, 'pending')}
                            >
                              Pending
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              disabled={statusUpdating}
                              className="text-red-500"
                              onClick={() => handleStatusUpdate(driver._id, 'rejected')}
                            >
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <DriverDetailsModal open={open} setOpen={setOpen} driver={selectedDriver} />
    </>
  );
};

export default Drivers;
