import React, { useMemo, useState } from 'react';
import { Bookmark, Search } from 'lucide-react';
import { DEPARTMENTS, JOB_CATEGORIES } from '../data/categories';
import type { FavoriteJob, JobCategory } from '../types/career';
import type { ApplicationTarget } from './ApplicationModal';
import type { JobDetailSelection } from './JobDetailPage';
import { TelegramCtaBanner } from './TelegramCtaBanner';

interface DepartmentsDirectoryProps {
  favorites: FavoriteJob[];
  onApply: (target: ApplicationTarget) => void;
  onOpenJobDetail: (detail: JobDetailSelection) => void;
  onToggleFavorite: (cat: JobCategory) => void;
}

export const DepartmentsDirectory: React.FC<DepartmentsDirectoryProps> = ({
  favorites,
  onApply,
  onOpenJobDetail,
  onToggleFavorite
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptCode, setSelectedDeptCode] = useState<string>('ALL');

  const filteredDepartments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return DEPARTMENTS.filter((dept) => {
      if (selectedDeptCode !== 'ALL' && dept.code !== selectedDeptCode) return false;
      if (!q) return true;
      const cats = JOB_CATEGORIES.filter((c) => c.departmentCode === dept.code);
      return (
        dept.name.toLowerCase().includes(q) ||
        cats.some((c) => c.title.toLowerCase().includes(q))
      );
    });
  }, [searchTerm, selectedDeptCode]);

  return (
    <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-semibold text-[#B91C1C]">
            Complete U.S. Occupational Catalog · 30 Departments · 300 Categories
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1F3A] tracking-tight">
            All 30 Major Employment Departments
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Browse every department from Healthcare through Remote &amp; Freelance Work. Click any
            of the 300 job categories to view details or submit an application.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Find a role or department..."
              className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
            />
          </div>
          <select
            value={selectedDeptCode}
            onChange={(e) => setSelectedDeptCode(e.target.value)}
            className="px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
          >
            <option value="ALL">All 30 Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept.code} value={dept.code}>
                {dept.code}. {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Required Telegram CEO CTA Banner across all 300 Job Categories */}
      <TelegramCtaBanner />

      <div className="space-y-8">
        {filteredDepartments.map((dept) => {
          const q = searchTerm.trim().toLowerCase();
          const cats = JOB_CATEGORIES.filter((c) => {
            if (c.departmentCode !== dept.code) return false;
            if (!q || dept.name.toLowerCase().includes(q)) return true;
            return c.title.toLowerCase().includes(q);
          });

          return (
            <div
              key={dept.code}
              className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0B1F3A]">
                    {dept.code}. {dept.name}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">{dept.summary}</p>
                </div>
                <span className="font-mono-tabular text-xs font-semibold text-slate-500 shrink-0">
                  {cats.length} Categories
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cats.map((cat) => {
                  const isSaved = favorites.some((f) => f.itemId === cat.id);
                  return (
                    <div
                      key={cat.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-slate-200 rounded-lg hover:border-[#0B1F3A] transition-colors bg-slate-50/40"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-tabular text-xs font-semibold text-slate-500">
                            {String(cat.number).padStart(3, '0')}
                          </span>
                          <button
                            type="button"
                            onClick={() => onOpenJobDetail({ type: 'category', category: cat })}
                            className="font-display text-sm font-bold text-[#0B1F3A] hover:text-[#B91C1C] truncate text-left transition-colors"
                          >
                            {cat.title}
                          </button>
                        </div>
                        <p className="text-xs text-slate-600 truncate">
                          {cat.requiredQualification} · {cat.supportedEmploymentTypes.join(', ')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onToggleFavorite(cat)}
                          className={`p-2 rounded-lg border transition-colors ${
                            isSaved
                              ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-[#0B1F3A]'
                          }`}
                          aria-label={
                            isSaved ? `Remove ${cat.title} from favorites` : `Save ${cat.title}`
                          }
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenJobDetail({ type: 'category', category: cat })}
                          className="px-3 py-2 text-xs font-semibold text-[#0B1F3A] bg-white border border-slate-300 hover:border-[#0B1F3A] rounded-lg transition-colors whitespace-nowrap"
                        >
                          View Job
                        </button>
                        <button
                          type="button"
                          onClick={() => onApply({ type: 'category', category: cat })}
                          className="px-3.5 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-lg transition-colors whitespace-nowrap"
                        >
                          APPLY NOW
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
