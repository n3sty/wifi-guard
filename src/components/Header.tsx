import { ShieldCheckIcon } from "lucide-react";

export default function Header() {
  return (
    <header className="max-w-2xl mx-auto w-full px-2 sm:px-4 md:px-6 py-4 my-4 bg-white rounded-xl ">
      <div className="flex flex-row items-center space-x-3 justify-center sm:justify-start">
        {/* Logo */}
        <div className="!size-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
          <ShieldCheckIcon className="!size-6 text-white" />
        </div>
        {/* Brand */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">WiFi Guard</h1>
          <p className="text-sm text-gray-500 -mt-0.5">
            Network Security Scanner
          </p>
        </div>
      </div>

      {/* Action Button */}
      {/* <div className="flex flex-row items-center space-x-3 justify-center sm:justify-end">
            <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm shadow-sm">
              Get Pro
            </button>
          </div> */}
    </header>
  );
}
