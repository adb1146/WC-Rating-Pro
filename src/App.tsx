import React from 'react';
import { Play, Settings, Brain, HelpCircle, Shield, LogOut } from 'lucide-react';
import { BusinessForm } from './components/BusinessForm';
import { LocationForm } from './components/LocationForm';
import { PriorInsuranceForm } from './components/PriorInsuranceForm';
import { LossHistoryForm } from './components/LossHistoryForm';
import { SafetyProgramForm } from './components/SafetyProgramForm';
import { RiskControlForm } from './components/RiskControlForm';
import { SubcontractorForm } from './components/SubcontractorForm';
import { WorkforceMetricsForm } from './components/WorkforceMetricsForm';
import { HelpTab } from './components/HelpTab';
import { PayrollForm } from './components/PayrollForm';
import { PremiumCalculation } from './components/PremiumCalculation';
import { BusinessInfo, SavedRating } from './types';
import { FormProgress } from './components/FormProgress';
import { exampleBusinessInfo } from './utils/exampleData';
import { HomeTab } from './components/HomeTab';
import { UnifiedAIAssistant } from './components/UnifiedAIAssistant';
import { AITutorial } from './components/AITutorial';
import { TutorialProvider } from './components/TutorialContext';
import { saveRating, getRatings } from './utils/storage';
import { PSAdvisoryLogo } from './components/PSAdvisoryLogo';
import { supabase } from './utils/supabase';

const initialBusinessInfo: BusinessInfo = {
  name: '',
  entityType: 'corporation',
  fein: '',
  yearsInBusiness: 0,
  description: '',
  locations: [],
  contactEmail: '',
  contactPhone: '',
  safetyPrograms: [],
  riskControls: [],
  subcontractors: [],
  workforceMetrics: {
    turnoverRate: 0,
    avgTenure: 0,
    trainingHoursPerYear: 0,
    remoteWorkPercentage: 0
  },
  priorInsurance: [],
  lossHistory: [],
  payrollInfo: [], 
  modifiers: {
    experienceMod: 1.0,
    scheduleCredit: 0,
    safetyCredit: 0,
  },
};

function App() {
  const [businessInfo, setBusinessInfo] = React.useState<BusinessInfo>(initialBusinessInfo);
  const [currentSection, setCurrentSection] = React.useState('business');
  const [activeTab, setActiveTab] = React.useState<'home' | 'new' | 'help'>('home');
  const [showAIAssistant, setShowAIAssistant] = React.useState(true);
  const [savedRatings, setSavedRatings] = React.useState<SavedRating[]>([]);
  const [showTutorial, setShowTutorial] = React.useState(() => {
    const tutorialSeen = localStorage.getItem('tutorialSeen');
    return !tutorialSeen;
  });

  React.useEffect(() => {
    getRatings().then(setSavedRatings).catch(console.error);
  }, []);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('tutorialSeen', 'true');
  };

  const handleSaveRating = async (premium: number) => {
    const newRating: SavedRating = {
      id: Date.now().toString(),
      businessInfo: { ...businessInfo },
      savedAt: new Date().toISOString(),
      totalPremium: premium,
      status: 'draft'
    };
    
    try {
      await saveRating(newRating);
      const updatedRatings = await getRatings();
      setSavedRatings(updatedRatings);
    } catch (error) {
      console.error('Error saving rating:', error);
    }
    
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-6">
                <PSAdvisoryLogo />
                <div className="h-8 w-px bg-gray-200" />
                <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">
                  WC Rating Pro
                </h1>
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'home'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveTab('new')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'new'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  New Rating
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('help')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'help'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Help
              </button>
              {activeTab === 'new' && (
                <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAIAssistant(!showAIAssistant)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  <Brain className="w-4 h-4" />
                  {showAIAssistant ? 'Hide AI Assistant' : 'Show AI Assistant'}
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('tutorialSeen');
                    setShowTutorial(true);
                  }}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  <HelpCircle className="w-4 h-4" />
                  Show Guide
                </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' ? (
          <HomeTab
            savedRatings={savedRatings}
            onNewRating={() => setActiveTab('new')}
          />
        ) : activeTab === 'help' ? (
          <HelpTab />
        ) : (
        <div>
          {showTutorial && activeTab === 'new' && (
            <AITutorial onClose={handleCloseTutorial} />
          )}
          <div className="mb-6 flex justify-end">
            <div className="flex gap-2">
              <button
                onClick={() => setBusinessInfo(initialBusinessInfo)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Reset Form
              </button>
              <button
                onClick={() => setBusinessInfo(exampleBusinessInfo)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Play className="w-4 h-4" />
                Load Example Data
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8">
          <FormProgress
            data={businessInfo}
            currentSection={currentSection}
            onNavigate={setCurrentSection}
          />
          <BusinessForm
            data={businessInfo}
            onChange={setBusinessInfo}
          />
          <LocationForm
            locations={businessInfo.locations}
            businessInfo={businessInfo}
            onChange={(locations) => setBusinessInfo({ ...businessInfo, locations })}
          />
          <SafetyProgramForm
            safetyPrograms={businessInfo.safetyPrograms}
            onChange={(safetyPrograms) => setBusinessInfo({ ...businessInfo, safetyPrograms })}
          />
          <RiskControlForm
            riskControls={businessInfo.riskControls}
            onChange={(riskControls) => setBusinessInfo({ ...businessInfo, riskControls })}
          />
          <SubcontractorForm
            subcontractors={businessInfo.subcontractors}
            onChange={(subcontractors) => setBusinessInfo({ ...businessInfo, subcontractors })}
          />
          <WorkforceMetricsForm
            data={businessInfo.workforceMetrics}
            onChange={(workforceMetrics) => setBusinessInfo({ ...businessInfo, workforceMetrics })}
          />
          <PriorInsuranceForm
            priorInsurance={businessInfo.priorInsurance}
            onChange={(priorInsurance) => setBusinessInfo({ ...businessInfo, priorInsurance })}
          />
          <LossHistoryForm
            lossHistory={businessInfo.lossHistory}
            onChange={(lossHistory) => setBusinessInfo({ ...businessInfo, lossHistory })}
          />
          <PayrollForm
            payrollInfo={businessInfo.payrollInfo}
            onChange={(payrollInfo) => setBusinessInfo({ ...businessInfo, payrollInfo })}
          />
          <PremiumCalculation
            data={businessInfo}
            onChange={setBusinessInfo}
            onSave={handleSaveRating}
          />
          </div>
        </div>
        )}
        {activeTab === 'new' && showAIAssistant && (
          <UnifiedAIAssistant
            businessInfo={businessInfo}
            currentSection={currentSection}
          />
        )}
      </main>
    </div>
  );
}

export default App;