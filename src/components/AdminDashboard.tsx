import React, { useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  Loader2,
  Lock,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X
} from 'lucide-react';
import { DEPARTMENTS, JOB_CATEGORIES } from '../data/categories';
import { EMPLOYMENT_TYPES, QUALIFICATION_LEVELS, US_STATES } from '../data/usStates';
import {
  deleteApplicationRecord,
  deleteVacancy,
  downloadApplicationCv,
  saveVerifiedVacancy,
  updateApplicationStatus,
  updateSupportInquiryStatus
} from '../lib/careerService';
import { extractReadableError } from '../lib/firebase';
import type {
  ApplicationStatus,
  EmploymentType,
  JobApplication,
  QualificationLevel,
  SupportInquiry,
  UserProfile,
  VerifiedVacancy
} from '../types/career';

interface AdminDashboardProps {
  user: User | null;
  isAdmin: boolean;
  users: UserProfile[];
  applications: JobApplication[];
  loadingApplications: boolean;
  applicationsError: string;
  vacancies: VerifiedVacancy[];
  supportInquiries: SupportInquiry[];
  onSignIn: () => Promise<void>;
}

function getDateObj(ts: unknown): Date | null {
  if (!ts) return null;
  if (typeof ts === 'object' && ts !== null && 'toDate' in ts && typeof (ts as { toDate: () => Date }).toDate === 'function') {
    return (ts as { toDate: () => Date }).toDate();
  }
  return null;
}

