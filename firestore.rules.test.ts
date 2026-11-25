/**
 * Security Rule Verification Matrix for USA Career & Opportunity Hub
 * Documents the Dirty Dozen adversarial payloads enforced by firestore.rules.
 */

export interface DirtyDozenScenario {
  id: number;
  name: string;
  collectionPath: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  expectedResult: 'PERMISSION_DENIED';
  enforcedBy: string;
}

export const DIRTY_DOZEN_SCENARIOS: DirtyDozenScenario[] = [
  {
    id: 1,
    name: 'Unauthenticated Application Read',
    collectionPath: '/job_applications/app_001',
    operation: 'get',
    expectedResult: 'PERMISSION_DENIED',
    enforcedBy: 'isSignedIn() && request.auth.token.email_verified == true'
  },
  {
    id: 2,
    name: 'Cross-Applicant PII Snooping',
    collectionPath: '/job_applications/app_of_user_b',
    operation: 'get',
    expectedResult: 'PERMISSION_DENIED',
    enforcedBy: 'isAdmin() || existing().applicantUid == request.auth.uid'
  },
  {
    id: 3,
    name: 'Blanket List Query Scraping',
    collectionPath: '/job_applications',
    operation: 'list',
    expectedResult: 'PERMISSION_DENIED',
    enforcedBy: 'isPrimaryAdmin() || resource.data.applicantUid == request.auth.uid'
  },
  {
    id: 4,
    name: 'Identity Spoofing on Create',
    collectionPath: '/job_applications/app_spoof',
    operation: 'create',
    expectedResult: 'PERMISSION_DENIED',
    enforcedBy: 'incoming().applicantUid == request.auth.uid'
  },
  {
    id: 5,
    name: 'Status Shortcutting on Create',
    collectionPath: '/job_applications/app_short',
    operation: 'create',
    expectedResult: 'PERMISSION_DENIED',
    enforcedBy: "incoming().status == 'pending'"
  },
  {
    id: 6,
    name: 'Shadow Field Injection',
    collectionPath: '/job_applications/app_shadow',
    operation: 'create',
    expectedResult: 'PERMISSION_DENIED',
    enforcedBy: 'isValidJobApplication(incoming()) keys().hasOnly(...)'
  },
  {
    id: 7,
    name: 'Self-Service Status Escalation',
    collectionPath: '/job_applications/app_own',
    operation: 'update',
    expectedResult: 'PERMISSION_DENIED',
    enforcedBy: 'allow update: if isAdmin() && ...'
  },
  {
    id: 8,
    name: 'Privilege Escalation to Admin',
    collectionPath: '/admins/attacker_uid',
    operation: 'create',
    expectedResult: 'PERMISSION_DENIED',
    enforcedBy: 'allow create: if isPrimaryAdmin()'
  },
  {
    id: 9,
    name: 'Spoofed Unverified Email Admin Claim',
    collectionPath: '/job_applications',
    operation: 'list',
    expectedResult: 'PERMISSION_DENIED',
    enforcedBy: 'request.auth.token.email_verified == true'
  },
  {
    id: 10,
    name: 'Fake Vacancy Injection by Non-Admin',
    collectionPath: '/vacancies/fake_job',
    operation: 'create',
    expectedResult: 'PERMISSION_DENIED',
    enforcedBy: 'allow create: if isAdmin()'
  },
  {
    id: 11,
    name: 'Path ID Poisoning / DoW',
    collectionPath: '/job_applications/invalid$$id',
    operation: 'create',
    expectedResult: 'PERMISSION_DENIED',
    enforcedBy: 'isValidId(applicationId)'
  },
  {
    id: 12,
    name: 'Client Timestamp Forgery',
    collectionPath: '/job_applications/app_backdated',
    operation: 'create',
    expectedResult: 'PERMISSION_DENIED',
    enforcedBy: 'incoming().createdAt == request.time'
  }
];
