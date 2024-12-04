import React from 'react';
import { FileText, Clock, DollarSign, Eye } from 'lucide-react';
import { Quote } from '../../types';
import { QuotePreview } from '../QuotePreview';
import { formatCurrency } from '../../utils/formatters';
import { format } from 'date-fns';

interface QuoteListProps {
  quotes: Quote[];
  onStatusChange: () => void;
}

export function QuoteList({ quotes, onStatusChange }: QuoteListProps) {
  const [selectedQuote, setSelectedQuote] = React.useState<Quote>();
  
  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
  };

  const handleStatusChange = async (quoteId: string, status: Quote['status']) => {
    try {
      await updateQuoteStatus(quoteId, status);
      onStatusChange();
    } catch (error) {
      console.error('Error updating quote status:', error);
    }
  };
  const handleCloseQuote = () => {
    setSelectedQuote(undefined);
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
              Quote Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Premium
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {quotes.map((quote) => (
            <tr key={quote.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {quote.businessInfo.name}
                </div>
                <div className="text-sm text-gray-500">
                  {quote.businessInfo.fein}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {quote.quoteNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {format(new Date(quote.createdAt), 'MMM d, yyyy')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm font-medium text-gray-900">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  {formatCurrency(quote.premium)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full
                  ${quote.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    quote.status === 'issued' ? 'bg-blue-100 text-blue-800' :
                    quote.status === 'bound' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'}`}>
                  {quote.status.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleViewQuote(quote)}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                >
                  <Eye className="w-4 h-4" />
                  View Quote
                </button>
              </td>
            </tr>
          ))}
          {quotes.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No quotes generated yet</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {selectedQuote && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto">
            <QuotePreview quote={selectedQuote} onClose={handleCloseQuote} />
          </div>
        </div>
      )}
    </div>
  );
}