import React from 'react';
import { X, FileText, Calendar, DollarSign, Download } from 'lucide-react';
import { SavedRating, Quote } from '../../types';
import { format, addYears } from 'date-fns';
import { formatCurrency } from '../../utils/formatters';
import { saveQuote, updateApplicationStatus } from '../../utils/storage';
import { QuotePreview } from '../QuotePreview';

interface QuoteDialogProps {
  rating?: SavedRating;
  isOpen: boolean;
  onClose: () => void;
  onQuoteGenerated?: () => void;
}

const generateQuoteNumber = () => {
  const prefix = 'QTE';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

export function QuoteDialog({ rating, isOpen, onClose, onQuoteGenerated }: QuoteDialogProps) {
  const [effectiveDate, setEffectiveDate] = React.useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [notes, setNotes] = React.useState('');
  const [quote, setQuote] = React.useState<Quote>();

  if (!isOpen || !rating) return null;

  const handleGenerateQuote = async () => {
    if (!rating) return;
    
    const newQuote: Quote = {
      id: Date.now().toString(),
      ratingId: rating.id,
      quoteNumber: generateQuoteNumber(),
      businessInfo: rating.businessInfo,
      premium: rating.totalPremium,
      effectiveDate,
      expirationDate: format(addYears(new Date(effectiveDate), 1), 'yyyy-MM-dd'),
      status: 'draft',
      createdAt: new Date().toISOString(),
      notes
    };

    try {
      await saveQuote(newQuote);
      setQuote(newQuote);
      
      // Update application status to quoted
      await updateApplicationStatus(rating.id, 'quoted');
      
      // Notify parent components
      onQuoteGenerated?.();
      
      // Close dialog after short delay
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Error generating quote:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Generate Quote
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Business Information</h4>
                <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm text-gray-500">Business Name</dt>
                    <dd className="text-sm text-gray-900">{rating.businessInfo.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">FEIN</dt>
                    <dd className="text-sm text-gray-900">{rating.businessInfo.fein}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-medium text-gray-900">Premium</h4>
                <div className="mt-2 flex items-center gap-1 text-lg font-medium text-gray-900">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  {formatCurrency(rating.totalPremium)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Effective Date
                  </div>
                </label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add any additional notes or comments..."
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <div className="flex gap-2">
              {!quote ? (
                <button
                  onClick={handleGenerateQuote}
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto"
                >
                  Generate Quote
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto"
                >
                  View Quote
                </button>
              )}
              <button
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {quote && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
            <QuotePreview quote={quote} onClose={onClose} />
          </div>
        )}
      </div>
    </div>
  );
}