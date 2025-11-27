import React from 'react';
import { Wind, ShieldCheck } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Wind className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">BladeGuard AI</h1>
              <p className="text-xs text-gray-500 font-medium">Automated Turbine Inspection System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;