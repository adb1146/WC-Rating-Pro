import React from 'react';
import { Search } from 'lucide-react';

interface RatingSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function RatingSearch({ value, onChange }: RatingSearchProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search rating factors and tables..."
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
      />
    </div>
  );
}