import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  auth,
  db,
  handleFirestoreError,
  OperationType,
  PRIMARY_ADMIN_EMAIL,
  reportFirestoreError,
  storage
} from './firebase';
import type {
  ApplicationStatus,
  FavoriteJob,
  JobApplication,
  SupportInquiry,
  UserProfile,
  VerifiedVacancy
} from '../types/career';

export const MAX_CV_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_CV_EXTENSIONS = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
const ALLOWED_CV_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/jpg'
]);

export function validateCvFile(file: File | null): string | null {
  if (!file) {
    return 'Please upload your CV or Resume (PDF, DOC, DOCX, PNG, or JPG, max 5 MB).';
  }
  if (file.size <= 0) {
    return 'The selected CV file is empty. Please choose a valid file.';
  }
  if (file.size > MAX_CV_FILE_SIZE_BYTES) {
    return 'CV file size exceeds the 5 MB maximum limit. Please compress or upload a smaller file.';
  }
  const trimmedName = file.name.trim();
  const lowerName = trimmedName.toLowerCase();
  const hasValidExt = ALLOWED_CV_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  const dotIdx = trimmedName.lastIndexOf('.');
  const baseName = dotIdx > 0 ? trimmedName.slice(0, dotIdx).trim() : '';
  const mime = (file.type || '').toLowerCase();
  const hasValidMime =
    ALLOWED_CV_MIME_TYPES.has(mime) || mime === '' || mime === 'application/octet-stream';

  if (!hasValidExt || !baseName || !hasValidMime) {
    return 'Unsupported file format. Only valid PDF, DOC, DOCX, PNG, and JPG files are allowed.';
  }
  return null;
}

function clampStr(val: string, maxLen: number): string {
  return (val || '').trim().slice(0, maxLen);
}

