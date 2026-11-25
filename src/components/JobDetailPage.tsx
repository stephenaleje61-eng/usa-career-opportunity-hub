import React from 'react';
import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import type { FavoriteJob, JobCategory, VerifiedVacancy } from '../types/career';
import type { ApplicationTarget } from './ApplicationModal';
import { TelegramCtaBanner } from './TelegramCtaBanner';

export type JobDetailSelection =
  | { type: 'category'; category: JobCategory; preferredState?: string }
  | { type: 'vacancy'; vacancy: VerifiedVacancy };

interface JobDetailPageProps {
  detail: JobDetailSelection;
  favorites: FavoriteJob[];
  onBack: () => void;
  onApply: (target: ApplicationTarget) => void;
  onToggleFavoriteCategory: (cat: JobCategory) => void;
  onToggleFavoriteVacancy: (vac: VerifiedVacancy) => void;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({
  detail,
  favorites,
  onBack,
  onApply,
  onToggleFavoriteCategory,
  onToggleFavoriteVacancy
}) => {
  const itemId = detail.type === 'vacancy' ? detail.vacancy.id : detail.category.id;
  const isSaved = favorites.some((f) => f.itemId === itemId);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#0B1F3A] bg-white border border-slate-200 hover:border-[#0B1F3A] rounded-lg transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Job Listings</span>
      </button>

      {detail.type === 'vacancy' ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                  {detail.vacancy.verificationLabel}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600">{detail.vacancy.departmentName}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600">{detail.vacancy.employmentType}</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
                {detail.vacancy.title}
              </h1>
              <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>{detail.vacancy.employerName}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleFavoriteVacancy(detail.vacancy)}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg border transition-colors ${
                  isSaved
                    ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                    : 'bg-white text-[#0B1F3A] border-slate-300 hover:border-[#0B1F3A]'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isSaved ? 'Saved' : 'Save Job'}</span>
              </button>
              <button
                type="button"
                onClick={() => onApply({ type: 'vacancy', vacancy: detail.vacancy })}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors"
              >
                APPLY NOW
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
            <div className="space-y-1">
              <p className="text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Location
              </p>
              <p className="font-semibold text-[#0B1F3A]">{detail.vacancy.location}</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" /> Verified Compensation
              </p>
              <p className="font-semibold text-[#0B1F3A]">
                {detail.vacancy.salaryVerified && detail.vacancy.salaryRange
                  ? detail.vacancy.salaryRange
                  : 'Verified on Employer Offer'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Application Deadline
              </p>
              <p className="font-semibold text-[#0B1F3A]">{detail.vacancy.deadline}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0B1F3A]">
              Required Qualifications
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>Minimum Level:</strong> {detail.vacancy.requiredQualification} —{' '}
              {detail.vacancy.qualificationsDetail}
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0B1F3A]">Role Description</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {detail.vacancy.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Free application · Protected by Firebase Authentication &amp; Firestore security rules
            </p>
            <button
              type="button"
              onClick={() => onApply({ type: 'vacancy', vacancy: detail.vacancy })}
              className="px-6 py-3 text-sm font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors"
            >
              APPLY FOR THIS POSITION
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-mono-tabular font-semibold text-[#B91C1C]">
                  Category #{String(detail.category.number).padStart(3, '0')}
                </span>
                <span>·</span>
                <span>
                  Department {detail.category.departmentCode}: {detail.category.departmentName}
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
                {detail.category.title}
              </h1>
              <p className="text-xs text-slate-600">
                General Career Category · Unaffiliated U.S. Nationwide Talent Pool
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleFavoriteCategory(detail.category)}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg border transition-colors ${
                  isSaved
                    ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                    : 'bg-white text-[#0B1F3A] border-slate-300 hover:border-[#0B1F3A]'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isSaved ? 'Saved' : 'Save Category'}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onApply({
                    type: 'category',
                    category: detail.category,
                    preferredState: detail.preferredState
                  })
                }
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors"
              >
                APPLY NOW
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
            <div className="space-y-1">
              <p className="text-slate-500">Target Region</p>
              <p className="font-semibold text-[#0B1F3A]">
                {detail.preferredState && detail.preferredState !== 'All States'
                  ? detail.preferredState
                  : 'United States (Nationwide)'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500">Supported Employment Types</p>
              <p className="font-semibold text-[#0B1F3A]">
                {detail.category.supportedEmploymentTypes.join(', ')}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500">Typical Qualification Track</p>
              <p className="font-semibold text-[#0B1F3A]">
                {detail.category.requiredQualification}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-lg font-bold text-[#0B1F3A]">
              Occupation Overview &amp; Qualifications
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">{detail.category.overview}</p>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>Standard Qualifications:</strong> {detail.category.qualificationsSummary}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-[#0B1F3A] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Transparency Notice:</strong> This is a standardized General Career Category
              within the USA Career &amp; Opportunity Hub talent pool. No unverified employer names
              or unverified salaries are claimed here. Submit your qualifications and CV below to be
              considered for matching openings.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Supports PDF, DOC, DOCX, PNG, and JPG CVs up to 5 MB.
            </p>
            <button
              type="button"
              onClick={() =>
                onApply({
                  type: 'category',
                  category: detail.category,
                  preferredState: detail.preferredState
                })
              }
              className="px-6 py-3 text-sm font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors"
            >
              APPLY FOR {detail.category.title.toUpperCase()}
            </button>
          </div>
        </div>
      )}

      {/* Required Telegram CEO CTA Banner on Every Individual Job Page */}
      <TelegramCtaBanner />
    </section>
  );
};
