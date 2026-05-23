/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import dynamic from 'next/dynamic';
// @ts-ignore: No type declarations for this CSS side-effect import
import 'react-quill-new/dist/quill.snow.css';
import { axiosInstance } from '@/lib/instance/axios-instance';
import { toast } from 'sonner';
import { Loader2, Mail, SendHorizonal, X } from 'lucide-react';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface SubscriptionsModalProps {
  onClose: () => void;
  subscriberId: string | null;
}

const SubscriptionsModal: React.FC<SubscriptionsModalProps> = ({ onClose, subscriberId }) => {
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!subject || !emailBody) {
      toast.error('Please fill in both subject and email body');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        subject,
        html: emailBody,
      };

      if (subscriberId) {
        await axiosInstance.post(`/subscription/send-one/${subscriberId}`, payload);
        toast.success('Email sent successfully');
      } else {
        await axiosInstance.post('/subscription/send-bulk', payload);
        toast.success('Bulk emails sent successfully');
      }

      onClose();
    } catch (error) {
      console.error('Failed to send email:', error);
      toast.error('Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#086646]/10">
              <Mail className="h-5 w-5 text-[#086646]" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {subscriberId ? 'Compose Email' : 'Compose Bulk Email'}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {subscriberId
                  ? 'Send a personalized email to this subscriber.'
                  : 'Send an email campaign to all newsletter subscribers.'}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Form */}
      <div className="mt-6 space-y-6">
        {/* Subject */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Subject Line</label>

          <Input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject"
            className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-[#086646]"
          />
        </div>

        {/* Email Body */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email Body</label>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <ReactQuill
              theme="snow"
              value={emailBody}
              onChange={setEmailBody}
              placeholder="Write your email content here..."
              className="custom-quill"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="h-10 rounded-xl border-gray-200 px-5 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSendEmail}
            disabled={loading}
            className="h-10 rounded-xl bg-[#086646] px-5 text-white hover:bg-[#06543a]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <SendHorizonal className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quill Custom Styling */}
      <style jsx global>{`
        .custom-quill .ql-toolbar {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          padding: 12px;
          background: #f9fafb;
        }

        .custom-quill .ql-container {
          border: none;
          min-height: 280px;
          font-size: 15px;
        }

        .custom-quill .ql-editor {
          min-height: 280px;
          padding: 16px;
          color: #111827;
        }

        .custom-quill .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }

        .custom-quill .ql-toolbar .ql-stroke {
          stroke: #6b7280;
        }

        .custom-quill .ql-toolbar .ql-fill {
          fill: #6b7280;
        }

        .custom-quill .ql-toolbar button:hover {
          color: #086646;
        }

        .custom-quill .ql-toolbar button.ql-active {
          color: #086646;
        }

        .custom-quill .ql-toolbar button.ql-active .ql-stroke {
          stroke: #086646;
        }

        .custom-quill .ql-toolbar button.ql-active .ql-fill {
          fill: #086646;
        }
      `}</style>
    </div>
  );
};

export default SubscriptionsModal;