function makeId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${rand}`.replace(/[^a-zA-Z0-9_-]/g, '');
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read CV file from device.'));
    reader.readAsDataURL(file);
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number, timeoutMessage: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, ms);
    promise.then(
      (val) => {
        clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

function getTimestampMillis(ts: unknown): number {
  if (
    ts &&
    typeof ts === 'object' &&
    'toMillis' in ts &&
    typeof (ts as { toMillis: () => number }).toMillis === 'function'
  ) {
    return (ts as { toMillis: () => number }).toMillis();
  }
  return 0;
}

export async function checkIsAdmin(user: User | null): Promise<boolean> {
  if (!user || !user.emailVerified) return false;
  if (user.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
    return true;
  }
  try {
    const snap = await getDoc(doc(db, 'admins', user.uid));
    return snap.exists();
  } catch {
    return false;
  }
}

export async function ensureUserProfile(
  user: User,
  overrides?: { country?: string; state?: string; city?: string; displayName?: string }
): Promise<void> {
  if (!user.uid || !user.email) return;
  const path = `users/${user.uid}`;
  const userRef = doc(db, 'users', user.uid);
  try {
    const existingSnap = await getDoc(userRef);
    if (!existingSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: clampStr(overrides?.displayName || user.displayName || 'Applicant', 120),
        email: clampStr(user.email, 160),
        country: clampStr(overrides?.country || '', 100),
        state: clampStr(overrides?.state || '', 100),
        city: clampStr(overrides?.city || '', 100),
        registeredAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else if (
      overrides &&
      (overrides.country !== undefined ||
        overrides.state !== undefined ||
        overrides.city !== undefined ||
        overrides.displayName !== undefined)
    ) {
      const prev = existingSnap.data();
      await updateDoc(userRef, {
        displayName: clampStr(
          overrides.displayName || prev.displayName || user.displayName || 'Applicant',
          120
        ),
        country: clampStr(overrides.country ?? prev.country ?? '', 100),
        state: clampStr(overrides.state ?? prev.state ?? '', 100),
        city: clampStr(overrides.city ?? prev.city ?? '', 100),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToUserProfile(
  uid: string,
  onData: (profile: UserProfile | null) => void,
  onError?: (message: string) => void
): Unsubscribe {
  const path = `users/${uid}`;
  return onSnapshot(
    doc(db, 'users', uid),
    (snap) => {
      onData(snap.exists() ? (snap.data() as UserProfile) : null);
    },
    (error) => {
      const msg = reportFirestoreError(error, OperationType.GET, path);
      onError?.(msg);
    }
  );
}

export interface SubmitApplicationInput {
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
  consentAccepted: boolean;
  cvFile: File;
}

function resolveMimeType(file: File): string {
  if (file.type && ALLOWED_CV_MIME_TYPES.has(file.type.toLowerCase())) {
    return file.type;
  }
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.doc')) return 'application/msword';
  if (lower.endsWith('.docx')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  return 'application/octet-stream';
}

export async function submitJobApplication(input: SubmitApplicationInput): Promise<{
  applicationId: string;
  applicantCode: string;
}> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Please sign in with your Google account before submitting your application.');
  }
  if (!user.emailVerified) {
    throw new Error('A verified email account is required to submit an application.');
  }

  const fileError = validateCvFile(input.cvFile);
  if (fileError) {
    throw new Error(fileError);
  }

  await ensureUserProfile(user, {
    displayName: input.fullName,
    country: input.country,
    state: input.state,
    city: input.city
  });

  const applicationId = makeId('app');
  const year = new Date().getFullYear();
  const codeSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const applicantCode = `USA-${year}-${codeSuffix}`;

  let safeFileName =
    clampStr(input.cvFile.name.replace(/[^a-zA-Z0-9._-]/g, '_'), 260) || 'cv_resume.pdf';
  if (safeFileName.length < 5) {
    safeFileName = `cv_${safeFileName}`;
  }
  const fileType = clampStr(resolveMimeType(input.cvFile), 120);
  const fileSize = input.cvFile.size;

  // Step 1: Upload CV to Firebase Storage folder "cvs/" BEFORE saving the application
  let cvStorageType: 'storage' | 'firestore_fallback' = 'storage';
  let cvStoragePath = `cvs/${user.uid}/${applicationId}_${safeFileName}`;
  let cvDownloadUrl = '';

  try {
    const storageRef = ref(storage, cvStoragePath);
    await withTimeout(
      (async () => {
        await uploadBytes(storageRef, input.cvFile, { contentType: fileType });
        cvDownloadUrl = await getDownloadURL(storageRef);
      })(),
      4500,
      'Firebase Storage upload timed out.'
    );
  } catch (storageErr) {
    console.warn('Primary Firebase Storage upload to cvs/ failed, checking secure fallback:', storageErr);
    if (fileSize > 700000) {
      const reason = storageErr instanceof Error ? storageErr.message : 'Storage unavailable';
      throw new Error(
        `Unable to upload CV to Firebase Storage (${reason}). Please verify Firebase Storage is enabled for this project or upload a CV under 700 KB.`
      );
    }
    const base64Data = await fileToBase64(input.cvFile);
    const fileDocPath = `applicationFiles/${applicationId}`;
    try {
      await setDoc(doc(db, 'applicationFiles', applicationId), {
        applicationId,
        applicantUid: user.uid,
        fileName: safeFileName,
        mimeType: fileType,
        fileSize,
        base64Data,
        createdAt: serverTimestamp()
      });
      cvStorageType = 'firestore_fallback';
      cvStoragePath = fileDocPath;
      cvDownloadUrl = `firestore-fallback://${fileDocPath}`;
    } catch (fallbackErr) {
      handleFirestoreError(fallbackErr, OperationType.CREATE, fileDocPath);
    }
  }

  // Step 2: Save full application payload to Firestore collection "job_applications"
  const appPath = `job_applications/${applicationId}`;
  try {
    await setDoc(doc(db, 'job_applications', applicationId), {
      applicantUid: user.uid,
      applicantCode,
      fullName: clampStr(input.fullName, 120),
      email: clampStr(input.email, 160),
      phone: clampStr(input.phone, 40),
      country: clampStr(input.country, 100),
      state: clampStr(input.state || 'N/A', 100),
      city: clampStr(input.city || 'N/A', 100),
      departmentName: clampStr(input.departmentName, 100),
      jobCategory: clampStr(input.jobCategory, 120),
      positionApplied: clampStr(input.positionApplied, 160),
      vacancyId: clampStr(input.vacancyId || 'general-category', 128),
      applicationType: input.applicationType,
      education: clampStr(input.education, 200),
      experience: clampStr(input.experience, 3000),
      skills: clampStr(input.skills, 1000),
      coverLetter: clampStr(input.coverLetter, 4000),
      linkedinUrl: clampStr(input.linkedinUrl, 300),
      cvFileName: safeFileName,
      cvFileType: fileType,
      cvFileSize: fileSize,
      cvStorageType,
      cvStoragePath: clampStr(cvStoragePath, 500),
      cvDownloadUrl: clampStr(cvDownloadUrl, 2000),
      consentAccepted: true,
      status: 'pending',
      adminNotes: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, appPath);
  }

  return { applicationId, applicantCode };
}

