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
          ? 'bg-[#0B1F3A] border-[#0B1F3A] text-white p-6 sm:p-7'
          : isCompact
          ? 'bg-slate-50 border-slate-200 text-[#0B1F3A] p-4 sm:p-5'
          : 'bg-[#0B1F3A] border-[#0B1F3A] text-white p-6 sm:p-8'
      } space-y-3`}
    >
      <div className="flex flex-col gap-3">
        <div className="space-y-1">
          <p
            className={`text-xs font-semibold uppercase tracking-wider ${
              isCompact ? 'text-[#B91C1C]' : 'text-red-300'
            }`}
          >
            Official Platform Support Channel
          </p>
          <p
            className={`text-sm leading-relaxed ${
              isCompact ? 'text-slate-700' : 'text-slate-200'
            }`}
          >
            Need registration guidance or support with your submission? Contact our platform support
            desk on Telegram:
          </p>
        </div>

        <a
          href={TELEGRAM_SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-4 text-sm sm:text-base font-extrabold tracking-wide text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg shadow-sm transition-colors text-center"
        >
          <Send className="w-5 h-5 shrink-0" />
          <span>MESSAGE CEO ON TELEGRAM</span>
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