function formatDateStr(ts: unknown): string {
  const d = getDateObj(ts);
  if (!d) return 'Pending';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatIsoDate(ts: unknown): string {
  const d = getDateObj(ts);
  if (!d) return '';
  return d.toISOString().slice(0, 10);
}

function csvEscape(val: string | number | boolean): string {
  const s = String(val ?? '').replace(/\r?\n/g, ' ');
  if (/[",]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function getExperienceText(app: JobApplication): string {
  return (
    app.experience ||
    (app as JobApplication & { workExperience?: string }).workExperience ||
    ''
  );
}

function formatStatusLabel(status: ApplicationStatus | string): string {
  switch (status) {
    case 'under_review':
    case 'Under Review':
      return 'Under Review';
    case 'shortlisted':
    case 'Shortlisted':
      return 'Shortlisted';
    case 'rejected':
    case 'Rejected':
      return 'Rejected';
    case 'pending':
    case 'New':
    default:
      return 'Pending';
  }
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  isAdmin,
  users,
  applications,
  loadingApplications,
  applicationsError,
  vacancies,
  supportInquiries,
  onSignIn
}) => {
  const [adminTab, setAdminTab] = useState<'applicants' | 'vacancies' | 'support'>('applicants');
  const [adminActionError, setAdminActionError] = useState('');

  // Filters
  const [searchName, setSearchName] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterCountry, setFilterCountry] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | ApplicationStatus>('ALL');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Selected application modal
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [modalStatus, setModalStatus] = useState<ApplicationStatus>('pending');
  const [modalNotes, setModalNotes] = useState('');
  const [savingApp, setSavingApp] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Vacancy form state
  const [showVacancyForm, setShowVacancyForm] = useState(false);
  const [editingVacancyId, setEditingVacancyId] = useState<string | undefined>(undefined);
  const [vacTitle, setVacTitle] = useState('');
  const [vacEmployer, setVacEmployer] = useState('');
  const [vacVerified, setVacVerified] = useState(true);
  const [vacCategory, setVacCategory] = useState(JOB_CATEGORIES[0].title);
  const [vacState, setVacState] = useState('Texas');
  const [vacCity, setVacCity] = useState('');
  const [vacSalaryVerified, setVacSalaryVerified] = useState(true);
  const [vacSalaryRange, setVacSalaryRange] = useState('');
  const [vacSalaryMin, setVacSalaryMin] = useState(0);
  const [vacEmpType, setVacEmpType] = useState<EmploymentType>('Full-time');
  const [vacQualLevel, setVacQualLevel] = useState<QualificationLevel>("Bachelor's Degree");
  const [vacQualDetail, setVacQualDetail] = useState('');
  const [vacDescription, setVacDescription] = useState('');
  const [vacDeadline, setVacDeadline] = useState('');
  const [vacStatus, setVacStatus] = useState<'Open' | 'Closed'>('Open');
  const [savingVacancy, setSavingVacancy] = useState(false);
  const [vacancyError, setVacancyError] = useState('');
  const [confirmDeleteVacId, setConfirmDeleteVacId] = useState<string | null>(null);

  const metrics = useMemo(() => {
    const byStatus: Record<ApplicationStatus, number> = {
      pending: 0,
      under_review: 0,
      shortlisted: 0,
      rejected: 0
    };
    const byCategory: Record<string, number> = {};
    const byCountry: Record<string, number> = {};
    const byState: Record<string, number> = {};

    applications.forEach((app) => {
      const normalizedStatus = (app.status in byStatus ? app.status : 'pending') as ApplicationStatus;
      byStatus[normalizedStatus] = (byStatus[normalizedStatus] || 0) + 1;
      byCategory[app.jobCategory] = (byCategory[app.jobCategory] || 0) + 1;
      byCountry[app.country] = (byCountry[app.country] || 0) + 1;
      byState[app.state] = (byState[app.state] || 0) + 1;
    });

    const sortEntries = (rec: Record<string, number>) =>
      Object.entries(rec).sort((a, b) => b[1] - a[1]);

    return {
      totalApplicants: users.length,
      totalApplications: applications.length,
      byStatus,
      categoriesBreakdown: sortEntries(byCategory),
      countriesBreakdown: sortEntries(byCountry),
      statesBreakdown: sortEntries(byState)
    };
  }, [users, applications]);

  const uniqueCountries = useMemo(
    () => Array.from(new Set(applications.map((a) => a.country))).sort(),
    [applications]
  );

  const uniqueAppCategories = useMemo(
    () => Array.from(new Set(applications.map((a) => a.jobCategory))).sort(),
    [applications]
  );

  const filteredApplications = useMemo(() => {
    const q = searchName.trim().toLowerCase();
    return applications.filter((app) => {
      if (q && !app.fullName.toLowerCase().includes(q) && !app.applicantCode.toLowerCase().includes(q)) {
        return false;
      }
      if (filterCategory !== 'ALL' && app.jobCategory !== filterCategory) return false;
      if (filterCountry !== 'ALL' && app.country !== filterCountry) return false;
      if (filterStatus !== 'ALL' && app.status !== filterStatus) return false;
      const iso = formatIsoDate(app.createdAt);
      if (filterDateFrom && iso && iso < filterDateFrom) return false;
      if (filterDateTo && iso && iso > filterDateTo) return false;
      return true;
    });
  }, [applications, searchName, filterCategory, filterCountry, filterStatus, filterDateFrom, filterDateTo]);

  if (!user || !isAdmin) {
    return (
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 text-center space-y-4">
          <Lock className="w-10 h-10 text-[#B91C1C] mx-auto" />
          <h1 className="font-display text-2xl font-bold text-[#0B1F3A]">
            Authorized Administrator Access Only
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            This private Administrator Dashboard is restricted to verified platform administrators.
            Applicant records are never exposed publicly.
          </p>
          {!user ? (
            <button
              type="button"
              onClick={() => void onSignIn()}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#0B1F3A] hover:bg-[#132F54] rounded-lg"
            >
              Sign In as Administrator
            </button>
          ) : (
            <p className="text-xs text-slate-500">
              Currently signed in as {user.email}. Administrator privileges are required to view
              this console.
            </p>
          )}
        </div>
      </section>
    );
  }

  const openApplicationDetail = (app: JobApplication) => {
    setAdminActionError('');
    setSelectedApp(app);
    setModalStatus(app.status || 'pending');
    setModalNotes(app.adminNotes || '');
  };

  const handleSaveApplicationReview = async () => {
    if (!selectedApp) return;
    setSavingApp(true);
    setAdminActionError('');
    try {
      await updateApplicationStatus(selectedApp.id, modalStatus, modalNotes);
      setSelectedApp((prev) =>
        prev ? { ...prev, status: modalStatus, adminNotes: modalNotes } : null
      );
    } catch (err) {
      setAdminActionError(extractReadableError(err, 'Unable to update application status.'));
    } finally {
      setSavingApp(false);
    }
  };

  const handleInlineStatusChange = async (app: JobApplication, newStatus: ApplicationStatus) => {
    setAdminActionError('');
    try {
      await updateApplicationStatus(app.id, newStatus, app.adminNotes || '');
    } catch (err) {
      setAdminActionError(extractReadableError(err, 'Unable to update application status.'));
    }
  };

  const handleDeleteApp = async (app: JobApplication) => {
    setAdminActionError('');
    try {
      await deleteApplicationRecord(app);
      setConfirmDeleteId(null);
      if (selectedApp?.id === app.id) {
        setSelectedApp(null);
      }
    } catch (err) {
      setAdminActionError(extractReadableError(err, 'Unable to delete application record.'));
    }
  };

  const handleDownloadCv = async (app: JobApplication) => {
    setAdminActionError('');
    try {
      await downloadApplicationCv(app);
    } catch (err) {
      setAdminActionError(extractReadableError(err, 'Unable to download CV file.'));
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'Applicant ID',
      'Full Name',
      'Email',
      'Phone',
      'Country',
      'State',
      'City',
      'Department',
      'Job Category',
      'Position Applied For',
      'Application Type',
      'Education',
      'Experience',
      'Skills',
      'Cover Letter',
      'LinkedIn',
      'CV File Name',
      'Application Date',
      'Status'
    ];
    const rows = filteredApplications.map((a) =>
      [
        a.applicantCode,
        a.fullName,
        a.email,
        a.phone,
        a.country,
        a.state,
        a.city,
        a.departmentName,
        a.jobCategory,
        a.positionApplied,
        a.applicationType,
        a.education,
        getExperienceText(a),
        a.skills,
        a.coverLetter,
        a.linkedinUrl,
        a.cvFileName,
        formatDateStr(a.createdAt),
        formatStatusLabel(a.status)
      ]
        .map(csvEscape)
        .join(',')
    );
    const csvContent = [headers.map(csvEscape).join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `usa-career-hub-applicants-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const openNewVacancyModal = () => {
    setVacancyError('');
    setEditingVacancyId(undefined);
    setVacTitle('');
    setVacEmployer('');
    setVacVerified(true);
    setVacCategory(JOB_CATEGORIES[0].title);
    setVacState('Texas');
    setVacCity('');
    setVacSalaryVerified(true);
    setVacSalaryRange('');
    setVacSalaryMin(0);
    setVacEmpType('Full-time');
    setVacQualLevel("Bachelor's Degree");
    setVacQualDetail('');
    setVacDescription('');
    setVacDeadline('2026-12-31');
    setVacStatus('Open');
    setShowVacancyForm(true);
  };

  const openEditVacancy = (v: VerifiedVacancy) => {
    setVacancyError('');
    setEditingVacancyId(v.id);
    setVacTitle(v.title);
    setVacEmployer(v.employerName);
    setVacVerified(v.employerVerified);
    setVacCategory(v.categoryName);
    setVacState(v.state);
    setVacCity(v.city);
    setVacSalaryVerified(v.salaryVerified);
    setVacSalaryRange(v.salaryRange);
    setVacSalaryMin(v.salaryMinAnnual);
    setVacEmpType(v.employmentType);
    setVacQualLevel(v.requiredQualification);
    setVacQualDetail(v.qualificationsDetail);
    setVacDescription(v.description);
    setVacDeadline(v.deadline);
    setVacStatus(v.status);
    setShowVacancyForm(true);
  };

  const handleSaveVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    setVacancyError('');

    const titleClean = vacTitle.trim();
    const employerClean = vacEmployer.trim();
    const cityClean = vacCity.trim();
    const qualClean = vacQualDetail.trim();
    const descClean = vacDescription.trim();
    const deadlineClean = vacDeadline.trim();

    if (titleClean.length < 2) {
      setVacancyError('Job title must be at least 2 characters.');
      return;
    }
    if (employerClean.length < 2) {
      setVacancyError('Verified employer name must be at least 2 characters.');
      return;
    }
    if (cityClean.length < 1) {
      setVacancyError('Please enter the U.S. city for this vacancy.');
      return;
    }
    if (qualClean.length < 2) {
      setVacancyError('Required qualifications detail must be at least 2 characters.');
      return;
    }
    if (descClean.length < 10) {
      setVacancyError('Job description must be at least 10 characters.');
      return;
    }
    if (deadlineClean.length < 4) {
      setVacancyError('Please enter a valid application deadline.');
      return;
    }

    const parsedSalaryMin = vacSalaryVerified ? Math.max(0, Math.min(10000000, Number(vacSalaryMin) || 0)) : 0;

    setSavingVacancy(true);
    try {
      const cat = JOB_CATEGORIES.find((c) => c.title === vacCategory) || JOB_CATEGORIES[0];
      const dept = DEPARTMENTS.find((d) => d.code === cat.departmentCode) || DEPARTMENTS[0];
      await saveVerifiedVacancy(
        {
          title: titleClean,
          employerName: employerClean,
          employerVerified: vacVerified,
          verificationLabel: vacVerified ? 'Verified Employer' : 'Pending Verification',
          departmentCode: dept.code,
          departmentName: dept.name,
          categoryName: cat.title,
          location: `${cityClean}, ${vacState}`,
          state: vacState,
          city: cityClean,
          salaryRange: vacSalaryVerified ? vacSalaryRange.trim() : '',
          salaryVerified: vacSalaryVerified,
          salaryMinAnnual: parsedSalaryMin,
          employmentType: vacEmpType,
          requiredQualification: vacQualLevel,
          qualificationsDetail: qualClean,
          description: descClean,
          deadline: deadlineClean,
          status: vacStatus
        },
        editingVacancyId
      );
      setShowVacancyForm(false);
    } catch (error) {
      setVacancyError(extractReadableError(error, 'Unable to save vacancy. Please review all fields.'));
    } finally {
      setSavingVacancy(false);
    }
  };

  const handleDeleteVacancy = async (vacancyId: string) => {
    setAdminActionError('');
    try {
      await deleteVacancy(vacancyId);
      setConfirmDeleteVacId(null);
    } catch (error) {
      setAdminActionError(extractReadableError(error, 'Unable to delete vacancy.'));
    }
  };

  const handleResolveSupport = async (item: SupportInquiry) => {
    setAdminActionError('');
    try {
      const nextStatus = item.status === 'Open' ? 'Resolved' : 'Open';
      await updateSupportInquiryStatus(item.id, nextStatus);
    } catch (error) {
      setAdminActionError(extractReadableError(error, 'Unable to update support ticket status.'));
    }
  };

  return (
    <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B91C1C]">
            <ShieldCheck className="w-4 h-4" />
            <span>Private Administrator Console · {user.email}</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-[#0B1F3A]">
            Recruitment Operations Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setAdminTab('applicants')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              adminTab === 'applicants'
                ? 'bg-white text-[#0B1F3A] shadow-xs'
                : 'text-slate-600 hover:text-[#0B1F3A]'
            }`}
          >
            Applicants ({applications.length})
          </button>
          <button
            type="button"
            onClick={() => setAdminTab('vacancies')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              adminTab === 'vacancies'
                ? 'bg-white text-[#0B1F3A] shadow-xs'
                : 'text-slate-600 hover:text-[#0B1F3A]'
            }`}
          >
            Verified Vacancies ({vacancies.length})
          </button>
          <button
            type="button"
            onClick={() => setAdminTab('support')}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              adminTab === 'support'
                ? 'bg-white text-[#0B1F3A] shadow-xs'
                : 'text-slate-600 hover:text-[#0B1F3A]'
            }`}
          >
            Support Tickets ({supportInquiries.length})
          </button>
        </div>
      </div>

      {(applicationsError || adminActionError) && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2.5 text-xs text-red-900"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#B91C1C]" />
          <span>{applicationsError || adminActionError}</span>
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Registered Applicants', value: metrics.totalApplicants, tone: 'text-[#0B1F3A]' },
          { label: 'Submitted Applications', value: metrics.totalApplications, tone: 'text-[#0B1F3A]' },
          { label: 'Pending Review', value: metrics.byStatus.pending, tone: 'text-[#0B1F3A]' },
          { label: 'Under Review', value: metrics.byStatus.under_review, tone: 'text-amber-700' },
          { label: 'Shortlisted', value: metrics.byStatus.shortlisted, tone: 'text-emerald-700' },
          { label: 'Rejected', value: metrics.byStatus.rejected, tone: 'text-[#B91C1C]' }
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">{kpi.label}</p>
            <p className={`font-mono-tabular text-2xl font-bold mt-1 ${kpi.tone}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {adminTab === 'applicants' && (
        <>
          {/* Breakdown Summary Panels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h2 className="font-display text-sm font-bold text-[#0B1F3A]">
                Applications by Job Category
              </h2>
              {metrics.categoriesBreakdown.length === 0 ? (
                <p className="text-xs text-slate-500">No applications recorded yet.</p>
              ) : (
                <ul className="space-y-1.5 text-xs">
                  {metrics.categoriesBreakdown.slice(0, 6).map(([cat, count]) => (
                    <li key={cat} className="flex items-center justify-between text-slate-700">
                      <span className="truncate pr-2">{cat}</span>
                      <span className="font-mono-tabular font-semibold text-[#0B1F3A]">{count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h2 className="font-display text-sm font-bold text-[#0B1F3A]">
                Applications by Country
              </h2>
              {metrics.countriesBreakdown.length === 0 ? (
                <p className="text-xs text-slate-500">No applications recorded yet.</p>
              ) : (
                <ul className="space-y-1.5 text-xs">
                  {metrics.countriesBreakdown.slice(0, 6).map(([c, count]) => (
                    <li key={c} className="flex items-center justify-between text-slate-700">
                      <span className="truncate pr-2">{c}</span>
                      <span className="font-mono-tabular font-semibold text-[#0B1F3A]">{count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h2 className="font-display text-sm font-bold text-[#0B1F3A]">
                Applications by State / Region
              </h2>
              {metrics.statesBreakdown.length === 0 ? (
                <p className="text-xs text-slate-500">No applications recorded yet.</p>
              ) : (
                <ul className="space-y-1.5 text-xs">
                  {metrics.statesBreakdown.slice(0, 6).map(([st, count]) => (
                    <li key={st} className="flex items-center justify-between text-slate-700">
                      <span className="truncate pr-2">{st}</span>
                      <span className="font-mono-tabular font-semibold text-[#0B1F3A]">{count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Search, Filter & CSV Export Toolbar */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <h2 className="font-display text-lg font-bold text-[#0B1F3A]">
                Applicant Management Table ({filteredApplications.length})
              </h2>
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={filteredApplications.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0B1F3A] hover:bg-[#132F54] disabled:opacity-50 rounded-lg transition-colors self-start lg:self-auto"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Authorized Records (CSV)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              <div className="relative lg:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Search by applicant name or ID..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#0B1F3A]"
              >
                <option value="ALL">All Job Categories</option>
                {uniqueAppCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#0B1F3A]"
              >
                <option value="ALL">All Countries</option>
                {uniqueCountries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'ALL' | ApplicationStatus)}
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#0B1F3A]"
              >
                <option value="ALL">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>

              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  title="From date"
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                />
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  title="To date"
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                />
              </div>
            </div>

            {/* 16-Column Data Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="min-w-[1800px] w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3 px-3 whitespace-nowrap">1. Applicant ID</th>
                    <th className="py-3 px-3 whitespace-nowrap">2. Full Name</th>
                    <th className="py-3 px-3 whitespace-nowrap">3. Email Address</th>
                    <th className="py-3 px-3 whitespace-nowrap">4. Phone</th>
                    <th className="py-3 px-3 whitespace-nowrap">5. Country</th>
                    <th className="py-3 px-3 whitespace-nowrap">6. State</th>
                    <th className="py-3 px-3 whitespace-nowrap">7. City</th>
                    <th className="py-3 px-3 whitespace-nowrap">8. Job Category</th>
                    <th className="py-3 px-3 whitespace-nowrap">9. Position Applied</th>
                    <th className="py-3 px-3 whitespace-nowrap">10. Education</th>
                    <th className="py-3 px-3 whitespace-nowrap">11. Work Experience</th>
                    <th className="py-3 px-3 whitespace-nowrap">12. Skills</th>
                    <th className="py-3 px-3 whitespace-nowrap">13. Cover Letter</th>
                    <th className="py-3 px-3 whitespace-nowrap">14. CV / Resume</th>
                    <th className="py-3 px-3 whitespace-nowrap">15. Application Date</th>
                    <th className="py-3 px-3 whitespace-nowrap">16. Status</th>
                    <th className="py-3 px-3 whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loadingApplications ? (
                    <tr>
                      <td colSpan={17} className="py-10 text-center text-slate-500">
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Loading submitted job applications...</span>
                        </span>
                      </td>
                    </tr>
                  ) : filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan={17} className="py-10 text-center text-slate-500">
                        No submitted applications match the current filters. Real applicant
                        submissions will appear here immediately once submitted.
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors align-top">
                        <td className="py-2.5 px-3 font-mono-tabular font-semibold text-[#0B1F3A] whitespace-nowrap">
                          {app.applicantCode}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-[#0B1F3A] whitespace-nowrap">
                          {app.fullName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{app.email}</td>
                        <td className="py-2.5 px-3 font-mono-tabular text-slate-700 whitespace-nowrap">
                          {app.phone}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{app.country}</td>
                        <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{app.state}</td>
                        <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{app.city}</td>
                        <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                          {app.jobCategory}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-[#0B1F3A] whitespace-nowrap">
                          {app.positionApplied}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 max-w-[160px] truncate" title={app.education}>
                          {app.education}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 max-w-[180px] truncate" title={getExperienceText(app)}>
                          {getExperienceText(app)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 max-w-[160px] truncate" title={app.skills}>
                          {app.skills}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 max-w-[180px] truncate" title={app.coverLetter}>
                          {app.coverLetter}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => void handleDownloadCv(app)}
                            className="inline-flex items-center gap-1 text-[#0B1F3A] font-semibold hover:text-[#B91C1C]"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span className="max-w-[120px] truncate">{app.cvFileName}</span>
                          </button>
                        </td>
                        <td className="py-2.5 px-3 font-mono-tabular text-slate-600 whitespace-nowrap">
                          {formatDateStr(app.createdAt)}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <select
                            value={app.status || 'pending'}
                            onChange={(e) =>
                              void handleInlineStatusChange(
                                app,
                                e.target.value as ApplicationStatus
                              )
                            }
                            className="px-2 py-1 text-xs font-semibold border border-slate-300 rounded bg-white text-[#0B1F3A]"
                          >
                            <option value="pending">Pending</option>
                            <option value="under_review">Under Review</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openApplicationDetail(app)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#0B1F3A] bg-slate-100 hover:bg-slate-200 rounded"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Open</span>
                            </button>
                            {confirmDeleteId === app.id ? (
                              <div className="inline-flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => void handleDeleteApp(app)}
                                  className="px-2 py-1 text-xs font-semibold text-white bg-[#B91C1C] rounded"
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-2 py-1 text-xs text-slate-600 bg-slate-100 rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(app.id)}
                                className="p-1.5 text-slate-500 hover:text-[#B91C1C] rounded"
                                aria-label={`Delete application ${app.applicantCode}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {adminTab === 'vacancies' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0B1F3A]">
                Verified Employer Vacancies
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Publish only authentic, employer-verified vacancies with verified salary ranges and
                deadlines.
              </p>
            </div>
            <button
              type="button"
              onClick={openNewVacancyModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Verified Vacancy</span>
            </button>
          </div>

          {vacancies.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-[#0B1F3A]">
                No Verified Vacancies Published Yet
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Click "Publish Verified Vacancy" above whenever an employer vacancy has been
                verified for listing.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vacancies.map((v) => (
                <div
                  key={v.id}
                  className="border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-[#B91C1C]">{v.verificationLabel}</span>
                      <span className="font-mono-tabular text-slate-500">{v.status}</span>
                    </div>
                    <h3 className="font-display text-base font-bold text-[#0B1F3A]">{v.title}</h3>
                    <p className="text-xs text-slate-600">
                      {v.employerName} · {v.location} · {v.employmentType}
                    </p>
                    <p className="text-xs text-slate-500">
                      {v.salaryVerified && v.salaryRange
                        ? `Verified Salary: ${v.salaryRange}`
                        : 'Salary pending employer verification'}{' '}
                      · Deadline: {v.deadline}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => openEditVacancy(v)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#0B1F3A] bg-slate-100 hover:bg-slate-200 rounded-lg"
                    >
                      Edit
                    </button>
                    {confirmDeleteVacId === v.id ? (
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => void handleDeleteVacancy(v.id)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg"
                        >
                          Confirm Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteVacId(null)}
                          className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteVacId(v.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#B91C1C] hover:bg-red-50 rounded-lg"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {adminTab === 'support' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
            <MessageSquare className="w-5 h-5 text-[#0B1F3A]" />
            <h2 className="font-display text-lg font-bold text-[#0B1F3A]">
              Applicant Support Inquiries ({supportInquiries.length})
            </h2>
          </div>

          {supportInquiries.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">
              No support tickets submitted yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-200">
              {supportInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-[#0B1F3A]">{inq.fullName}</span>
                      <span>·</span>
                      <span>{inq.email}</span>
                      <span>·</span>
                      <span>{formatDateStr(inq.createdAt)}</span>
                    </div>
                    <p className="text-sm font-bold text-[#0B1F3A]">{inq.subject}</p>
                    <p className="text-sm text-slate-600">{inq.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleResolveSupport(inq)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border shrink-0 ${
                      inq.status === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-white text-[#0B1F3A] border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{inq.status === 'Resolved' ? 'Resolved' : 'Mark Resolved'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Application Detail Drawer/Modal */}
      {selectedApp && (
        <div
          className="fixed inset-0 z-50 bg-[#0B1F3A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-mono-tabular text-xs font-semibold text-[#B91C1C]">
                  {selectedApp.applicantCode} · {selectedApp.applicationType}
                </p>
                <h3 className="font-display text-lg font-bold text-[#0B1F3A]">
                  {selectedApp.fullName} — {selectedApp.positionApplied}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close application details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div>
                  <p className="text-xs text-slate-500">Email &amp; Phone</p>
                  <p className="font-medium text-[#0B1F3A]">{selectedApp.email}</p>
                  <p className="font-mono-tabular text-xs text-slate-600">{selectedApp.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Residence</p>
                  <p className="font-medium text-[#0B1F3A]">
                    {selectedApp.city}, {selectedApp.state}, {selectedApp.country}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Department &amp; Job Category</p>
                  <p className="font-medium text-[#0B1F3A]">
                    {selectedApp.departmentName} — {selectedApp.jobCategory}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Educational Qualification</p>
                  <p className="font-medium text-[#0B1F3A]">{selectedApp.education}</p>
                </div>
              </div>

              {selectedApp.linkedinUrl && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">LinkedIn Profile</p>
                  <a
                    href={selectedApp.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#0B1F3A] underline"
                  >
                    <span>{selectedApp.linkedinUrl}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Relevant Work Experience</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                  {getExperienceText(selectedApp)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Skills</p>
                <p className="text-sm text-slate-700">{selectedApp.skills}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Cover Letter</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                  {selectedApp.coverLetter}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4">
                <div>
                  <p className="text-xs text-slate-500">Uploaded CV / Resume</p>
                  <p className="text-sm font-semibold text-[#0B1F3A]">{selectedApp.cvFileName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDownloadCv(selectedApp)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0B1F3A] hover:bg-[#132F54] rounded-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CV</span>
                </button>
              </div>

              {/* Admin Status Update */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <h4 className="font-display text-sm font-bold text-[#0B1F3A]">
                  Recruitment Review Action
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Application Status
                    </label>
                    <select
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value as ApplicationStatus)}
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Reviewer Notes (Visible to Applicant)
                    </label>
                    <input
                      type="text"
                      maxLength={2000}
                      value={modalNotes}
                      onChange={(e) => setModalNotes(e.target.value)}
                      placeholder="Optional status update note..."
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    disabled={savingApp}
                    onClick={() => void handleSaveApplicationReview()}
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] disabled:opacity-60 rounded-lg"
                  >
                    {savingApp ? 'Updating...' : 'Save Status Update'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish / Edit Verified Vacancy Modal */}
      {showVacancyForm && (
        <div
          className="fixed inset-0 z-50 bg-[#0B1F3A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-[#0B1F3A]">
                {editingVacancyId ? 'Edit Verified Vacancy' : 'Publish Verified Employer Vacancy'}
              </h3>
              <button
                type="button"
                onClick={() => setShowVacancyForm(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVacancy} className="p-6 space-y-4 text-sm">
              {vacancyError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{vacancyError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={160}
                    value={vacTitle}
                    onChange={(e) => setVacTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Verified Employer Name *
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={160}
                    value={vacEmployer}
                    onChange={(e) => setVacEmployer(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Job Category *
                  </label>
                  <select
                    value={vacCategory}
                    onChange={(e) => setVacCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {JOB_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.number}. {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employment Type *
                  </label>
                  <select
                    value={vacEmpType}
                    onChange={(e) => setVacEmpType(e.target.value as EmploymentType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    U.S. State *
                  </label>
                  <select
                    value={vacState}
                    onChange={(e) => setVacState(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={vacCity}
                    onChange={(e) => setVacCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Required Qualification Level *
                  </label>
                  <select
                    value={vacQualLevel}
                    onChange={(e) => setVacQualLevel(e.target.value as QualificationLevel)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {QUALIFICATION_LEVELS.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={vacDeadline}
                    onChange={(e) => setVacDeadline(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={vacVerified}
                    onChange={(e) => setVacVerified(e.target.checked)}
                  />
                  <span>Employer Verification Confirmed</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={vacSalaryVerified}
                    onChange={(e) => setVacSalaryVerified(e.target.checked)}
                  />
                  <span>Verified Salary Range Available</span>
                </label>
              </div>

              {vacSalaryVerified && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Verified Salary Range Display
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      value={vacSalaryRange}
                      onChange={(e) => setVacSalaryRange(e.target.value)}
                      placeholder="e.g., $78,000 - $94,000 / yr"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Minimum Annual Salary (USD, for filter)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10000000}
                      value={vacSalaryMin}
                      onChange={(e) => setVacSalaryMin(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Required Qualifications Detail *
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={1000}
                  value={vacQualDetail}
                  onChange={(e) => setVacQualDetail(e.target.value)}
                  placeholder="Licensure, degree, or years of experience..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Description * (minimum 10 characters)
                </label>
                <textarea
                  required
                  rows={4}
                  minLength={10}
                  maxLength={4000}
                  value={vacDescription}
                  onChange={(e) => setVacDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <select
                  value={vacStatus}
                  onChange={(e) => setVacStatus(e.target.value as 'Open' | 'Closed')}
                  className="px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Open">Status: Open</option>
                  <option value="Closed">Status: Closed</option>
                </select>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowVacancyForm(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingVacancy}
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#0B1F3A] hover:bg-[#132F54] rounded-lg"
                  >
                    {savingVacancy ? 'Saving...' : 'Save Vacancy'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
