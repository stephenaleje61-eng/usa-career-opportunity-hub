import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  Building2,
  Calendar,
  MapPin,
  Search,
  ShieldCheck
} from 'lucide-react';
import { DEPARTMENTS, JOB_CATEGORIES } from '../data/categories';
import {
  EMPLOYMENT_TYPES,
  QUALIFICATION_LEVELS,
  SALARY_FILTERS,
  US_STATES
} from '../data/usStates';
import type {
  EmploymentType,
  FavoriteJob,
  JobCategory,
  QualificationLevel,
  VerifiedVacancy
} from '../types/career';
import type { ApplicationTarget } from './ApplicationModal';
import type { JobDetailSelection } from './JobDetailPage';
import { TelegramCtaBanner } from './TelegramCtaBanner';

interface OpportunitiesHomeProps {
  vacancies: VerifiedVacancy[];
  favorites: FavoriteJob[];
  onApply: (target: ApplicationTarget) => void;
  onOpenJobDetail: (detail: JobDetailSelection) => void;
  onToggleFavoriteCategory: (cat: JobCategory) => void;
  onToggleFavoriteVacancy: (vac: VerifiedVacancy) => void;
  onOpenDepartments: () => void;
}

const ITEMS_PER_PAGE = 24;

export const OpportunitiesHome: React.FC<OpportunitiesHomeProps> = ({
  vacancies,
  favorites,
  onApply,
  onOpenJobDetail,
  onToggleFavoriteCategory,
  onToggleFavoriteVacancy,
  onOpenDepartments
}) => {
  const [browseMode, setBrowseMode] = useState<'categories' | 'vacancies'>('categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<'ALL' | EmploymentType>('ALL');
  const [selectedQualification, setSelectedQualification] = useState<'ALL' | QualificationLevel>(
    'ALL'
  );
  const [minSalary, setMinSalary] = useState(0);
  const [page, setPage] = useState(1);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return JOB_CATEGORIES.filter((cat) => {
      if (selectedDepartment !== 'ALL' && cat.departmentCode !== selectedDepartment) return false;
      if (
        selectedEmploymentType !== 'ALL' &&
        !cat.supportedEmploymentTypes.includes(selectedEmploymentType)
      ) {
        return false;
      }
      if (selectedQualification !== 'ALL' && cat.requiredQualification !== selectedQualification) {
        return false;
      }
      if (q) {
        const matches =
          cat.title.toLowerCase().includes(q) ||
          cat.departmentName.toLowerCase().includes(q) ||
          cat.qualificationsSummary.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [searchQuery, selectedDepartment, selectedEmploymentType, selectedQualification]);

  const filteredVacancies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return vacancies.filter((vac) => {
      if (vac.status !== 'Open') return false;
      if (selectedDepartment !== 'ALL' && vac.departmentCode !== selectedDepartment) return false;
      if (selectedState !== 'All States' && vac.state !== selectedState) return false;
      if (selectedEmploymentType !== 'ALL' && vac.employmentType !== selectedEmploymentType) {
        return false;
      }
      if (selectedQualification !== 'ALL' && vac.requiredQualification !== selectedQualification) {
        return false;
      }
      if (minSalary > 0 && (!vac.salaryVerified || vac.salaryMinAnnual < minSalary)) return false;
      if (q) {
        const matches =
          vac.title.toLowerCase().includes(q) ||
          vac.employerName.toLowerCase().includes(q) ||
          vac.categoryName.toLowerCase().includes(q) ||
          vac.location.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [
    vacancies,
    searchQuery,
    selectedDepartment,
    selectedState,
    selectedEmploymentType,
    selectedQualification,
    minSalary
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const visibleCategories = filteredCategories.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('ALL');
    setSelectedState('All States');
    setSelectedEmploymentType('ALL');
    setSelectedQualification('ALL');
    setMinSalary(0);
    setPage(1);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Hero Copy & Search */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#B91C1C] tracking-wide">
                  U.S. National Employment &amp; Recruitment Portal
                </p>
                <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0B1F3A] tracking-tight leading-[1.1] text-balance">
                  Discover Opportunities. Apply for Jobs. Build Your American Dream.
                </h1>
                <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
                  Explore all 300 standardized U.S. job categories across 30 major employment
                  departments alongside verified employer vacancies—backed by secure permanent
                  application tracking.
                </p>
              </div>

              {/* Primary Search & State Filter Bar */}
              <div className="bg-[#F5F7FA] border border-slate-200 rounded-xl p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-5 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Job title, skill, or keyword..."
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    aria-label="Filter by U.S. State"
                    className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                  >
                    <option value="All States">All 50 U.S. States &amp; Remote</option>
                    {US_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <a
                    href="#opportunity-explorer"
                    className="w-full h-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors whitespace-nowrap"
                  >
                    <span>Explore Jobs</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Quick Proof Strip */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-200">
                <div>
                  <p className="font-mono-tabular text-xl sm:text-2xl font-bold text-[#0B1F3A]">
                    30
                  </p>
                  <p className="text-xs text-slate-600">Major Departments</p>
                </div>
                <div>
                  <p className="font-mono-tabular text-xl sm:text-2xl font-bold text-[#0B1F3A]">
                    300
                  </p>
                  <p className="text-xs text-slate-600">Career Categories</p>
                </div>
                <div>
                  <p className="font-mono-tabular text-xl sm:text-2xl font-bold text-[#0B1F3A]">
                    {vacancies.filter((v) => v.status === 'Open').length}
                  </p>
                  <p className="text-xs text-slate-600">Verified Vacancies</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:col-span-5">
              <div className="relative h-64 sm:h-80 lg:h-full rounded-xl overflow-hidden border border-slate-200 bg-gradient-to-br from-[#0B1F3A] to-[#1E3A5F]">
                <img
                  src="/src/assets/images/hero_american_careers_1795634884290.jpg"
                  alt="Modern American corporate financial and civic district at morning light"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/85 via-[#0B1F3A]/20 to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <p className="text-xs font-semibold text-red-300">
                      Transparent Recruitment Architecture
                    </p>
                    <p className="text-sm font-medium leading-snug">
                      Verified employer postings are clearly separated from general career category
                      talent submissions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Required Telegram CEO CTA Banner on Homepage */}
          <TelegramCtaBanner />
        </div>
      </section>

      {/* Opportunity Explorer */}
      <section
        id="opportunity-explorer"
        className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8"
      >
        {/* Mode Switch & Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
              Explore Employment Opportunities
            </h2>
            <p className="text-sm text-slate-600">
              Switch between all 300 General Career Categories and employer-verified vacancies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 border border-slate-200 rounded-lg self-start">
            <button
              type="button"
              onClick={() => {
                setBrowseMode('categories');
                setPage(1);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                browseMode === 'categories'
                  ? 'bg-white text-[#0B1F3A] shadow-xs'
                  : 'text-slate-600 hover:text-[#0B1F3A]'
              }`}
            >
              General Career Categories ({filteredCategories.length})
            </button>
            <button
              type="button"
              onClick={() => setBrowseMode('vacancies')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                browseMode === 'vacancies'
                  ? 'bg-white text-[#0B1F3A] shadow-xs'
                  : 'text-slate-600 hover:text-[#0B1F3A]'
              }`}
            >
              Verified Employer Vacancies ({filteredVacancies.length})
            </button>
          </div>
        </div>

        {/* Multi-facet Filter Controls */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Department (30)
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
            >
              <option value="ALL">All 30 Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.code} value={dept.code}>
                  {dept.code}. {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Employment Type
            </label>
            <select
              value={selectedEmploymentType}
              onChange={(e) => {
                setSelectedEmploymentType(e.target.value as 'ALL' | EmploymentType);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
            >
              <option value="ALL">All Types (Full-time to Remote)</option>
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Qualification Level
            </label>
            <select
              value={selectedQualification}
              onChange={(e) => {
                setSelectedQualification(e.target.value as 'ALL' | QualificationLevel);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
            >
              <option value="ALL">All Qualification Levels</option>
              {QUALIFICATION_LEVELS.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Verified Salary Filter
            </label>
            <select
              value={minSalary}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMinSalary(val);
                if (val > 0) setBrowseMode('vacancies');
              }}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
            >
              {SALARY_FILTERS.map((s) => (
                <option key={s.min} value={s.min}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={resetFilters}
              className="w-full px-3 py-2 text-xs font-semibold text-[#0B1F3A] bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={onOpenDepartments}
              className="w-full px-3 py-2 text-xs font-semibold text-white bg-[#0B1F3A] hover:bg-[#132F54] rounded-lg transition-colors whitespace-nowrap"
            >
              Full A–AD Index
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        {browseMode === 'vacancies' ? (
          filteredVacancies.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-4">
              <ShieldCheck className="w-9 h-9 text-[#0B1F3A] mx-auto" />
              <h3 className="font-display text-xl font-bold text-[#0B1F3A]">
                No Employer-Verified Vacancies Currently Match Your Filter
              </h3>
              <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                USA Career &amp; Opportunity Hub never invents employers, salaries, or sample
                vacancies. Authorized administrators publish verified employer openings directly to
                this board. Meanwhile, you can explore and apply across all 300 General Career
                Categories.
              </p>
              <button
                type="button"
                onClick={() => setBrowseMode('categories')}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0B1F3A] hover:bg-[#132F54] rounded-lg"
              >
                Browse 300 Career Categories
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVacancies.map((vac) => {
                const isSaved = favorites.some((f) => f.itemId === vac.id);
                return (
                  <article
                    key={vac.id}
                    className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5 hover:border-[#0B1F3A] transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-emerald-700">
                          {vac.verificationLabel}
                        </span>
                        <span className="text-slate-500">{vac.employmentType}</span>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => onOpenJobDetail({ type: 'vacancy', vacancy: vac })}
                          className="text-left font-display text-lg font-bold text-[#0B1F3A] hover:text-[#B91C1C] leading-snug transition-colors"
                        >
                          {vac.title}
                        </button>
                        <p className="text-sm font-medium text-slate-700 mt-1 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{vac.employerName}</span>
                        </p>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600">
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{vac.location}</span>
                        </p>
                        <p className="font-semibold text-[#0B1F3A]">
                          {vac.salaryVerified && vac.salaryRange
                            ? `Verified Salary: ${vac.salaryRange}`
                            : 'Salary: Verified on Employer Offer'}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Deadline: {vac.deadline}</span>
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        <strong>Qualifications:</strong> {vac.qualificationsDetail} —{' '}
                        {vac.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => onOpenJobDetail({ type: 'vacancy', vacancy: vac })}
                        className="px-3 py-2.5 text-xs font-semibold text-[#0B1F3A] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onApply({ type: 'vacancy', vacancy: vac })}
                        className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors"
                      >
                        APPLY NOW
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleFavoriteVacancy(vac)}
                        className={`p-2.5 rounded-lg border transition-colors ${
                          isSaved
                            ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-[#0B1F3A]'
                        }`}
                        aria-label={isSaved ? 'Remove from favorites' : 'Save job'}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )
        ) : (
          <>
            <div className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-3 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>
                <strong>Transparency Notice:</strong> Cards below are General Career Categories
                (unaffiliated U.S. talent pool tracks) with no invented employers or salaries.
                {selectedState !== 'All States' && (
                  <>
                    {' '}
                    State preference <strong>{selectedState}</strong> will pre-fill your
                    application.
                  </>
                )}
              </span>
              <span className="font-mono-tabular font-semibold text-[#0B1F3A] shrink-0">
                Showing {visibleCategories.length} of {filteredCategories.length} categories
              </span>
            </div>

            {visibleCategories.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
                <p className="text-base font-bold text-[#0B1F3A]">
                  No career categories match your filters
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0B1F3A] rounded-lg"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleCategories.map((cat) => {
                  const isSaved = favorites.some((f) => f.itemId === cat.id);
                  return (
                    <article
                      key={cat.id}
                      className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5 hover:border-[#0B1F3A] transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                          <span>
                            {cat.departmentCode}. {cat.departmentName}
                          </span>
                          <span className="font-mono-tabular font-semibold text-[#0B1F3A]">
                            #{String(cat.number).padStart(3, '0')}
                          </span>
                        </div>

                        <div>
                          <button
                            type="button"
                            onClick={() =>
                              onOpenJobDetail({
                                type: 'category',
                                category: cat,
                                preferredState: selectedState
                              })
                            }
                            className="text-left font-display text-lg font-bold text-[#0B1F3A] hover:text-[#B91C1C] leading-snug transition-colors"
                          >
                            {cat.title}
                          </button>
                          <p className="text-xs text-slate-500 mt-1">
                            General Career Category · Unaffiliated Talent Pool
                          </p>
                        </div>

                        <div className="space-y-1 text-xs text-slate-600">
                          <p>
                            <strong className="text-[#0B1F3A]">Target Region:</strong>{' '}
                            {selectedState === 'All States'
                              ? 'United States (Nationwide)'
                              : selectedState}
                          </p>
                          <p>
                            <strong className="text-[#0B1F3A]">Employment Types:</strong>{' '}
                            {cat.supportedEmploymentTypes.join(', ')}
                          </p>
                          <p>
                            <strong className="text-[#0B1F3A]">Qualification:</strong>{' '}
                            {cat.qualificationsSummary}
                          </p>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{cat.overview}</p>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() =>
                            onOpenJobDetail({
                              type: 'category',
                              category: cat,
                              preferredState: selectedState
                            })
                          }
                          className="px-3 py-2.5 text-xs font-semibold text-[#0B1F3A] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onApply({
                              type: 'category',
                              category: cat,
                              preferredState: selectedState
                            })
                          }
                          className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors"
                        >
                          APPLY NOW
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleFavoriteCategory(cat)}
                          className={`p-2.5 rounded-lg border transition-colors ${
                            isSaved
                              ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-[#0B1F3A]'
                          }`}
                          aria-label={
                            isSaved ? `Remove ${cat.title} from favorites` : `Save ${cat.title}`
                          }
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                <p className="font-mono-tabular text-xs text-slate-600">
                  Page {safePage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg disabled:opacity-40 hover:border-[#0B1F3A]"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg disabled:opacity-40 hover:border-[#0B1F3A]"
                  >
                    Next Page
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Editorial Infrastructure & Process Section */}
      <section className="bg-white border-t border-slate-200 py-14">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
              How Our U.S. Recruitment Process Works
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Structured around transparent verification, permanent record storage, and strict
              applicant privacy protections.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="grid grid-cols-1 gap-6">
              <div className="border border-slate-200 rounded-xl p-6 space-y-2">
                <h3 className="font-display text-base font-bold text-[#0B1F3A]">
                  01. Select Your Career Track or Verified Vacancy
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Filter across 30 major employment departments and 300 specialized occupations, or
                  browse administrator-verified employer openings with confirmed locations and
                  salary ranges.
                </p>
              </div>
              <div className="border border-slate-200 rounded-xl p-6 space-y-2">
                <h3 className="font-display text-base font-bold text-[#0B1F3A]">
                  02. Submit Verified Qualifications &amp; CV
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Complete the standardized application form and upload your CV/Resume (PDF, DOC,
                  DOCX, PNG, JPG up to 5 MB). We never request banking credentials, card numbers,
                  or Social Security numbers.
                </p>
              </div>
              <div className="border border-slate-200 rounded-xl p-6 space-y-2">
                <h3 className="font-display text-base font-bold text-[#0B1F3A]">
                  03. Track Live Review Status Permanently
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every submission is saved permanently under your account so you can monitor status
                  transitions from Pending through Under Review, Shortlisted, or Final Decision.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src="/src/assets/images/feature_workforce_hub_1795634884632.jpg"
                  alt="Healthcare and corporate leaders reviewing strategic workforce plans in a sunlit U.S. office"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover min-h-[240px]"
                />
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src="/src/assets/images/feature_industrial_tech_1795634884513.jpg"
                  alt="Engineers inspecting operational schematics inside an American logistics and engineering facility"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover min-h-[240px]"
                />
              </div>
            </div>
          </div>

          <TelegramCtaBanner />
        </div>
      </section>
    </div>
  );
};
