import React from 'react';
import { GraduationCap, ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  backText?: string;
  onBack?: () => void;
  iconColor?: string;
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false, 
  backText = "Back to Home",
  onBack,
  iconColor = "bg-purple-600"
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        {showBackButton && (
          <div className="flex justify-center">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backText}
            </button>
          </div>
        )}

        {/* Header */}
        <div className="text-center">
          <div className={`mx-auto h-16 w-16 ${iconColor} rounded-2xl flex items-center justify-center shadow-lg`}>
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}