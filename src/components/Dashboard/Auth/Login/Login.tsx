"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        toast.success("Logged in successfully!");
        router.push("/");
      } else {
        toast.error(result?.error || "Login failed. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto container flex justify-center items-center min-h-screen">
      {/* Card Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-lg px-16 py-6 w-[550px]"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          className="flex items-center justify-center my-4"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-[#09714E] rounded-xl p-2">
            <Lock className="text-white" size={26} />
          </div>
        </motion.div>

        {/* Heading */}
        <h1 className="text-3xl font-semibold text-[#1A1A1A] text-center">
          Admin Dashboard
        </h1>
        <p className="text-[#6C757D] mt-2 text-xl text-center">
          Sign in to access your admin panel
        </p>

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
          {/* Email */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Label className="text-sm font-medium text-gray-700">
              Email Address
            </Label>

            <div className="relative mt-1">
              {/* Icon */}
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <Input
                type="email"
                placeholder="admin@example.com"
                className="pl-10 py-5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Label className="text-sm font-medium text-gray-700">
              Password
            </Label>

            <div className="relative mt-1">
              {/* Lock Icon */}
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <Input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="pl-10 pr-10 py-5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Eye Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.div>

          {/* Remember */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            className="flex items-center justify-between mt-2"
          >
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <Link
              href="/forget-password"
              className="text-sm text-[#09714E] hover:underline"
            >
              Forgot password?
            </Link>
          </motion.div>

          {/* Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Button
              className="w-full bg-[#09714E] hover:bg-[#09714E] mt-4 text-white cursor-pointer py-5 text-[16px]"
              onClick={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
