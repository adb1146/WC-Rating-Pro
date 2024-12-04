import React from 'react';
import { Quote } from '../../types'; 
import { format } from 'date-fns'; 
import { formatCurrency } from '../../utils/formatters'; 
import { PSAdvisoryLogo } from '../PSAdvisoryLogo';
import { Printer } from 'lucide-react';

interface QuotePreviewProps {
  quote: Quote;
  onClose: () => void;
}

export function QuotePreview({ quote, onClose }: QuotePreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg print:shadow-none print:p-0">
      <div className="fixed top-4 right-4 print:hidden">
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-md shadow-sm hover:bg-gray-50 border border-gray-200"
          >
            <Printer className="w-4 h-4" />
            Print Quote
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-md shadow-sm hover:bg-gray-50 border border-gray-200"
          >
            Close
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8 print:mb-6">
        <div className="flex items-center gap-6 print:gap-4">
          <PSAdvisoryLogo />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workers' Compensation Insurance Quote</h1>
            <p className="text-sm text-gray-500 mt-1">Powered by AI Risk Assessment</p>
          </div>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center px-2.5 py-1 bg-blue-600 text-white text-sm font-medium rounded print:bg-blue-600">
            Quote #{quote.quoteNumber}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Generated: {format(new Date(quote.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-8 print:gap-6">
        {/* Business Information */}
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-blue-600 border-b border-gray-200 pb-2 mb-4 print:text-blue-600">
              Business Information
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{quote.businessInfo.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">FEIN</dt>
                <dd className="mt-1 text-sm text-gray-900">{quote.businessInfo.fein}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Entity Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{quote.businessInfo.entityType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Years in Business</dt>
                <dd className="mt-1 text-sm text-gray-900">{quote.businessInfo.yearsInBusiness}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{quote.businessInfo.description}</dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-blue-600 border-b border-gray-200 pb-2 mb-4">
              Coverage Details
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Policy Period</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(quote.effectiveDate), 'MMM d, yyyy')} - {format(new Date(quote.expirationDate), 'MMM d, yyyy')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Coverage Type</dt>
                <dd className="mt-1 text-sm text-gray-900">Workers' Compensation & Employer's Liability</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Policy Limits</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <ul className="list-disc list-inside">
                    <li>Workers' Compensation: Statutory</li>
                    <li>Employer's Liability: $1,000,000/$1,000,000/$1,000,000</li>
                  </ul>
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Premium Information */}
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-blue-600 border-b border-gray-200 pb-2 mb-4">
              Premium Calculation
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Experience Modification Factor</dt>
                <dd className="mt-1 text-sm text-gray-900">{quote.businessInfo.modifiers.experienceMod}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Schedule Credit</dt>
                <dd className="mt-1 text-sm text-gray-900">{(quote.businessInfo.modifiers.scheduleCredit * 100).toFixed(2)}%</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Safety Credit</dt>
                <dd className="mt-1 text-sm text-gray-900">{(quote.businessInfo.modifiers.safetyCredit * 100).toFixed(2)}%</dd>
              </div>
            </dl>
            <div className="mt-6 p-4 bg-blue-600 text-white rounded-md print:bg-blue-600 print:text-white">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Annual Premium:</span>
                <span className="text-xl font-bold">{formatCurrency(quote.premium)}</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-blue-600 border-b border-gray-200 pb-2 mb-4">
              Locations & Operations
            </h2>
            {quote.businessInfo.locations.map((location, index) => (
              <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-600">
                <p className="font-medium text-gray-900">Location {index + 1}</p>
                <p className="text-sm text-gray-600">{location.street1}</p>
                {location.street2 && <p className="text-sm text-gray-600">{location.street2}</p>}
                <p className="text-sm text-gray-600">{location.city}, {location.state} {location.zipCode}</p>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* Payroll Information */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-blue-600 border-b border-gray-200 pb-2 mb-4">
          Payroll Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {quote.businessInfo.payrollInfo.map((info, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-600">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Class Code {info.classCode}</span>
                <span className="text-blue-600 font-medium">{formatCurrency(info.annualPayroll)}</span>
              </div>
              <p className="text-sm text-gray-600">{info.employeeCount} Employees</p>
              <p className="text-sm text-gray-600">{info.jobDescription}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Notes */}
      {quote.notes && (
        <section className="mt-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-blue-600 border-b border-gray-200 pb-2 mb-4">
                Additional Notes
              </h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{quote.notes}</p>
              </div>
            </div>

            {quote.businessInfo.modifiers.supplementalCoverages?.some(c => c.selected) && (
              <div>
                <h2 className="text-lg font-semibold text-blue-600 border-b border-gray-200 pb-2 mb-4">
                  Supplemental Coverages
                </h2>
                <div className="space-y-4">
                  {quote.businessInfo.modifiers.supplementalCoverages
                    .filter(coverage => coverage.selected)
                    .map(coverage => (
                      <div key={coverage.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{coverage.name}</h4>
                            <p className="text-sm text-gray-600">{coverage.description}</p>
                          </div>
                          <span className="text-sm font-medium text-blue-600">
                            {formatCurrency(coverage.premium)}
                          </span>
                        </div>
                        {coverage.limits && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Limits: </span>
                            {formatCurrency(coverage.limits.perOccurrence)} per occurrence / {formatCurrency(coverage.limits.aggregate)} aggregate
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500 print:mt-8">
        <p className="font-medium text-blue-600 mb-2">
          PS Advisory Workers' Compensation Insurance Rating System
        </p>
        <p className="mb-2">
          This quote is valid for 30 days from {format(new Date(quote.createdAt), 'MMMM d, yyyy')}.
        </p>
        <p className="text-xs">
          This quote is based on the information provided and is subject to verification and underwriting review. 
          Final premium may vary based on actual payroll, claims experience, and other factors.
          This is not a binder of insurance coverage.
        </p>
      </footer>
    </div>
  );
}