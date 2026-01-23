"use client";

import { useState } from "react";
import {

  CreditCard,
} from "lucide-react";
// import { Button } from "@/components/ui/button";
import { useGetProfile } from "@/lib/hooks/useProfile";
import PersonalDataShow from "./PersonalDataShow";
import PersonalInformationContainer from "./Personalcontainer/PersonalInformationContainer";
import ChangePasswordContainer from "./securitycontainer/ChangePasswordContainer";

interface SidebarItemProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

const SidebarItem = ({ id, label, isActive, onClick }: SidebarItemProps) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full border-l-2 border-black cursor-pointer flex items-center justify-between p-3  transition-all ${
      isActive
        ? "bg-primary/10 text-primary font-semibold"
        : "text-gray-600 hover:bg-gray-50"
    }`}
  >
    <div className="flex items-center gap-3">
      <span>{label}</span>
    </div>
  </button>
);

export default function ProfileHead() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading } = useGetProfile();

  const profile = data?.data;

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setIsEditing(false);
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <aside className=" flex gap-10 max-w-md border-b-2 border-black  ">
        <SidebarItem
          id="personal"
          label="Personal Information"
          isActive={activeTab === "personal"}
          onClick={handleTabChange}
        />
        <SidebarItem
          id="password"
          label="Security & Password"
          isActive={activeTab === "password"}
          onClick={handleTabChange}
        />
      </aside>

      <div className="container mx-auto px-6 py-10">
        <div className="  gap-10">
          {/* Left Sidebar */}

          {/* Right Content Area */}
          <div className="lg:col-span-3">
            {activeTab === "personal" &&
              (isEditing ? (
                <PersonalInformationContainer onSetEdit={setIsEditing} />
              ) : (
                <PersonalDataShow onSetEdit={setIsEditing} edit={isEditing} />
              ))}
            {activeTab === "password" && <ChangePasswordContainer />}

            {/* {activeTab === "billing" && (
              <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Billing Information
                </h3>
                <p className="text-gray-500 mt-2">
                  Your billing details will appear here soon.
                </p>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </main>
  );
}

