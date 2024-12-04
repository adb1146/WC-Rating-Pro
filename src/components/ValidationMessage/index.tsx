import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ValidationMessageProps {
  message: string;
}

export function ValidationMessage({ message }: ValidationMessageProps) {
  return (
    <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}