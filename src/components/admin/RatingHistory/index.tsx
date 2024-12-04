import React from 'react';
import { History, User, ArrowRight } from 'lucide-react';
import { getAuditLog } from '../../../utils/audit';
import { formatDistance } from 'date-fns';

interface RatingHistoryProps {
  className?: string;
}

export function RatingHistory({ className = '' }: RatingHistoryProps) {
  const auditLog = getAuditLog();

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900">Recent Changes</h2>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {auditLog.map((entry) => (
          <div key={entry.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  {entry.userId}
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <div className="text-sm font-medium text-gray-900">
                  {entry.action} {entry.entityType}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {formatDistance(new Date(entry.timestamp), new Date(), { addSuffix: true })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}