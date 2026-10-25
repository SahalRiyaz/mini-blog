import React from 'react';
import { Palette, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-amber-100 dark:border-slate-800 mt-20 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-sm">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif font-bold text-slate-800 dark:text-slate-100 tracking-tight text-base">
                Canvas & Prose
              </span>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                A Journal of Fine Arts, Aesthetics & Critical Inquiry
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-serif italic">
            <span className="px-2.5 py-1 bg-amber-50/70 dark:bg-slate-800 rounded-full border border-amber-100 dark:border-slate-700">Painting & Pigments</span>
            <span className="px-2.5 py-1 bg-amber-50/70 dark:bg-slate-800 rounded-full border border-amber-100 dark:border-slate-700">Sculptural Form</span>
            <span className="px-2.5 py-1 bg-amber-50/70 dark:bg-slate-800 rounded-full border border-amber-100 dark:border-slate-700">Art History</span>
            <span className="px-2.5 py-1 bg-amber-50/70 dark:bg-slate-800 rounded-full border border-amber-100 dark:border-slate-700">Exhibition Reviews</span>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 inline" />
            <span>Dedicated to beauty, craft & contemplation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
