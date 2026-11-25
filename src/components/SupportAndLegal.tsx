import React, { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Lock,
  MessageSquare,
  ShieldAlert
} from 'lucide-react';
import { extractReadableError, TELEGRAM_SUPPORT_URL } from '../lib/firebase';
import { submitSupportInquiry } from '../lib/careerService';
import type { ActiveView } from './Navbar';
import { TelegramCtaBanner } from './TelegramCtaBanner';

interface SupportAndLegalProps {
  view: Extract<ActiveView, 'support' | 'privacy' | 'terms' | 'antifraud'>;
  user: User | null;
  onSignIn: () => void;
  onNavigate: (view: ActiveView) => void;
}

const FAQS = [
  {
    q: 'What is the difference between a Verified Vacancy and a General Career Category?',
    a: 'A Verified Employer Vacancy is a specific job opening published and verified by an authorized administrator with an identified employer, verified location, and verified salary range when confirmed. General Career Categories represent the 300 standardized U.S. occupational pathways across 30 departments where applicants can submit their qualifications to our talent pool without an attached employer claim.'
  },
  {
    q: 'Is there any fee to submit an application on USA Career & Opportunity Hub?',
    a: 'No. Applying for opportunities on USA Career & Opportunity Hub is completely free. Never pay any third party for job placement, application review, or expedited consideration.'
  },
  {
    q: 'What documents should I upload, and what sensitive information is prohibited?',
    a: 'Please upload only your professional CV or Resume (PDF, DOC, DOCX, PNG, or JPG, up to 5 MB). Never include or transmit bank passwords, payment card numbers, Social Security numbers (SSN), passport scans, or unrelated identity documents.'
  },
  {
    q: 'How do I track my submitted job application?',
    a: 'Sign in with your Google account and open "My Applications" in the top navigation bar. You will see your unique Applicant Code, submission date, and live review status (Pending, Under Review, Shortlisted, or Rejected).'
  },
  {
    q: 'Is contacting the Telegram support link required for selection?',
    a: 'No. Contacting the published Telegram link is strictly for platform support and registration assistance and does not guarantee employment or recruitment.'
  }
];

