import React, { useEffect, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Lock,
  Upload,
  X
} from 'lucide-react';
import { JOB_CATEGORIES } from '../data/categories';
import { COUNTRIES, US_STATES } from '../data/usStates';
import { submitJobApplication, validateCvFile } from '../lib/careerService';
import { extractReadableError } from '../lib/firebase';
import type { JobCategory, VerifiedVacancy } from '../types/career';
import { TelegramCtaBanner } from './TelegramCtaBanner';

export interface ApplicationTarget {
  type: 'category' | 'vacancy';
  category?: JobCategory;
  vacancy?: VerifiedVacancy;
  preferredState?: string;
}

interface ApplicationModalProps {
  target: ApplicationTarget | null;
  user: User | null;
  onClose: () => void;
  onSignIn: () => Promise<void>;
  onViewTracker: () => void;
}

const SUBMISSION_TIMEOUT_MS = 15000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  target,
  user,
  onClose,
  onSignIn,
  onViewTracker
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [stateVal, setStateVal] = useState('California');
  const [city, setCity] = useState('');
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState('');
  const [positionApplied, setPositionApplied] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [receipt, setReceipt] = useState<{
    applicationId: string;
    applicantCode: string;
    position: string;
    category: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const clearFormFields = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setCountry('United States');
    setStateVal('California');
    setCity('');
    setEducation('');
    setExperience('');
    setSkills('');
    setCoverLetter('');
    setLinkedinUrl('');
    setCvFile(null);
    setConsentAccepted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (!target) return;
    setErrorMsg('');
    setReceipt(null);
    setSubmitting(false);

    // Clear fields that must never persist or autofill across different applications
    setPhone('');
    setCountry('United States');
    setExperience('');
    setSkills('');
    setCoverLetter('');
    setEducation('');
    setLinkedinUrl('');
    setCvFile(null);
    setConsentAccepted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setFullName(user?.displayName || '');
    setEmail(user?.email || '');

    if (target.type === 'vacancy' && target.vacancy) {
      setSelectedCategoryTitle(target.vacancy.categoryName);
      setPositionApplied(target.vacancy.title);
      setStateVal(target.vacancy.state || 'California');
      setCity(target.vacancy.city || '');
    } else if (target.type === 'category' && target.category) {
      setSelectedCategoryTitle(target.category.title);
      setPositionApplied(target.category.title);
      if (target.preferredState && target.preferredState !== 'All States') {
        setStateVal(target.preferredState);
      } else {
        setStateVal('California');
      }
      setCity('');
    }
    // Intentionally reset only when opening or switching the application target,
    // never when `user` signs in mid-form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  useEffect(() => {
    if (!target || !user) return;
    setFullName((prev) => prev || user.displayName || '');
    setEmail((prev) => prev || user.email || '');
  }, [target, user]);

  useEffect(() => {
    if (!target) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [target, submitting, onClose]);

  if (!target) return null;

  const matchedCategory =
    JOB_CATEGORIES.find((c) => c.title === selectedCategoryTitle) || JOB_CATEGORIES[0];

  const handleCategoryChange = (newCategoryTitle: string) => {
    setSelectedCategoryTitle(newCategoryTitle);
    if (target.type === 'category') {
      setPositionApplied(newCategoryTitle);
    }
  };

  const handleCountryChange = (nextCountry: string) => {
    setCountry(nextCountry);
    if (nextCountry === 'United States') {
      if (!US_STATES.includes(stateVal)) {
        setStateVal('California');
      }
    } else if (US_STATES.includes(stateVal)) {
      setStateVal('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setCvFile(null);
      return;
    }
    const validationError = validateCvFile(file);
    if (validationError) {
      setErrorMsg(validationError);
      setCvFile(null);
      e.target.value = '';
      return;
    }
    setErrorMsg('');
    setCvFile(file);
  };

  const validateForm = (): string | null => {
    if (!user) {
      return 'Please sign in with Google below so your application is securely saved to your account.';
    }
    if (fullName.trim().length < 2) {
      return 'Please enter your full name (at least 2 characters).';
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    const digitsOnly = phone.replace(/\D/g, '');
    if (phone.trim().length < 7 || digitsOnly.length < 7) {
      return 'Please enter a valid phone number with at least 7 digits.';
    }
    if (country.trim().length < 2) {
      return 'Please select your country of residence.';
    }
    if (stateVal.trim().length < 1) {
      return 'Please enter or select your state / province.';
    }
    if (city.trim().length < 1) {
      return 'Please enter your city.';
    }
    if (!selectedCategoryTitle && !matchedCategory.title) {
      return 'Please select a job category.';
    }
    if (positionApplied.trim().length < 2) {
      return 'Please enter the position you are applying for.';
    }
    if (education.trim().length < 2) {
      return 'Please enter your educational qualification.';
    }
    if (experience.trim().length < 2) {
      return 'Please summarize your relevant work experience.';
    }
    if (skills.trim().length < 2) {
      return 'Please list your key skills and certifications.';
    }
    if (coverLetter.trim().length < 10) {
      return 'Please write a short cover letter (at least 10 characters).';
    }
    if (linkedinUrl.trim()) {
      try {
        const parsed = new URL(linkedinUrl.trim());
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          return 'LinkedIn URL must start with https:// or http://.';
        }
      } catch {
        return 'Please enter a valid LinkedIn URL (or leave it blank).';
      }
    }
    const fileError = validateCvFile(cvFile);
    if (fileError) {
      return fileError;
    }
    if (!consentAccepted) {
      return 'Please check the confirmation box to accept the Privacy Notice and confirm your information is accurate.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setErrorMsg('');

    const validationError = validateForm();
    if (validationError || !cvFile) {
      setErrorMsg(validationError || 'Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    try {
      const submittedPosition = positionApplied.trim() || matchedCategory.title;
      const submittedCategory = selectedCategoryTitle || matchedCategory.title;

      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => {
          reject(
            new Error(
              'Submission timed out after 15 seconds. Please check your internet connection or try a smaller CV file (max 5 MB) and submit again.'
            )
          );
        }, SUBMISSION_TIMEOUT_MS);
      });

      const result = await Promise.race([
        submitJobApplication({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          country: country.trim(),
          state: stateVal.trim() || 'N/A',
          city: city.trim(),
          departmentName:
            target.type === 'vacancy' && target.vacancy
              ? target.vacancy.departmentName
              : matchedCategory.departmentName,
          jobCategory: submittedCategory,
          positionApplied: submittedPosition,
          vacancyId:
            target.type === 'vacancy' && target.vacancy ? target.vacancy.id : 'general-category',
          applicationType:
            target.type === 'vacancy' && target.vacancy
              ? 'Verified Vacancy'
              : 'General Career Category',
          education: education.trim(),
          experience: experience.trim(),
          skills: skills.trim(),
          coverLetter: coverLetter.trim(),
          linkedinUrl: linkedinUrl.trim(),
          consentAccepted: true,
          cvFile
        }),
        timeoutPromise
      ]);

      clearFormFields();
      setReceipt({
        applicationId: result.applicationId,
        applicantCode: result.applicantCode,
        position: submittedPosition,
        category: submittedCategory
      });
    } catch (err) {
      setErrorMsg(
        extractReadableError(
          err,
          'Unable to submit application. Please check your connection and try again.'
        )
      );
    } finally {
      if (timeoutHandle) clearTimeout(timeoutHandle);
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0B1F3A]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="application-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#B91C1C]">
              {target.type === 'vacancy' && target.vacancy
                ? `Verified Vacancy · ${target.vacancy.employerName}`
                : `General Career Category · ${matchedCategory.departmentName}`}
            </p>
            <h2
              id="application-modal-title"
              className="font-display text-lg sm:text-xl font-bold text-[#0B1F3A] truncate"
            >
              {receipt
                ? 'Application Confirmation'
                : `Apply: ${positionApplied || matchedCategory.title}`}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#0B1F3A] transition-colors shrink-0"
            aria-label="Close application form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {receipt ? (
          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex items-start gap-4 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-display text-2xl font-extrabold text-[#0B1F3A] tracking-tight">
                  Application submitted successfully! We will contact you soon.
                </h3>
                <p className="text-sm font-medium text-slate-800">
                  Your application and CV have been securely saved to your applicant record.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Status: <strong className="uppercase text-emerald-800">Pending</strong> ·
                  Track updates anytime inside My Applications.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-200 rounded-xl p-5 bg-slate-50">
              <div>
                <p className="text-xs text-slate-500">Applicant Tracking ID</p>
                <p className="font-mono-tabular text-sm font-bold text-[#0B1F3A] mt-0.5">
                  {receipt.applicantCode}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Job Category</p>
                <p className="text-sm font-semibold text-[#0B1F3A] mt-0.5">{receipt.category}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Position Applied For</p>
                <p className="text-sm font-semibold text-[#0B1F3A] mt-0.5">{receipt.position}</p>
              </div>
            </div>

            {/* Required Telegram CEO CTA Banner AFTER submission on Confirmation Page */}
            <TelegramCtaBanner variant="confirmation" />

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewTracker();
                }}
                className="px-5 py-2.5 text-sm font-semibold text-[#0B1F3A] bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
              >
                Track My Applications
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0B1F3A] hover:bg-[#132F54] rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate autoComplete="off" className="p-6 sm:p-8 space-y-6">
            {!user && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#0B1F3A]">
                    Account Sign-In Required for Submission
                  </p>
                  <p className="text-xs text-slate-600">
                    Sign in with Google to save your application permanently and track review
                    updates.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void onSignIn()}
                  className="px-4 py-2.5 bg-[#0B1F3A] text-white text-xs font-semibold rounded-lg hover:bg-[#132F54] whitespace-nowrap shrink-0"
                >
                  Sign In with Google
                </button>
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-red-900"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#B91C1C]" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="applicant_full_name"
                  required
                  maxLength={120}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="applicant_email"
                  required
                  maxLength={160}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="applicant@example.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="applicant_phone"
                  required
                  maxLength={40}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Country of Residence *
                </label>
                <select
                  name="applicant_country"
                  required
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#0B1F3A]"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  State / Province *
                </label>
                {country === 'United States' ? (
                  <select
                    name="applicant_state"
                    required
                    value={stateVal}
                    onChange={(e) => setStateVal(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#0B1F3A]"
                  >
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="applicant_province"
                    autoComplete="off"
                    required
                    maxLength={100}
                    value={stateVal}
                    onChange={(e) => setStateVal(e.target.value)}
                    placeholder="State, province, or region"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  name="applicant_city"
                  autoComplete="off"
                  required
                  maxLength={100}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Austin, Chicago, or Lagos"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Selected Job Category (300 Categories) *
                </label>
                <select
                  name="job_category"
                  required
                  value={selectedCategoryTitle}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#0B1F3A]"
                >
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.title}>
                      {cat.number}. {cat.title} ({cat.departmentName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Selected Job Position *
                </label>
                <input
                  type="text"
                  name="position_applied"
                  autoComplete="off"
                  required
                  maxLength={160}
                  value={positionApplied}
                  onChange={(e) => setPositionApplied(e.target.value)}
                  placeholder="Specific position title"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Educational Qualification *
                </label>
                <input
                  type="text"
                  name="educational_qualification"
                  autoComplete="off"
                  required
                  maxLength={200}
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g., B.S. in Nursing, Trade Diploma, MBA"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  LinkedIn Profile (Optional)
                </label>
                <input
                  type="url"
                  name="linkedin_profile_url"
                  autoComplete="off"
                  maxLength={300}
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/in/username"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Relevant Work Experience *
              </label>
              <textarea
                name="relevant_work_experience"
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                required
                rows={3}
                maxLength={3000}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Summarize your relevant roles, years of experience, and measurable accomplishments..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Key Skills &amp; Certifications *
              </label>
              <input
                type="text"
                name="applicant_skills"
                autoComplete="off"
                required
                maxLength={1000}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., BLS Certification, TypeScript, OSHA-30, Commercial Fleet Logistics"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Cover Letter *
              </label>
              <textarea
                name="applicant_cover_letter"
                autoComplete="off"
                required
                rows={4}
                maxLength={4000}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Briefly explain why you are applying for this role and your readiness..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
              />
            </div>

            {/* CV Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                CV / Resume Upload * (PDF, DOC, DOCX, PNG, JPG — Max 5 MB)
              </label>
              <label className="flex flex-col sm:flex-row items-center justify-between gap-3 border border-dashed border-slate-300 hover:border-[#0B1F3A] bg-slate-50 rounded-xl p-4 cursor-pointer transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  {cvFile ? (
                    <FileText className="w-5 h-5 text-[#0B1F3A] shrink-0" />
                  ) : (
                    <Upload className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0B1F3A] truncate">
                      {cvFile ? cvFile.name : 'Select your CV or Resume file'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {cvFile
                        ? `${Math.max(1, Math.round(cvFile.size / 1024))} KB ready for upload`
                        : 'PDF, DOC, DOCX, PNG, or JPG up to 5 MB'}
                    </p>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 text-xs font-semibold text-[#0B1F3A] bg-white border border-slate-300 rounded-lg shrink-0">
                  {cvFile ? 'Replace File' : 'Browse File'}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>

            {/* Privacy Notice & Consent */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#0B1F3A] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Privacy &amp; Safety Notice:</strong> Your application data is restricted
                  to authorized recruitment administrators. Do NOT include bank passwords, payment
                  card details, Social Security numbers (SSN), or unrelated identity documents.
                </p>
              </div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0B1F3A] focus:ring-[#0B1F3A]"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  I confirm that the information provided is accurate and I consent to USA Career
                  &amp; Opportunity Hub storing and reviewing my application and CV under the Privacy
                  Policy. *
                </span>
              </label>
            </div>

            {/* Required Telegram CEO CTA Banner BEFORE submission inside every application form */}
            <TelegramCtaBanner variant="compact" />

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] disabled:opacity-60 rounded-lg transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
