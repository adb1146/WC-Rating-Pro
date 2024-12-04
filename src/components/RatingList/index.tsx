import React from 'react';
import { FileText, Clock, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { SavedRating } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { format } from 'date-fns';
import { getQuoteCountForRating } from '../../utils/storage';

interface RatingListProps {
  ratings: SavedRating[];
  onGenerateQuote: (rating: SavedRating) => void;
}

export function RatingList({ ratings, onGenerateQuote }: RatingListProps) {
  const [selectedRating, setSelectedRating] = React.useState<SavedRating>();
  const [quoteCounts, setQuoteCounts] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    // Fetch quote counts for all ratings
    const fetchQuoteCounts = async () => {
      const counts: Record<string, number> = {};
      for (const rating of ratings) {
        counts[rating.id] = await getQuoteCountForRating(rating.id);
      }
      setQuoteCounts(counts);
    };
    fetchQuoteCounts();
  }, [ratings]);

  const handleGenerateQuote = (rating: SavedRating) => {
    setSelectedRating(rating);
    onGenerateQuote(rating);
  };

  const getStatusIcon = (status: SavedRating['status']) => {
    switch (status) {
      case 'quoted':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'declined':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'submitted':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Business
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Premium
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {ratings.map((rating) => (
            <tr key={rating.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {rating.businessInfo.name}
                </div>
                <div className="text-sm text-gray-500">
                  {rating.businessInfo.fein}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {format(new Date(rating.savedAt), 'MMM d, yyyy h:mm a')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm font-medium text-gray-900">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  {formatCurrency(rating.totalPremium)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleGenerateQuote(rating)}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                >
                  <FileText className="w-4 h-4" />
                  Generate Quote
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {getStatusIcon(rating.status)}
                  <span className="text-sm font-medium capitalize text-gray-700">
                    {rating.status} {quoteCounts[rating.id] > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {quoteCounts[rating.id]} {quoteCounts[rating.id] === 1 ? 'quote' : 'quotes'}
                      </span>
                    )}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}