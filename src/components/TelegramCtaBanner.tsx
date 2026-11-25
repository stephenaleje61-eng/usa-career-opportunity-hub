import React from 'react';
import { ExternalLink, Send } from 'lucide-react';
import { TELEGRAM_SUPPORT_URL } from '../lib/firebase';

interface TelegramCtaBannerProps {
  variant?: 'default' | 'compact' | 'confirmation';
}

export const TelegramCtaBanner: React.FC<TelegramCtaBannerProps> = ({ variant = 'default' }) => {
  const isCompact = variant === 'compact';
  const isConfirmation = variant === 'confirmation';

  return (
    <div
      className={`rounded-xl border ${
        isConfirmation
          ? 'bg-[#0B1F3A] border-[#0B1F3A] text-white p-6 sm:p-8 shadow-lg'
          : isCompact
          ? 'bg-slate-50 border-slate-200 text-[#0B1F3A] p-4 sm:p-5'
          : 'bg-[#0B1F3A] border-[#0B1F3A] text-white p-6 sm:p-8 shadow-md'
      } space-y-4`}
    >
      <div className="flex flex-col gap-3">
        <div className="space-y-1.5">
          <p
            className={`text-xs font-bold uppercase tracking-wider ${
              isCompact ? 'text-[#B91C1C]' : 'text-red-300'
            }`}
          >
            Official Registration Support Channel
          </p>
          <h3
            className={`font-display text-base sm:text-lg font-extrabold tracking-tight ${
              isCompact ? 'text-[#0B1F3A]' : 'text-white'
            }`}
          >
            JOIN OUR OFFICIAL TELEGRAM TO CONTINUE YOUR REGISTRATION.
          </h3>
        </div>

        <a
          href={TELEGRAM_SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 sm:py-5 text-sm sm:text-base font-extrabold tracking-wide text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-xl shadow-md hover:shadow-lg transition-all text-center"
        >
          <Send className="w-5 h-5 shrink-0" />
          <span>JOIN TELEGRAM &amp; CONTINUE REGISTRATION</span>
          <ExternalLink className="w-4 h-4 shrink-0" />
        </a>

        <p
          className={`text-xs leading-relaxed ${
            isCompact ? 'text-slate-600' : 'text-slate-300'
          }`}
        >
          <strong>Important Notice:</strong> Telegram contact is strictly for platform support and
          registration assistance and does not guarantee employment, job selection, or recruitment.
        </p>
      </div>
    </div>
  );
};
