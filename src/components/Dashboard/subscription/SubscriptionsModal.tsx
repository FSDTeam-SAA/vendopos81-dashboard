'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'
import { axiosInstance } from '@/lib/instance/axios-instance'
import { toast } from 'sonner'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

interface SubscriptionsModalProps {
  onClose: () => void
  subscriberId: string | null
}

const SubscriptionsModal: React.FC<SubscriptionsModalProps> = ({ onClose, subscriberId }) => {
  const [subject, setSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendEmail = async () => {
    if (!subject || !emailBody) {
      toast.error('Please fill in both subject and email body')
      return
    }

    setLoading(true)
    try {
      const payload = {
        subject,
        html: emailBody
      }

      if (subscriberId) {
        await axiosInstance.post(`/subscription/send-one/${subscriberId}`, payload)
        toast.success('Email sent successfully')
      } else {
        await axiosInstance.post('/subscription/send-bulk', payload)
        toast.success('Bulk emails sent successfully')
      }
      onClose()
    } catch (error) {
      console.error('Failed to send email:', error)
      toast.error('Failed to send email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {subscriberId ? 'Compose Email' : 'Compose Bulk Email'}
        </h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject Line
        </label>
        <Input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full"
          placeholder="Enter subject line"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Body
        </label>

        <div className="h-64 mb-12">
          <ReactQuill
            theme="snow"
            value={emailBody}
            onChange={setEmailBody}
            className="h-full"
            placeholder="Type your email content here..."
          />
        </div>
      </div>

      <div className="flex gap-3 justify-start pt-4">
        <Button
          onClick={handleSendEmail}
          disabled={loading}
          className="bg-green-700 hover:bg-green-800 text-white px-6"
        >
          {loading ? 'Sending...' : 'Send Email'}
        </Button>
        <Button
          onClick={onClose}
          variant="outline"
          className="px-6 bg-transparent"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default SubscriptionsModal