export async function downloadApplicationCv(application: JobApplication): Promise<void> {
  if (
    application.cvStorageType === 'storage' &&
    application.cvDownloadUrl &&
    !application.cvDownloadUrl.startsWith('firestore-fallback://')
  ) {
    const link = document.createElement('a');
    link.href = application.cvDownloadUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = application.cvFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  const path = `applicationFiles/${application.id}`;
  try {
    const snap = await getDoc(doc(db, 'applicationFiles', application.id));
    if (!snap.exists()) {
      throw new Error('Uploaded CV file could not be located.');
    }
    const data = snap.data() as { base64Data: string; mimeType: string; fileName: string };
    const cleanBase64 = (data.base64Data || '').replace(/\s/g, '');
    const binaryStr = atob(cleanBase64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: data.mimeType || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = data.fileName || application.cvFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function subscribeToVacancies(
  includeClosedForAdmin: boolean,
  onData: (vacancies: VerifiedVacancy[]) => void,
  onError?: (message: string) => void
): Unsubscribe {
  const path = 'vacancies';
  const q = includeClosedForAdmin
    ? query(collection(db, path), orderBy('createdAt', 'desc'))
    : query(collection(db, path), where('status', '==', 'Open'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: VerifiedVacancy[] = snapshot.docs.map((d) => ({
        ...(d.data() as Omit<VerifiedVacancy, 'id'>),
        id: d.id
      }));
      onData(items);
    },
    (error) => {
      const msg = reportFirestoreError(error, OperationType.LIST, path);
      onError?.(msg);
    }
  );
}

export async function saveVerifiedVacancy(
  payload: Omit<VerifiedVacancy, 'id' | 'createdByUid' | 'createdAt' | 'updatedAt'>,
  existingId?: string
): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Administrator sign-in required.');

  const id = existingId || makeId('vac');
  const path = `vacancies/${id}`;
  const docRef = doc(db, 'vacancies', id);

  try {
    if (existingId) {
      await updateDoc(docRef, {
        title: clampStr(payload.title, 160),
        employerName: clampStr(payload.employerName, 160),
        employerVerified: payload.employerVerified,
        verificationLabel: payload.verificationLabel,
        departmentCode: clampStr(payload.departmentCode, 10),
        departmentName: clampStr(payload.departmentName, 100),
        categoryName: clampStr(payload.categoryName, 120),
        location: clampStr(payload.location, 160),
        state: clampStr(payload.state, 60),
        city: clampStr(payload.city, 100),
        salaryRange: clampStr(payload.salaryRange, 100),
        salaryVerified: payload.salaryVerified,
        salaryMinAnnual: Math.min(10000000, Math.max(0, Number(payload.salaryMinAnnual) || 0)),
        employmentType: payload.employmentType,
        requiredQualification: payload.requiredQualification,
        qualificationsDetail: clampStr(payload.qualificationsDetail, 1000),
        description: clampStr(payload.description, 4000),
        deadline: clampStr(payload.deadline, 30),
        status: payload.status,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(docRef, {
        id,
        title: clampStr(payload.title, 160),
        employerName: clampStr(payload.employerName, 160),
        employerVerified: payload.employerVerified,
        verificationLabel: payload.verificationLabel,
        departmentCode: clampStr(payload.departmentCode, 10),
        departmentName: clampStr(payload.departmentName, 100),
        categoryName: clampStr(payload.categoryName, 120),
        location: clampStr(payload.location, 160),
        state: clampStr(payload.state, 60),
        city: clampStr(payload.city, 100),
        salaryRange: clampStr(payload.salaryRange, 100),
        salaryVerified: payload.salaryVerified,
        salaryMinAnnual: Math.min(10000000, Math.max(0, Number(payload.salaryMinAnnual) || 0)),
        employmentType: payload.employmentType,
        requiredQualification: payload.requiredQualification,
        qualificationsDetail: clampStr(payload.qualificationsDetail, 1000),
        description: clampStr(payload.description, 4000),
        deadline: clampStr(payload.deadline, 30),
        status: payload.status,
        createdByUid: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    return id;
  } catch (error) {
    handleFirestoreError(error, existingId ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

export async function deleteVacancy(vacancyId: string): Promise<void> {
  const path = `vacancies/${vacancyId}`;
  try {
    await deleteDoc(doc(db, 'vacancies', vacancyId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToUserApplications(
  uid: string,
  onData: (apps: JobApplication[]) => void,
  onError?: (message: string) => void
): Unsubscribe {
  const path = 'job_applications';
  const q = query(collection(db, path), where('applicantUid', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      const apps: JobApplication[] = snapshot.docs
        .map((d) => ({
          ...(d.data() as Omit<JobApplication, 'id'>),
          id: d.id
        }))
        .sort((a, b) => getTimestampMillis(b.createdAt) - getTimestampMillis(a.createdAt));
      onData(apps);
    },
    (error) => {
      const msg = reportFirestoreError(error, OperationType.LIST, path);
      onError?.(msg);
    }
  );
}

export function subscribeToAllApplications(
  onData: (apps: JobApplication[]) => void,
  onError?: (message: string) => void
): Unsubscribe {
  const path = 'job_applications';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const apps: JobApplication[] = snapshot.docs.map((d) => ({
        ...(d.data() as Omit<JobApplication, 'id'>),
        id: d.id
      }));
      onData(apps);
    },
    (error) => {
      const msg = reportFirestoreError(error, OperationType.LIST, path);
      onError?.(msg);
    }
  );
}

export function subscribeToAllUsers(
  onData: (users: UserProfile[]) => void,
  onError?: (message: string) => void
): Unsubscribe {
  const path = 'users';
  const q = query(collection(db, path), orderBy('registeredAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const users: UserProfile[] = snapshot.docs.map((d) => d.data() as UserProfile);
      onData(users);
    },
    (error) => {
      const msg = reportFirestoreError(error, OperationType.LIST, path);
      onError?.(msg);
    }
  );
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  adminNotes: string
): Promise<void> {
  const path = `job_applications/${applicationId}`;
  try {
    await updateDoc(doc(db, 'job_applications', applicationId), {
      status,
      adminNotes: clampStr(adminNotes, 2000),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteApplicationRecord(application: JobApplication): Promise<void> {
  const path = `job_applications/${application.id}`;
  try {
    await deleteDoc(doc(db, 'job_applications', application.id));
    if (application.cvStorageType === 'firestore_fallback') {
      await deleteDoc(doc(db, 'applicationFiles', application.id)).catch(() => undefined);
    } else if (application.cvStoragePath) {
      await deleteObject(ref(storage, application.cvStoragePath)).catch(() => undefined);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToFavorites(
  uid: string,
  onData: (favorites: FavoriteJob[]) => void,
  onError?: (message: string) => void
): Unsubscribe {
  const path = `users/${uid}/favorites`;
  return onSnapshot(
    collection(db, 'users', uid, 'favorites'),
    (snapshot) => {
      const items: FavoriteJob[] = snapshot.docs.map((d) => d.data() as FavoriteJob);
      onData(items);
    },
    (error) => {
      const msg = reportFirestoreError(error, OperationType.LIST, path);
      onError?.(msg);
    }
  );
}

export async function toggleFavoriteJob(
  uid: string,
  item: { itemType: 'category' | 'vacancy'; itemId: string; title: string; departmentName: string },
  currentlySaved: boolean
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in required to save favorites.');

  await ensureUserProfile(user);

  const favId = item.itemId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `users/${uid}/favorites/${favId}`;
  const favRef = doc(db, 'users', uid, 'favorites', favId);

  try {
    if (currentlySaved) {
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, {
        id: favId,
        userId: uid,
        itemType: item.itemType,
        itemId: clampStr(item.itemId, 128),
        title: clampStr(item.title, 160),
        departmentName: clampStr(item.departmentName, 120),
        savedAt: serverTimestamp()
      });
    }
  } catch (error) {
    handleFirestoreError(error, currentlySaved ? OperationType.DELETE : OperationType.CREATE, path);
  }
}

export async function submitSupportInquiry(input: {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}): Promise<string> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) {
    throw new Error('Please sign in with your verified Google account to submit a support inquiry.');
  }
  const id = makeId('sup');
  const path = `supportMessages/${id}`;
  try {
    await setDoc(doc(db, 'supportMessages', id), {
      senderUid: user.uid,
      fullName: clampStr(input.fullName, 120),
      email: clampStr(input.email, 160),
      subject: clampStr(input.subject, 200),
      message: clampStr(input.message, 3000),
      status: 'Open',
      createdAt: serverTimestamp()
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateSupportInquiryStatus(
  inquiryId: string,
  status: 'Open' | 'Resolved'
): Promise<void> {
  const path = `supportMessages/${inquiryId}`;
  try {
    await updateDoc(doc(db, 'supportMessages', inquiryId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export function subscribeToSupportInquiries(
  isAdmin: boolean,
  uid: string,
  onData: (items: SupportInquiry[]) => void,
  onError?: (message: string) => void
): Unsubscribe {
  const path = 'supportMessages';
  const q = isAdmin
    ? query(collection(db, path), orderBy('createdAt', 'desc'))
    : query(collection(db, path), where('senderUid', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: SupportInquiry[] = snapshot.docs.map((d) => ({
        ...(d.data() as Omit<SupportInquiry, 'id'>),
        id: d.id
      }));
      onData(items);
    },
    (error) => {
      const msg = reportFirestoreError(error, OperationType.LIST, path);
      onError?.(msg);
    }
  );
}
