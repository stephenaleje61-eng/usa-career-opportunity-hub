import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import { Menu, X } from 'lucide-react';

export type ActiveView =
  | 'opportunities'
  | 'departments'
  | 'jobDetail'
  | 'tracker'
  | 'support'
  | 'admin'
  | 'privacy'
  | 'terms'
  | 'antifraud';

interface NavbarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  user: User | null;
  isAdmin: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  user,
  isAdmin,
  onSignIn,
  onSignOut
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { id: ActiveView; label: string }[] = [
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'departments', label: 'Departments' },
    { id: 'tracker', label: 'My Applications' },
    { id: 'support', label: 'Support & FAQ' },
    ...(isAdmin ? [{ id: 'admin' as ActiveView, label: 'Admin Console' }] : [])
  ];

  const handleNav = (view: ActiveView) => {
    onNavigate(view);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand wordmark */}
        <button
          type="button"
          onClick={() => handleNav('opportunities')}
          className="text-left font-display font-extrabold text-base sm:text-lg tracking-tight text-[#0B1F3A] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B1F3A]"
        >
          USA Career &amp; Opportunity Hub
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary Navigation">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B1F3A] ${
                  isActive
                    ? 'border-[#B91C1C] text-[#0B1F3A] font-semibold'
                    : 'border-transparent text-slate-600 hover:text-[#0B1F3A] hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {user ? (
            <button
              type="button"
              onClick={onSignOut}
              className="px-4 py-2 text-xs font-semibold text-[#0B1F3A] bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title={`Signed in as ${user.email || user.displayName || 'User'}`}
            >
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0B1F3A] hover:bg-[#132F54] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#0B1F3A] hover:bg-slate-100 transition-colors"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`block w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#0B1F3A] text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-200">
            {user ? (
              <div className="flex items-center justify-between gap-3 px-2 py-2">
                <span className="text-xs text-slate-600 truncate">{user.email}</span>
                <button
                  type="button"
                  onClick={() => {
                    onSignOut();
                    setMobileOpen(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-[#0B1F3A] bg-slate-100 border border-slate-200 rounded-lg whitespace-nowrap shrink-0"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onSignIn();
                  setMobileOpen(false);
                }}
                className="w-full px-4 py-3 text-sm font-semibold text-white bg-[#0B1F3A] rounded-lg"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