export const SupportAndLegal: React.FC<SupportAndLegalProps> = ({
  view,
  user,
  onSignIn,
  onNavigate
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!user) return;
    setFullName((prev) => prev || user.displayName || '');
    setEmail((prev) => prev || user.email || '');
  }, [user]);

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!user) {
      onSignIn();
      return;
    }
    if (fullName.trim().length < 2 || subject.trim().length < 3 || message.trim().length < 10) {
      setErrorMsg('Please complete your name, subject (3+ characters), and message (10+ characters).');
      return;
    }
    setSubmitting(true);
    try {
      const id = await submitSupportInquiry({
        fullName: fullName.trim(),
        email: email.trim() || user.email || '',
        subject: subject.trim(),
        message: message.trim()
      });
      setSubmittedId(id);
      setSubject('');
      setMessage('');
    } catch (err) {
      setErrorMsg(extractReadableError(err, 'Unable to send inquiry.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (view === 'privacy') {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3 text-[#0B1F3A]">
            <Lock className="w-6 h-6 text-[#B91C1C]" />
            <h1 className="font-display text-2xl sm:text-3xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            USA Career &amp; Opportunity Hub is committed to protecting applicant privacy and limiting
            data collection strictly to employment recruitment purposes.
          </p>
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <div>
              <h2 className="font-semibold text-[#0B1F3A] mb-1">1. Information We Collect</h2>
              <p>
                When you create an account or submit an application, we collect your name, email
                address, phone number, country/state/city of residence, selected job category,
                educational qualification, work experience, skills, cover letter, optional LinkedIn
                URL, and your uploaded CV/Resume file.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-[#0B1F3A] mb-1">2. Prohibited Sensitive Data</h2>
              <p>
                We strictly prohibit collecting bank passwords, payment card details, Social
                Security numbers (SSN), or unrelated government identity documents through our
                application forms.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-[#0B1F3A] mb-1">3. Access Controls &amp; Storage</h2>
              <p>
                Applicant records and CVs are protected by Firebase Authentication and Cloud
                Firestore security rules. Applicant records are never exposed publicly and are
                readable only by the submitting applicant and authorized platform administrators.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('opportunities')}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#0B1F3A] rounded-lg hover:bg-[#132F54]"
          >
            Return to Opportunities
          </button>
        </div>
      </section>
    );
  }

  if (view === 'terms') {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 space-y-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
            Terms &amp; Conditions
          </h1>
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <div>
              <h2 className="font-semibold text-[#0B1F3A] mb-1">1. Platform Role</h2>
              <p>
                USA Career &amp; Opportunity Hub provides a recruitment discovery and application
                portal across 300 career categories and administrator-verified vacancies. Submitting
                an application does not constitute an offer or guarantee of employment or visa
                sponsorship.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-[#0B1F3A] mb-1">2. Truthful Submissions</h2>
              <p>
                Applicants agree to provide accurate, truthful qualification, experience, and
                contact details. Misrepresentation may result in application rejection or removal.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-[#0B1F3A] mb-1">3. Authorized Representations</h2>
              <p>
                No individual is represented as a CEO, recruiter, or hiring manager of external
                employers without formal written authorization. Verified vacancies explicitly display
                employer verification status.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('opportunities')}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#0B1F3A] rounded-lg hover:bg-[#132F54]"
          >
            Return to Opportunities
          </button>
        </div>
      </section>
    );
  }

  if (view === 'antifraud') {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white border border-red-200 rounded-xl p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-[#B91C1C]" />
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1F3A]">
              Anti-Fraud &amp; Recruitment Safety Warning
            </h1>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-5 text-sm text-red-900 space-y-2">
            <p className="font-semibold">
              USA Career &amp; Opportunity Hub NEVER charges applicants any fee to apply, interview,
              or be considered for employment.
            </p>
            <p>
              Protect yourself against employment scams by verifying every communication and refusing
              requests for money, gift cards, banking credentials, or Social Security numbers.
            </p>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700 leading-relaxed">
            <li>Never share bank account passwords, PINs, or credit/debit card numbers.</li>
            <li>Never pay processing, training, or equipment fees prior to verified employment.</li>
            <li>
              Official support via Telegram ({TELEGRAM_SUPPORT_URL}) is strictly optional for
              general guidance and never requests financial payments or guarantees job placement.
            </li>
            <li>
              Always verify whether a listing is marked as a Verified Employer Vacancy versus a
              General Career Category talent pool submission.
            </li>
          </ul>
          <button
            type="button"
            onClick={() => onNavigate('opportunities')}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#0B1F3A] rounded-lg hover:bg-[#132F54]"
          >
            Return to Opportunities
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="max-w-3xl space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1F3A] tracking-tight">
          Applicant Support &amp; Frequently Asked Questions
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Review common questions regarding applications, verified vacancies, and recruitment safety,
          or send a direct inquiry to our support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FAQ Column */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <HelpCircle className="w-5 h-5 text-[#B91C1C]" />
            <h2 className="font-display text-xl font-bold text-[#0B1F3A]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-slate-200">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left font-semibold text-sm sm:text-base text-[#0B1F3A] hover:text-[#B91C1C] transition-colors"
                  >
                    <span>{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 shrink-0 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0 text-slate-500" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">{item.a}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <TelegramCtaBanner variant="compact" />
          </div>
        </div>

        {/* Contact Support Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <MessageSquare className="w-5 h-5 text-[#0B1F3A]" />
            <h2 className="font-display text-xl font-bold text-[#0B1F3A]">Contact Support</h2>
          </div>

          {!user && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
              <p className="text-xs text-slate-700 leading-relaxed">
                Sign in with your verified Google account to log a tracked support inquiry directly
                with our team.
              </p>
              <button
                type="button"
                onClick={onSignIn}
                className="w-full py-2.5 px-4 bg-[#0B1F3A] text-white text-xs font-semibold rounded-lg hover:bg-[#132F54]"
              >
                Sign In with Google
              </button>
            </div>
          )}

          {submittedId && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 space-y-1">
                <p className="font-semibold">Support inquiry recorded</p>
                <p>Reference ID: {submittedId}. Our team will review your message shortly.</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 text-xs text-red-800">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSupportSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                maxLength={120}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                maxLength={160}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                required
                maxLength={200}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Application question or technical support"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
              <textarea
                required
                rows={4}
                maxLength={3000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe how our support team can assist you..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-[#0B1F3A] hover:bg-[#132F54] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {submitting ? 'Sending Inquiry...' : 'Submit Support Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
