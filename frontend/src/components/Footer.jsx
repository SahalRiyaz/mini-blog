import React from 'react';
import { BookOpen, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight">Mini Blog</span>
            <span className="text-slate-400 text-sm">| One-Day Production Build</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 font-mono">
            <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200">React 18</span>
            <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200">React Router v6</span>
            <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200">Express</span>
            <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200">JWT & Bcrypt</span>
            <span className="px-2 py-1 bg-slate-100 rounded border border-slate-200">MongoDB / Atlas</span>
          </div>

          <div className="text-xs text-slate-500 flex items-center space-x-1">
            <span>Built with care</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>• Ready for Vercel & Render</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
