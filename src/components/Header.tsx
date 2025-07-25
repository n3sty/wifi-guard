"use client";

import { ShieldCheckIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isInfoPage = pathname === "/security-info";

  return (
    <header className="max-w-2xl mx-auto w-full px-2 sm:px-4 md:px-6 py-4 my-4 bg-white rounded-xl ">
      <div className="flex flex-row items-center justify-between w-full">
        {/* Logo and Brand Section */}
        <div className="flex flex-row items-center space-x-3">
          <div className="!size-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <ShieldCheckIcon className="!size-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">WiFi Guard</h1>
            <p className="text-xs sm:text-sm text-gray-500 -mt-0.5">
              Network Security Scanner
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-row items-center">
          {isInfoPage ? (
            <Link
              href="/"
              className="px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm shadow-sm flex items-center gap-1 sm:gap-2"
            >
              <ShieldCheckIcon className="!size-4" />
              <span className="hidden sm:inline">Scan WiFi</span>
              <span className="sm:hidden">Scan</span>
            </Link>
          ) : (
            <Link
              href="/security-info"
              className="px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-xs sm:text-sm shadow-sm flex items-center gap-1 sm:gap-2"
            >
              <InfoIcon className="!size-4" />
              <span className="hidden sm:inline">Security Info</span>
              <span className="sm:hidden">Info</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
