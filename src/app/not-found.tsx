// app/not-found.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen   from-gray-100 via-gray-50 to-white p-6">
      <Card className="max-w-lg w-full text-center shadow-xl border border-gray-200 bg-white/80 backdrop-blur-md animate-fadeIn rounded-3xl">
        <CardContent className="py-12">
          <h1 className="text-7xl md:text-9xl font-extrabold mb-4 text-red-600 drop-shadow-sm ">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-800">
            Oops! Page Not Found
          </h2>
          <p className="text-md md:text-lg mb-8 text-gray-600 text-center">
            Uh-oh! This route doesn’t exist.
            <br />
            Looks like you took a wrong turn.
          </p>
          <Link href="/" className="flex justify-center">
            <Button
              variant="default"
              className="bg-[#db1a1a] text-white hover:bg-red-600 px-6 py-3 text-lg font-medium cursor-pointer flex items-center gap-2 transition-transform hover:scale-105 "
            >
              <ArrowLeftCircle className="w-5 h-5" />
              Go Back Home
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Custom animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
