"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/lib/hooks/useAuth";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { loading, handleForgotPassword } = useAuth();

  const handleSendCode = async () => {
    const response = await handleForgotPassword(email);

    if (response.success && response.data?.data?.accessToken) {
      const accessToken = response.data.data.accessToken;
      router.push(`/verify-otp?token=${encodeURIComponent(accessToken)}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECF3EC]">
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-lg px-8 py-10"
      >
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-[#09714E] text-center"
        >
          Reset Your Password
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-[#6C757D] mt-1 text-sm text-center"
        >
          Enter your email address and we’ll send you code to reset your
          password.
        </motion.p>

        {/* Form */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="mt-6 space-y-4"
        >
          {/* Email Input */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Label>Email Address</Label>

            <div className="relative mt-1">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <Input
                type="email"
                className="pl-10 py-5"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Button
              className="w-full bg-[#09714E] hover:bg-[#09714E] mt-4 text-white"
              onClick={handleSendCode}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Code"}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
