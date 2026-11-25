/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { AlertTriangle, X } from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard';
import { ApplicantPortal } from './components/ApplicantPortal';
import { ApplicationModal, type ApplicationTarget } from './components/ApplicationModal';
import { DepartmentsDirectory } from './components/DepartmentsDirectory';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { JobDetailPage, type JobDetailSelection } from './components/JobDetailPage';
import { Navbar, type ActiveView } from './components/Navbar';
import { OpportunitiesHome } from './components/OpportunitiesHome';
import { SupportAndLegal } from './components/SupportAndLegal';
import { JOB_CATEGORIES } from './data/categories';
import {
  checkIsAdmin,
  ensureUserProfile,
  subscribeToAllApplications,
  subscribeToAllUsers,
  subscribeToFavorites,
  subscribeToSupportInquiries,
  subscribeToUserApplications,
  subscribeToUserProfile,
  subscribeToVacancies,
  toggleFavoriteJob
} from './lib/careerService';
import { auth, extractReadableError, googleProvider } from './lib/firebase';
import type {
  FavoriteJob,
  JobApplication,
  JobCategory,
  SupportInquiry,
  UserProfile,
  VerifiedVacancy
} from './types/career';

function getPathForView(view: ActiveView, detail?: JobDetailSelection | null): string {
  switch (view) {
    case 'departments':
      return '/departments';
    case 'tracker':
      return '/tracker';
    case 'support':
      return '/support';
    case 'admin':
      return '/admin';
    case 'privacy':
      return '/privacy';
    case 'terms':
      return '/terms';
    case 'antifraud':
      return '/antifraud';
    case 'jobDetail':
      if (detail?.type === 'category') return `/jobs/${encodeURIComponent(detail.category.id)}`;
      if (detail?.type === 'vacancy') return `/jobs/${encodeURIComponent(detail.vacancy.id)}`;
      return '/';
    case 'opportunities':
    default:
      return '/';
  }
}

function parseRoute(
  pathname: string,
  vacancies: VerifiedVacancy[]
): { view: ActiveView; detail: JobDetailSelection | null; pendingJobSlug: string | null } {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/departments') return { view: 'departments', detail: null, pendingJobSlug: null };
  if (clean === '/tracker' || clean === '/my-applications')
    return { view: 'tracker', detail: null, pendingJobSlug: null };
  if (clean === '/support') return { view: 'support', detail: null, pendingJobSlug: null };
  if (clean === '/admin') return { view: 'admin', detail: null, pendingJobSlug: null };
  if (clean === '/privacy') return { view: 'privacy', detail: null, pendingJobSlug: null };
  if (clean === '/terms') return { view: 'terms', detail: null, pendingJobSlug: null };
  if (clean === '/antifraud') return { view: 'antifraud', detail: null, pendingJobSlug: null };
  if (clean.startsWith('/jobs/')) {
    const slug = decodeURIComponent(clean.slice('/jobs/'.length));
    const cat = JOB_CATEGORIES.find((c) => c.id === slug);
    if (cat) {
      return { view: 'jobDetail', detail: { type: 'category', category: cat }, pendingJobSlug: null };
    }
    const vac = vacancies.find((v) => v.id === slug);
    if (vac) {
      return { view: 'jobDetail', detail: { type: 'vacancy', vacancy: vac }, pendingJobSlug: null };
    }
    return { view: 'opportunities', detail: null, pendingJobSlug: slug };
  }
  return { view: 'opportunities', detail: null, pendingJobSlug: null };
}

