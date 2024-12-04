import { BusinessInfo } from '../types';

export const exampleBusinessInfo: BusinessInfo = {
  name: 'Acme Technology Solutions',
  entityType: 'corporation',
  fein: '12-3456789',
  yearsInBusiness: 5,
  description: 'Software development and IT consulting services company specializing in enterprise solutions, cloud computing, and digital transformation projects.',
  locations: [
    {
      street1: '100 Tech Plaza',
      street2: 'Suite 400',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105'
    },
    {
      street1: '200 Madison Avenue',
      street2: '15th Floor',
      city: 'New York',
      state: 'NY',
      zipCode: '10016'
    }
  ],
  contactEmail: 'info@acmetech.example.com',
  contactPhone: '(415) 555-0123',
  safetyPrograms: [
    {
      name: 'Ergonomic Assessment Program',
      implementationDate: '2023-01-15',
      lastReviewDate: '2023-12-01',
      description: 'Comprehensive workstation assessment and adjustment program',
      status: 'active'
    },
    {
      name: 'Emergency Response Plan',
      implementationDate: '2022-06-01',
      lastReviewDate: '2023-11-15',
      description: 'Detailed procedures for various emergency scenarios',
      status: 'active'
    }
  ],
  riskControls: [
    {
      hazardType: 'Repetitive Strain',
      controlMeasures: 'Ergonomic equipment, regular breaks, workstation assessments',
      lastAssessmentDate: '2023-11-01',
      responsiblePerson: 'Sarah Johnson',
      effectiveness: 'high'
    },
    {
      hazardType: 'Slip and Fall',
      controlMeasures: 'Non-slip mats, proper signage, regular maintenance',
      lastAssessmentDate: '2023-12-01',
      responsiblePerson: 'Mike Thompson',
      effectiveness: 'medium'
    }
  ],
  subcontractors: [
    {
      name: 'Clean Tech Services',
      workType: 'Facility Maintenance',
      certificateExpiration: '2024-12-31',
      annualCost: 75000,
      employeeCount: 5
    },
    {
      name: 'SecureIT Solutions',
      workType: 'IT Security Services',
      certificateExpiration: '2024-06-30',
      annualCost: 120000,
      employeeCount: 3
    }
  ],
  workforceMetrics: {
    turnoverRate: 0.15,
    avgTenure: 3.5,
    trainingHoursPerYear: 40,
    remoteWorkPercentage: 0.60
  },
  priorInsurance: [
    {
      carrier: 'ABC Insurance Company',
      policyNumber: 'WC-2023-45678',
      effectiveDate: '2023-01-01',
      expirationDate: '2023-12-31',
      premiumAmount: 125000
    },
    {
      carrier: 'XYZ Insurance Group',
      policyNumber: 'WC-2022-34567',
      effectiveDate: '2022-01-01',
      expirationDate: '2022-12-31',
      premiumAmount: 115000
    }
  ],
  lossHistory: [
    {
      date: '2023-06-15',
      type: 'medical_only',
      description: 'Employee reported repetitive strain injury from computer use',
      amount: 5000,
      status: 'closed',
      claimNumber: 'CLM-2023-001'
    },
    {
      date: '2022-09-20',
      type: 'indemnity',
      description: 'Slip and fall incident in office kitchen',
      amount: 15000,
      status: 'closed',
      claimNumber: 'CLM-2022-003'
    }
  ],
  payrollInfo: [
    {
      stateCode: 'CA',
      classCode: '8810',
      employeeCount: 50,
      annualPayroll: 5000000,
      jobDescription: 'Clerical office employees - software developers, project managers, administrative staff'
    },
    {
      stateCode: 'CA',
      classCode: '8742',
      employeeCount: 10,
      annualPayroll: 1500000,
      jobDescription: 'Outside sales representatives'
    },
    {
      stateCode: 'NY',
      classCode: '8810',
      employeeCount: 30,
      annualPayroll: 3000000,
      jobDescription: 'Clerical office employees - software developers, project managers, administrative staff'
    }
  ],
  modifiers: {
    experienceMod: 0.85,
    scheduleCredit: 0.1,
    safetyCredit: 0.05,
    supplementalCoverages: [
      {
        id: 'aircraft_passenger',
        name: 'Aircraft Passenger Coverage',
        description: 'Coverage for employees while occupying, entering, or exiting aircraft used in business operations',
        premium: 5000,
        selected: true,
        required: false,
        limits: {
          perOccurrence: 5000000,
          aggregate: 10000000
        }
      },
      {
        id: 'aircraft_crew',
        name: 'Aircraft Crew Coverage',
        description: 'Specialized coverage for pilots and crew members operating company aircraft',
        premium: 7500,
        selected: false,
        required: false,
        limits: {
          perOccurrence: 5000000,
          aggregate: 10000000
        }
      },
      {
        id: 'usl&h',
        name: 'USL&H Coverage',
        description: 'Coverage for maritime workers under the United States Longshore and Harbor Workers Compensation Act',
        premium: 2500,
        selected: false,
        required: false,
        limits: {
          perOccurrence: 1000000,
          aggregate: 2000000
        }
      },
      {
        id: 'voluntary_comp',
        name: 'Voluntary Compensation',
        description: 'Extends coverage to employees not subject to state workers compensation laws',
        premium: 1500,
        selected: true,
        required: false,
        limits: {
          perOccurrence: 1000000,
          aggregate: 1000000
        }
      },
      {
        id: 'foreign_coverage',
        name: 'Foreign Coverage',
        description: 'Coverage for employees temporarily working outside the United States',
        premium: 3000,
        selected: true,
        required: false,
        limits: {
          perOccurrence: 1000000,
          aggregate: 2000000
        }
      },
      {
        id: 'stop_gap',
        name: 'Stop Gap Coverage',
        description: 'Employers liability coverage for monopolistic state operations',
        premium: 2000,
        selected: false,
        required: false,
        limits: {
          perOccurrence: 1000000,
          aggregate: 1000000
        }
      }
    ]
  }
};