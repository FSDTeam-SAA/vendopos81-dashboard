"use client";

export default function Overview() {
  return (
    <div className="flex justify-center items-center p-8 text-center">
      <div className="max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#086646] mb-4">
          Admin Panel Overview
        </h1>

        {/* Subheading */}
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Welcome Back!
        </h2>

        {/* Body Text */}
        <p className="text-gray-700 text-base leading-relaxed mb-2">
          This page gives you a high-level view of your admin panel and its
          core features. All main functionality is operational and ready to use.
        </p>

        <p className="text-gray-600 text-sm mb-4">
          Additional features and improvements are currently under development.
          Please allow some time as we continue to enhance your experience.
        </p>

        {/* Status Badge */}
        <div className="mt-5 inline-flex items-center rounded-lg bg-[#ECF3EC] px-4 py-2 text-sm font-semibold text-[#086646]">
          🚧 Work in Progress
        </div>
      </div>
    </div>
  );
}
