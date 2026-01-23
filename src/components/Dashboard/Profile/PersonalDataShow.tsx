import { Button } from "@/components/ui/button"
import { useGetProfile } from "@/lib/hooks/useProfile"

import { useSession } from "next-auth/react"

interface EditProps {
  onSetEdit: (v: boolean) => void
  edit: boolean
}

const InfoItem = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <p className="text-sm font-medium text-gray-700">{label}</p>
    <p className="mt-1 text-gray-900">{value || "—"}</p>
  </div>
)

const PersonalDataShow = ({ onSetEdit, edit }: EditProps) => {
  const { data, isLoading } = useGetProfile()
  const { data: session } = useSession()

  if (isLoading) {
    return (
      <div className="flex-1 bg-white rounded-lg border border-gray-200 p-8 flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    )
  }

  const profile = data?.data || session?.user

  return (
    <div className="flex-1 bg-white rounded-lg border border-gray-200 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b">
        <div className="flex items-center gap-6">
          {profile?.image?.url ? (
            <img 
              src={profile.image.url} 
              alt="Profile" 
              className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
              {profile?.firstName?.[0]}{profile?.lastName?.[0]}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile?.firstName} {profile?.lastName}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {profile?.email}
            </p>
          </div>
        </div>

        <Button
          onClick={() => onSetEdit(!edit)}
          className="bg-primary hover:bg-primary/90 text-white gap-2"
        >
          Edit Profile
        </Button>
      </div>

      <div className="space-y-8">
        {/* Contact Information */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem label="Email Address" value={profile?.email} />
            <InfoItem label="Phone Number" value={profile?.phone} />
          </div>
        </section>

        {/* Address Details */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem label="Street Address" value={profile?.street} />
            <InfoItem label="Location" value={profile?.location} />
            <InfoItem label="Postal Code" value={profile?.postalCode} />
          </div>
        </section>

        {/* Account Status */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoItem label="Role" value={profile?.role} />
            <InfoItem label="Verified" value={profile?.isVerified ? "Yes" : "No"} />
            <InfoItem label="Suspended" value={profile?.isSuspended ? "Yes" : "No"} />
          </div>
        </section>
      </div>
    </div>
  )
}


export default PersonalDataShow
