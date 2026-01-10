"use client";

import { useEffect, useState } from "react";
import useAuth from "@/lib/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const router = useRouter();

  const { handleVerifyOtp, handleResendOtp, loading } = useAuth();

  // Timer
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    setCanResend(timer === 0);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    const res = await handleVerifyOtp(otpCode);

    if (res?.success) {
      toast.success("OTP verified successfully!");

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      setTimeout(() => {
        router.push(`/reset-password?token=${encodeURIComponent(token || "")}`);
      }, 1000);
    } else {
      toast.error(res?.message || "Failed to verify OTP");
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    const res = await handleResendOtp();

    if (res?.success) {
      toast.success("OTP sent again successfully ✔");
    } else {
      toast.error("Failed to resend OTP");
    }

    setTimer(30);
    setCanResend(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECF3EC] px-4">
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="bg-white w-full max-w-xl rounded-2xl shadow-md p-10"
      >
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-semibold text-[#09714E] mb-2 text-center"
        >
          Verify Your Account
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-[#6C757D] mb-6 text-center"
        >
          Enter the 6-digit code sent to your email to continue.
        </motion.p>

        {/* OTP Inputs */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="flex items-center gap-3 justify-center mb-4"
        >
          {otp.map((digit, i) => (
            <motion.input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
              className={`w-14 h-14 text-2xl text-center border rounded-lg outline-none transition
                ${
                  digit
                    ? "border-[#09714E] text-[#09714E]"
                    : "border-gray-300 text-gray-700"
                }`}
            />
          ))}
        </motion.div>

        {/* Timer + Resend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex justify-between items-center text-sm text-[#6C757D] mb-6"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{String(timer).padStart(2, "0")} Second</span>
          </div>

          <div>
            <span className="text-[#6C757D] text-md mr-2">
              Didn’t get a code?
            </span>
            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`font-medium ${
                canResend
                  ? "text-[#09714E] hover:underline cursor-pointer"
                  : "text-[#6C757D] cursor-not-allowed"
              }`}
            >
              Resend
            </button>
          </div>
        </motion.div>

        {/* Verify Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full bg-[#09714E] text-white py-3 rounded-md text-lg font-medium transition
            ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-[#09714E] cursor-pointer"
            }`}
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </motion.button>
      </motion.div>
    </div>
  );
}
