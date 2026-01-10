import type { Metadata } from "next";
import "../globals.css";
// import Image from "next/image";

export const metadata: Metadata = {
  title: "Dashboard Auth",
  description: "Authentication Layout for Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col-reverse md:flex-row items-center justify-center  p-4 md:p-0 my-20 md:my-0 bg-[#ECF3EC]">
      <div className="">{children}</div>
    </div>
  );
}