function MainApp() {
  const initialRoute =
    typeof window !== 'undefined'
      ? parseRoute(window.location.pathname, [])
      : { view: 'opportunities' as ActiveView, detail: null, pendingJobSlug: null };

  const [activeView, setActiveView] = useState<ActiveView>(initialRoute.view);
  const [returnView, setReturnView] = useState<ActiveView>('opportunities');
  const [selectedJobDetail, setSelectedJobDetail] = useState<JobDetailSelection | null>(
    initialRoute.detail
  );
  const [pendingJobSlug, setPendingJobSlug] = useState<string | null>(initialRoute.pendingJobSlug);

  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authNotice, setAuthNotice] = useState('');

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [vacancies, setVacancies] = useState<VerifiedVacancy[]>([]);
  const [userApplications, setUserApplications] = useState<JobApplication[]>([]);
  const [userAppsLoading, setUserAppsLoading] = useState(false);
  const [userAppsError, setUserAppsError] = useState('');
  const [favorites, setFavorites] = useState<FavoriteJob[]>([]);

  // Admin datasets
  const [allApplications, setAllApplications] = useState<JobApplication[]>([]);
  const [adminAppsLoading, setAdminAppsLoading] = useState(false);
  const [adminAppsError, setAdminAppsError] = useState('');
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [supportInquiries, setSupportInquiries] = useState<SupportInquiry[]>([]);

  // Application Modal Target
  const [applyTarget, setApplyTarget] = useState<ApplicationTarget | null>(null);

  // Resolve deep-linked verified vacancy once Firestore vacancies load
  useEffect(() => {
    if (!pendingJobSlug || vacancies.length === 0) return;
    const vac = vacancies.find((v) => v.id === pendingJobSlug);
    if (vac) {
      setSelectedJobDetail({ type: 'vacancy', vacancy: vac });
      setActiveView('jobDetail');
      setPendingJobSlug(null);
    }
  }, [pendingJobSlug, vacancies]);

  // Browser back/forward button synchronization
  useEffect(() => {
    const onPopState = () => {
      const parsed = parseRoute(window.location.pathname, vacancies);
      setActiveView(parsed.view);
      setSelectedJobDetail(parsed.detail);
      setPendingJobSlug(parsed.pendingJobSlug);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [vacancies]);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await ensureUserProfile(currentUser);
        } catch (err) {
          console.warn('User profile sync notice:', err);
        }
        const adminStatus = await checkIsAdmin(currentUser);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
        setUserProfile(null);
        setUserApplications([]);
        setUserAppsLoading(false);
        setUserAppsError('');
        setFavorites([]);
        setAllApplications([]);
        setAdminAppsLoading(false);
        setAdminAppsError('');
        setAllUsers([]);
        setSupportInquiries([]);
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Public or Admin Vacancies listener
  useEffect(() => {
    if (!authReady) return;
    const unsub = subscribeToVacancies(isAdmin, setVacancies, (msg) => {
      console.warn('Vacancies listener warning:', msg);
    });
    return () => unsub();
  }, [authReady, isAdmin]);

  // Authenticated Applicant Listeners
  useEffect(() => {
    if (!authReady || !user) return;
    setUserAppsLoading(true);
    setUserAppsError('');

    const unsubProfile = subscribeToUserProfile(user.uid, setUserProfile, (msg) => {
      console.warn('Profile listener warning:', msg);
    });
    const unsubApps = subscribeToUserApplications(
      user.uid,
      (apps) => {
        setUserApplications(apps);
        setUserAppsLoading(false);
        setUserAppsError('');
      },
      (msg) => {
        setUserAppsLoading(false);
        setUserAppsError(`Unable to load your applications: ${msg}`);
      }
    );
    const unsubFavs = subscribeToFavorites(user.uid, setFavorites, (msg) => {
      console.warn('Favorites listener warning:', msg);
    });
    const unsubSupport = subscribeToSupportInquiries(isAdmin, user.uid, setSupportInquiries, (msg) => {
      console.warn('Support listener warning:', msg);
    });
    return () => {
      unsubProfile();
      unsubApps();
      unsubFavs();
      unsubSupport();
    };
  }, [authReady, user, isAdmin]);

  // Admin-only Listeners
  useEffect(() => {
    if (!authReady || !user || !isAdmin) return;
    setAdminAppsLoading(true);
    setAdminAppsError('');

    const unsubAllApps = subscribeToAllApplications(
      (apps) => {
        setAllApplications(apps);
        setAdminAppsLoading(false);
        setAdminAppsError('');
      },
      (msg) => {
        setAdminAppsLoading(false);
        setAdminAppsError(`Unable to load job applications: ${msg}`);
      }
    );
    const unsubAllUsers = subscribeToAllUsers(setAllUsers, (msg) => {
      console.warn('Users listener warning:', msg);
    });
    return () => {
      unsubAllApps();
      unsubAllUsers();
    };
  }, [authReady, user, isAdmin]);

  const pushRoute = (view: ActiveView, detail?: JobDetailSelection | null) => {
    if (typeof window === 'undefined') return;
    const nextPath = getPathForView(view, detail);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
  };

  const handleSignIn = async () => {
    setAuthNotice('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const msg = extractReadableError(err, 'Unable to complete Google sign-in.');
      if (msg.includes('auth/unauthorized-domain')) {
        setAuthNotice(
          `Domain authorization required: Add "${window.location.hostname}" to Firebase Console -> Authentication -> Settings -> Authorized domains.`
        );
      } else if (msg.includes('auth/popup-blocked')) {
        setAuthNotice('Sign-in popup was blocked by your browser. Please allow popups for this site and try again.');
      } else if (!msg.includes('popup-closed-by-user')) {
        setAuthNotice(msg);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      if (activeView === 'admin') {
        setActiveView('opportunities');
        pushRoute('opportunities');
      }
    } catch (err) {
      setAuthNotice(extractReadableError(err, 'Unable to sign out.'));
    }
  };

  const handleNavigate = (view: ActiveView) => {
    if (view !== 'jobDetail') {
      setSelectedJobDetail(null);
      setPendingJobSlug(null);
    }
    setActiveView(view);
    pushRoute(view, view === 'jobDetail' ? selectedJobDetail : null);
  };

  const handleOpenJobDetail = (detail: JobDetailSelection, fromView: ActiveView) => {
    setReturnView(fromView);
    setSelectedJobDetail(detail);
    setPendingJobSlug(null);
    setActiveView('jobDetail');
    pushRoute('jobDetail', detail);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavoriteCategory = async (cat: JobCategory) => {
    if (!user) {
      setAuthNotice('Sign in with Google to save favorite career categories.');
      await handleSignIn();
      return;
    }
    const isSaved = favorites.some((f) => f.itemId === cat.id);
    try {
      await toggleFavoriteJob(
        user.uid,
        {
          itemType: 'category',
          itemId: cat.id,
          title: cat.title,
          departmentName: cat.departmentName
        },
        isSaved
      );
    } catch (err) {
      setAuthNotice(extractReadableError(err, 'Unable to update saved jobs.'));
    }
  };

  const handleToggleFavoriteVacancy = async (vac: VerifiedVacancy) => {
    if (!user) {
      setAuthNotice('Sign in with Google to save favorite verified vacancies.');
      await handleSignIn();
      return;
    }
    const isSaved = favorites.some((f) => f.itemId === vac.id);
    try {
      await toggleFavoriteJob(
        user.uid,
        {
          itemType: 'vacancy',
          itemId: vac.id,
          title: vac.title,
          departmentName: vac.departmentName
        },
        isSaved
      );
    } catch (err) {
      setAuthNotice(extractReadableError(err, 'Unable to update saved jobs.'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] text-[#0B1F3A]">
      <Navbar
        activeView={activeView}
        onNavigate={handleNavigate}
        user={user}
        isAdmin={isAdmin}
        onSignIn={() => void handleSignIn()}
        onSignOut={() => void handleSignOut()}
      />

      {authNotice && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5">
          <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-700" />
              <span>{authNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setAuthNotice('')}
              className="p-1 hover:bg-amber-100 rounded"
              aria-label="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <main className="flex-1">
        {activeView === 'opportunities' && (
          <OpportunitiesHome
            vacancies={vacancies}
            favorites={favorites}
            onApply={(target) => setApplyTarget(target)}
            onOpenJobDetail={(detail) => handleOpenJobDetail(detail, 'opportunities')}
            onToggleFavoriteCategory={(cat) => void handleToggleFavoriteCategory(cat)}
            onToggleFavoriteVacancy={(vac) => void handleToggleFavoriteVacancy(vac)}
            onOpenDepartments={() => {
              handleNavigate('departments');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'departments' && (
          <DepartmentsDirectory
            favorites={favorites}
            onApply={(target) => setApplyTarget(target)}
            onOpenJobDetail={(detail) => handleOpenJobDetail(detail, 'departments')}
            onToggleFavorite={(cat) => void handleToggleFavoriteCategory(cat)}
          />
        )}

        {activeView === 'jobDetail' && selectedJobDetail && (
          <JobDetailPage
            detail={selectedJobDetail}
            favorites={favorites}
            onBack={() => handleNavigate(returnView)}
            onApply={(target) => setApplyTarget(target)}
            onToggleFavoriteCategory={(cat) => void handleToggleFavoriteCategory(cat)}
            onToggleFavoriteVacancy={(vac) => void handleToggleFavoriteVacancy(vac)}
          />
        )}

        {activeView === 'tracker' && (
          <ApplicantPortal
            user={user}
            userProfile={userProfile}
            applications={userApplications}
            loadingApplications={userAppsLoading}
            applicationsError={userAppsError}
            favorites={favorites}
            vacancies={vacancies}
            onSignIn={handleSignIn}
            onApply={(target) => setApplyTarget(target)}
            onBrowseOpportunities={() => handleNavigate('opportunities')}
          />
        )}

        {(activeView === 'support' ||
          activeView === 'privacy' ||
          activeView === 'terms' ||
          activeView === 'antifraud') && (
          <SupportAndLegal
            view={activeView}
            user={user}
            onSignIn={() => void handleSignIn()}
            onNavigate={handleNavigate}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboard
            user={user}
            isAdmin={isAdmin}
            users={allUsers}
            applications={allApplications}
            loadingApplications={adminAppsLoading}
            applicationsError={adminAppsError}
            vacancies={vacancies}
            supportInquiries={supportInquiries}
            onSignIn={handleSignIn}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      <ApplicationModal
        target={applyTarget}
        user={user}
        onClose={() => setApplyTarget(null)}
        onSignIn={handleSignIn}
        onViewTracker={() => handleNavigate('tracker')}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
