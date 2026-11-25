import type { EmploymentType, QualificationLevel } from '../types/career';

export const US_STATES: string[] = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'District of Columbia',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
  'Remote (Nationwide)'
];

export const COUNTRIES: string[] = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'India',
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'Philippines',
  'Brazil',
  'Mexico',
  'Colombia',
  'Japan',
  'South Korea',
  'Singapore',
  'United Arab Emirates',
  'Ireland',
  'Netherlands',
  'Other'
];

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Temporary',
  'Remote'
];

export const QUALIFICATION_LEVELS: QualificationLevel[] = [
  'High School / Trade',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's / Doctoral",
  'Professional License / Certification'
];

export const SALARY_FILTERS = [
  { label: 'All Salary Tiers', min: 0 },
  { label: '$40,000+ / yr (Verified)', min: 40000 },
  { label: '$65,000+ / yr (Verified)', min: 65000 },
  { label: '$90,000+ / yr (Verified)', min: 90000 },
  { label: '$120,000+ / yr (Verified)', min: 120000 }
];
