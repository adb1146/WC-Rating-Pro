import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { BusinessInfo } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface PremiumConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: BusinessInfo;
}

export function PremiumConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  data,
}: PremiumConfirmationDialogProps) {
  if (!isOpen) return null;

  const totalPayroll = data.payrollInfo.reduce((sum, info) => sum + info.annualPayroll, 0);
  const totalEmployees = data.payrollInfo.reduce((sum, info) => sum + info.employeeCount, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Confirm Premium Calculation
                </h3>
                
                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900">Business Information</h4>
                      <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        <div>
                          <dt className="text-sm text-gray-500">Business Name</dt>
                          <dd className="text-sm text-gray-900">{data.name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">FEIN</dt>
                          <dd className="text-sm text-gray-900">{data.fein}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Entity Type</dt>
                          <dd className="text-sm text-gray-900">{data.entityType}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Years in Business</dt>
                          <dd className="text-sm text-gray-900">{data.yearsInBusiness}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Locations</h4>
                      <div className="mt-2 space-y-2">
                        {data.locations.map((location, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {location.street1}
                            {location.street2 && `, ${location.street2}`}
                            , {location.city}, {location.state} {location.zipCode}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Payroll Summary</h4>
                      <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        <div>
                          <dt className="text-sm text-gray-500">Total Employees</dt>
                          <dd className="text-sm text-gray-900">{totalEmployees}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Total Annual Payroll</dt>
                          <dd className="text-sm text-gray-900">{formatCurrency(totalPayroll)}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900">Rating Factors</h4>
                      <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3">
                        <div>
                          <dt className="text-sm text-gray-500">Experience Mod</dt>
                          <dd className="text-sm text-gray-900">{data.modifiers.experienceMod}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Schedule Credit</dt>
                          <dd className="text-sm text-gray-900">{data.modifiers.scheduleCredit * 100}%</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500">Safety Credit</dt>
                          <dd className="text-sm text-gray-900">{data.modifiers.safetyCredit * 100}%</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto"
            >
              Calculate Premium
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}