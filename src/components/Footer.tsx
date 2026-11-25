import React from 'react';
import type { ActiveView } from './Navbar';
import { TELEGRAM_SUPPORT_URL } from '../lib/firebase';

interface FooterProps {
  onNavigate: (view: ActiveView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const go = (view: ActiveView) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1F3A] text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="md:col-span-2 space-y-3">
            <h2 className="font-display text-lg font-bold text-white">
              USA Career &amp; Opportunity Hub
            </h2>
            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              Discover Opportunities. Apply for Jobs. Build Your American Dream. Explore 300 career
              categories across 30 U.S. employment departments and employer-verified vacancies.
            </p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed pt-1">
              Equal Opportunity &amp; Transparency Notice: General career categories represent open
              talent pool submissions and do not imply an active partnership with any unlisted
              employer.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white tracking-wide">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => go('opportunities')}
                  className="hover:text-white transition-colors"
                >
                  Browse Opportunities
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('departments')}
                  className="hover:text-white transition-colors"
                >
                  30 Employment Departments
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('tracker')}
                  className="hover:text-white transition-colors"
                >
                  Applicant Account &amp; Tracking
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('support')}
                  className="hover:text-white transition-colors"
                >
                  Contact Support &amp; FAQ
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white tracking-wide">Governance &amp; Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => go('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go('antifraud')}
                  className="hover:text-white transition-colors text-red-300"
                >
                  Anti-Fraud Warning
                </button>
              </li>
              <li>
                <a
                  href={TELEGRAM_SUPPORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-block"
                >
                  Join Official Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} USA Career &amp; Opportunity Hub. All rights reserved.</p>
          <p>
            No application fees · No banking or SSN data collected · Verified employer disclosures
          </p>
        </div>
      </div>
    </footer>
  );
};
