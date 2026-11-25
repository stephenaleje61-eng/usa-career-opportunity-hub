export type EmploymentType =
  | 'Full-time'
  | 'Part-time'
  | 'Contract'
  | 'Internship'
  | 'Temporary'
  | 'Remote';

export type QualificationLevel =
  | 'High School / Trade'
  | 'Associate Degree'
  | "Bachelor's Degree"
  | "Master's / Doctoral"
  | 'Professional License / Certification';

export type ApplicationStatus = 'pending' | 'under_review' | 'shortlisted' | 'rejected';

export interface Department {
  code: string;
  name: string;
  summary: string;
}

export interface JobCategory {
  number: number;
  id: string;
  title: string;
  departmentCode: string;
  departmentName: string;
  requiredQualification: QualificationLevel;
  qualificationsSummary: string;
  supportedEmploymentTypes: EmploymentType[];
  overview: string;
}

export interface VerifiedVacancy {
  id: string;
  title: string;
  employerName: string;
  employerVerified: boolean;
  verificationLabel: 'Verified Employer' | 'Pending Verification';
  departmentCode: string;
  departmentName: string;
  categoryName: string;
  location: string;
  state: string;
  city: string;
  salaryRange: string;
  salaryVerified: boolean;
  salaryMinAnnual: number;
  employmentType: EmploymentType;
  requiredQualification: QualificationLevel;
  qualificationsDetail: string;
  description: string;
  deadline: string;
  status: 'Open' | 'Closed';
  createdByUid: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface JobApplication {
  id: string;
  applicantUid: string;
  applicantCode: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  departmentName: string;
  jobCategory: string;
  positionApplied: string;
  vacancyId: string;
  applicationType: 'Verified Vacancy' | 'General Career Category';
  education: string;
  experience: string;
  skills: string;
  coverLetter: string;
  linkedinUrl: string;
  cvFileName: string;
  cvFileType: string;
  cvFileSize: number;
  cvStorageType: 'storage' | 'firestore_fallback';
  cvStoragePath: string;
  cvDownloadUrl: string;
  consentAccepted: boolean;
  status: ApplicationStatus;
  adminNotes: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  country?: string;
  state?: string;
  city?: string;
  registeredAt?: unknown;
  updatedAt?: unknown;
}

export interface FavoriteJob {
  id: string;
  userId: string;
  itemType: 'category' | 'vacancy';
  itemId: string;
  title: string;
  departmentName: string;
  savedAt?: unknown;
}

export interface SupportInquiry {
  id: string;
  senderUid: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: 'Open' | 'Resolved';
  createdAt?: unknown;
}
