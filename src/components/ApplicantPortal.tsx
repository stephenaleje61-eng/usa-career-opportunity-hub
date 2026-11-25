import React, { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Trash2,
  UserCheck
} from 'lucide-react';
import { JOB_CATEGORIES } from '../data/categories';
import {
  downloadApplicationCv,
  ensureUserProfile,
  toggleFavoriteJob
} from '../lib/careerService';
import { extractReadableError } from '../lib/firebase';
import type {
  ApplicationStatus,
  FavoriteJob,
  JobApplication,
  UserProfile,
  VerifiedVacancy
} from '../types/career';
import type { ApplicationTarget } from './ApplicationModal';
import { TelegramCtaBanner } from './TelegramCtaBanner';

interface ApplicantPortalProps {
  user: User | null;
  userProfile: UserProfile | null;
  applications: JobApplication[];
  loadingApplications: boolean;
  applicationsError: string;
  favorites: FavoriteJob[];
  vacancies: VerifiedVacancy[];
  onSignIn: () => Promise<void>;
  onApply: (target: ApplicationTarget) => void;
  onBrowseOpportunities: () => void;
}

function formatFirestoreDate(ts: unknown): string {
  if (!ts) return 'Just now';
  if (
    typeof ts === 'object' &&
    ts !== null &&
    'toDate' in ts &&
    typeof (ts as { toDate: () => Date }).toDate === 'function'
  ) {
    return (ts as { toDate: () => Date }).toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  return 'Recent';
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

function statusStyles(status: ApplicationStatus | string): string {
  switch (status) {
    case 'shortlisted':
    case 'Shortlisted':
      return 'text-emerald-800 bg-emerald-50 border-emerald-200';
    case 'under_review':
    case 'Under Review':
      return 'text-amber-800 bg-amber-50 border-amber-200';
    case 'rejected':
    case 'Rejected':
      return 'text-red-800 bg-red-50 border-red-200';
    default:
      return 'text-[#0B1F3A] bg-slate-100 border-slate-200';
  }
}

export const ApplicantPortal: React.FC<ApplicantPortalProps> = ({
  user,
  userProfile,
  applications,
  loadingApplications,
  applicationsError,
  favorites,
  vacancies,
  onSignIn,
  onApply,
  onBrowseOpportunities
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'favorites' | 'profile'>(
    'applications'
  );
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [country, setCountry] = useState('United States');
  const [stateVal, setStateVal] = useState('');
  const [city, setCity] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    setDisplayName(userProfile?.displayName || user?.displayName || '');
    setCountry(userProfile?.country || 'United States');
    setStateVal(userProfile?.state || '');
    setCity(userProfile?.city || '');
  }, [userProfile, user]);

  if (!user) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 text-center space-y-5">
          <UserCheck className="w-10 h-10 text-[#0B1F3A] mx-auto" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
            Applicant Account &amp; Application Tracking
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Sign in with your Google account to view your submitted applications, track real-time
            recruitment status updates, and manage your saved favorite career opportunities.
          </p>
          <button
            type="button"
            onClick={() => void onSignIn()}
            className="px-6 py-3 text-sm font-semibold text-white bg-[#0B1F3A] hover:bg-[#132F54] rounded-lg transition-colors"
          >
            Sign In with Google
          </button>
        </div>
        <TelegramCtaBanner />
      </section>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSaved(false);
    setActionError('');
    try {
      await ensureUserProfile(user, {
        displayName: displayName.trim() || user.displayName || 'Applicant',
        country: country.trim(),
        state: stateVal.trim(),
        city: city.trim()
      });
      setProfileSaved(true);
    } catch (err) {
      setActionError(extractReadableError(err, 'Unable to save profile.'));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDownloadCv = async (app: JobApplication) => {
    setActionError('');
    try {
      await downloadApplicationCv(app);
    } catch (err) {
      setActionError(extractReadableError(err, 'Unable to download CV file.'));
    }
  };

  const handleRemoveFavorite = async (fav: FavoriteJob) => {
    setActionError('');
    try {
      await toggleFavoriteJob(
        user.uid,
        {
          itemType: fav.itemType,
          itemId: fav.itemId,
          title: fav.title,
          departmentName: fav.departmentName
        },
        true
      );
    } catch (err) {
      setActionError(extractReadableError(err, 'Unable to remove saved job.'));
    }
  };

  const handleApplyFavorite = (fav: FavoriteJob) => {
    if (fav.itemType === 'vacancy') {
      const vac = vacancies.find((v) => v.id === fav.itemId);
      if (vac) {
        onApply({ type: 'vacancy', vacancy: vac });
        return;
      }
    }
    const cat = JOB_CATEGORIES.find((c) => c.id === fav.itemId || c.title === fav.title);
    if (cat) {
      onApply({ type: 'category', category: cat });
    }
  };

  return (
    <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500">
            Applicant Portal · {user.email}
          </p>
          <h1 className="font-display text-3xl font-bold text-[#0B1F3A]">
            My Account &amp; Applications
          </h1>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg self-start">
          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'applications'
                ? 'bg-white text-[#0B1F3A] shadow-xs'
                : 'text-slate-600 hover:text-[#0B1F3A]'
            }`}
          >
            Applications ({applications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'bg-white text-[#0B1F3A] shadow-xs'
                : 'text-slate-600 hover:text-[#0B1F3A]'
            }`}
          >
            Saved Jobs ({favorites.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-white text-[#0B1F3A] shadow-xs'
                : 'text-slate-600 hover:text-[#0B1F3A]'
            }`}
          >
            Account Profile
          </button>
        </div>
      </div>

      {(applicationsError || actionError) && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2.5 text-xs text-red-900"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#B91C1C]" />
          <span>{applicationsError || actionError}</span>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="space-y-4">
          {loadingApplications ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
              <Loader2 className="w-7 h-7 text-[#0B1F3A] mx-auto animate-spin" />
              <p className="text-sm font-medium text-slate-600">
                Loading your submitted applications...
              </p>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-4">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <h2 className="font-display text-lg font-bold text-[#0B1F3A]">
                No Applications Submitted Yet
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Explore our 300 U.S. job categories or verified employer vacancies and click APPLY
                NOW to submit your first application.
              </p>
              <button
                type="button"
                onClick={onBrowseOpportunities}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0B1F3A] hover:bg-[#132F54] rounded-lg transition-colors"
              >
                Browse Opportunities
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono-tabular font-semibold text-[#0B1F3A]">
                        {app.applicantCode}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{app.applicationType}</span>
                      <span aria-hidden="true">·</span>
                      <span>Submitted {formatFirestoreDate(app.createdAt)}</span>
                    </div>
                    <h2 className="font-display text-lg font-bold text-[#0B1F3A]">
                      {app.positionApplied}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {app.departmentName} — {app.jobCategory} · {app.city}, {app.state},{' '}
                      {app.country}
                    </p>
                    {app.adminNotes && (
                      <p className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3 mt-2">
                        <strong>Reviewer Note:</strong> {app.adminNotes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <span
                      className={`px-3 py-1.5 text-xs font-semibold border rounded-md ${statusStyles(
                        app.status
                      )}`}
                    >
                      Status: {formatStatusLabel(app.status)}
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleDownloadCv(app)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0B1F3A] bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download CV</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favorites.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-4">
              <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
              <h2 className="font-display text-lg font-bold text-[#0B1F3A]">No Saved Jobs Yet</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Click &quot;Save&quot; on any career category or verified employer vacancy to
                bookmark it here for quick access.
              </p>
              <button
                type="button"
                onClick={onBrowseOpportunities}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0B1F3A] hover:bg-[#132F54] rounded-lg transition-colors"
              >
                Explore 300 Categories
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">
                      {fav.itemType === 'vacancy' ? 'Verified Vacancy' : 'Career Category'} ·{' '}
                      {fav.departmentName}
                    </p>
                    <h3 className="font-display text-base font-bold text-[#0B1F3A]">{fav.title}</h3>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleApplyFavorite(fav)}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors"
                    >
                      APPLY NOW
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleRemoveFavorite(fav)}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:text-[#B91C1C] rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <form
          onSubmit={handleSaveProfile}
          className="max-w-xl bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4"
        >
          <h2 className="font-display text-lg font-bold text-[#0B1F3A]">Applicant Profile</h2>
          {profileSaved && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Account profile updated successfully.</span>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name</label>
            <input
              type="text"
              required
              maxLength={120}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={user.email || ''}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 bg-slate-50 text-slate-500 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
              <input
                type="text"
                maxLength={100}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
              <input
                type="text"
                maxLength={100}
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
                placeholder="e.g., Texas"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                maxLength={100}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Dallas"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0B1F3A] hover:bg-[#132F54] rounded-lg transition-colors"
          >
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      )}

      <TelegramCtaBanner />
    </section>
  );
};
