import React, { useEffect } from 'react';
import { Plus, FileText, Clock, DollarSign, CheckCircle, XCircle, AlertCircle, FileTextIcon } from 'lucide-react';
import { SavedRating } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { QuoteDialog } from '../QuoteDialog';
import { QuoteList } from '../QuoteList';
import { RatingList } from '../RatingList';
import { HomeTutorial } from '../HomeTutorial';
import { getQuotes } from '../../utils/storage';

interface HomeTabProps {
  savedRatings: SavedRating[];
  onNewRating: () => void;
}

export function HomeTab({ savedRatings, onNewRating }: HomeTabProps) {
  const [selectedRating, setSelectedRating] = React.useState<SavedRating>();
  const [quotes, setQuotes] = React.useState([]);
  const [showTutorial, setShowTutorial] = React.useState(() => {
    const tutorialSeen = localStorage.getItem('homeTutorialSeen');
    return !tutorialSeen;
  });
  const [activeSection, setActiveSection] = React.useState<'ratings' | 'quotes'>('ratings');

  useEffect(() => {
    getQuotes().then(setQuotes).catch(console.error);
  }, []);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('homeTutorialSeen', 'true');
  };

  const handleQuoteGenerated = () => {
    // Refresh data and switch to quotes tab
    Promise.all([
      getQuotes().then(setQuotes),
      getRatings().then(setSavedRatings)
    ]).catch(console.error);
    
    setActiveSection('quotes');
  };

  const getStatusIcon = (status: SavedRating['status']) => {
    switch (status) {
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
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            localStorage.removeItem('homeTutorialSeen');
            setShowTutorial(true);
          }}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <AlertCircle className="w-4 h-4" />
          Show Tutorial
        </button>
      </div>
      {showTutorial && <HomeTutorial onClose={handleCloseTutorial} />}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex gap-4 px-6 py-3" aria-label="Tabs">
            <button
              onClick={() => setActiveSection('ratings')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeSection === 'ratings'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Applications
                <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {savedRatings.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveSection('quotes')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeSection === 'quotes'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileTextIcon className="w-4 h-4" />
                Quotes
                <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {quotes.length}
                </span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {activeSection === 'ratings' ? 'Insurance Applications' : 'Generated Quotes'}
            </h2>
            {activeSection === 'ratings' && (
              <button
                onClick={onNewRating}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                New Application
              </button>
            )}
          </div>

          {activeSection === 'ratings' ? (
            savedRatings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-500 mb-4">Start by creating a new insurance application</p>
                <button
                  onClick={onNewRating}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Create Application
                </button>
              </div>
            ) : (
              <RatingList
                ratings={savedRatings}
                onGenerateQuote={setSelectedRating}
              />
            )
          ) : (
            <QuoteList
              quotes={quotes}
              onStatusChange={() => setQuotes(getQuotes())}
            />
          )}
        </div>
      </div>

      <QuoteDialog
        rating={selectedRating}
        isOpen={!!selectedRating}
        onClose={() => setSelectedRating(undefined)}
        onQuoteGenerated={handleQuoteGenerated}
      />
    </div>
  );
}