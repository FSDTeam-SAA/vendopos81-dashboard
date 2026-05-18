// components/modules/drivers/DriverDetailsModal.tsx
'use client';

import Image from 'next/image';
import {
  CalendarDays,
  Car,
  Mail,
  MapPin,
  Phone,
  User2,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Document {
  public_id: string;
  url: string;
  _id: { $oid: string };
}

interface Driver {
  _id: { $oid: string };
  userId: { $oid: string };
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  yearsOfExperience: number;
  licenseExpiryDate: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: 'approved' | 'pending' | 'rejected' | string;
  documentUrl: Document[];
  isSuspended: boolean;
  suspendedUntil: string | null;
  isOnline: boolean;
  createdAt: { $date: string };
  updatedAt: { $date: string };
}

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  driver: Driver | null | undefined;
}

const DriverDetailsModal = ({ open, setOpen, driver }: Props) => {
  if (!driver) return null;

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
      case 'pending':
        return 'bg-amber-50 text-amber-700 ring-amber-600/20';
      default:
        return 'bg-rose-50 text-rose-700 ring-rose-600/20';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl rounded-2xl border p-0 overflow-hidden bg-background shadow-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b bg-muted/30 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Driver Profile</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comprehensive identity documentation and verification details.
            </p>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Top Hero Card */}
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center p-5 rounded-xl border bg-muted/20">
            <div className="h-20 w-20 rounded-xl border-2 border-background shadow-sm overflow-hidden bg-muted flex items-center justify-center shrink-0">
              {/* Check if first doc is an image, otherwise fallback to placeholder */}
              {driver.documentUrl?.[0]?.url && !driver.documentUrl[0].url.endsWith('.pdf') ? (
                <Image
                  src={driver.documentUrl[0].url}
                  alt="Driver Portrait"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User2 className="h-9 w-9 text-muted-foreground/70" />
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight text-foreground leading-none">
                {driver.firstName} {driver.lastName}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset uppercase tracking-wide ${getStatusStyles(driver.status)}`}
                >
                  {driver.status}
                </span>
                <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                  {driver.yearsOfExperience > 100
                    ? 'Experienced'
                    : `${driver.yearsOfExperience} Yrs Experience`}
                </span>
              </div>
            </div>
          </div>

          {/* Details Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 border-y py-6">
            {/* Left Column info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-muted-foreground block">
                    Email Address
                  </span>
                  <span className="text-sm font-medium text-foreground break-all">
                    {driver.email}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-muted-foreground block">
                    Phone Number
                  </span>
                  <span className="text-sm font-medium text-foreground">{driver.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-muted-foreground block">
                    License Expiry Date
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {driver.licenseExpiryDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-muted-foreground block">
                    Location/Region
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {driver.city.trim()}, {driver.state.trim()} {driver.zipCode}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Car className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-muted-foreground block">
                    Street Address
                  </span>
                  <span className="text-sm font-medium text-foreground leading-relaxed">
                    {driver.address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Files / Documents */}
          {driver.documentUrl && driver.documentUrl.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                Uploaded Verification Attachments
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {driver.documentUrl.map((doc, index) => {
                  const isPdf = doc.url.endsWith('.pdf');

                  return (
                    <div
                      key={doc._id?.$oid || index}
                      className="group relative rounded-xl border bg-card hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                    >
                      {isPdf ? (
                        /* Document view for PDFs */
                        <div className="p-5 flex flex-col justify-between items-start h-40 bg-muted/10">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
                              <FileText className="h-6 w-6" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs font-semibold text-muted-foreground uppercase">
                                Verification File
                              </p>
                              <p className="text-sm font-medium truncate text-foreground max-w-[180px]">
                                {doc.public_id.split('/').pop()}
                              </p>
                            </div>
                          </div>

                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 w-full text-xs font-medium inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border bg-background hover:bg-muted text-foreground transition-colors"
                          >
                            View Document <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      ) : (
                        /* Traditional Image rendering preview */
                        <div className="relative h-40 w-full bg-muted">
                          <Image
                            src={doc.url}
                            alt="Document Preview"
                            fill
                            className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DriverDetailsModal;
