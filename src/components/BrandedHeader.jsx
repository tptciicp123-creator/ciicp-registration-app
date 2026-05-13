
import { TPT_BRAND } from '../utils/branding';
import { Mail, Phone, Globe } from 'lucide-react';

export default function BrandedHeader({ user, onLogout }) {
  return (
    <header className="w-full">
      {/* Utility Top Bar */}
      <div style={{ backgroundColor: TPT_BRAND.colors.primary }} className="text-white py-1 px-4 sm:px-8 flex justify-between items-center text-[11px] font-medium uppercase tracking-wider">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5"><Phone size={12} /> +91 427 4099399</span>
          <span className="flex items-center gap-1.5"><Mail size={12} /> ciicp@tpt.edu.in</span>
        </div>
        <div className="hidden sm:flex gap-4">
          <a href="https://www.tpt.edu.in" target="_blank" rel="noreferrer" className="hover:text-yellow-400">Main College Site</a>
          <span>Brochure</span>
        </div>
      </div>

      {/* Main Branding Area */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <img src={TPT_BRAND.logo} alt="TPT Logo" className="h-16 w-auto" />
            <div className="border-l-2 border-slate-100 pl-4">
              <h1 style={{ color: TPT_BRAND.colors.primary }} className="text-xl sm:text-2xl font-black uppercase leading-tight tracking-tight">
                Thiagarajar Polytechnic College
              </h1>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Continuing Education Centre <span style={{ color: TPT_BRAND.colors.primary }}>(CIICP)</span>
              </p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center gap-4 bg-slate-50 p-2 pr-4 rounded-full border border-slate-100">
              <div className="h-10 w-10 rounded-full bg-white border border-slate-200 overflow-hidden">
                <img src={user.photoUrl || "https://www.w3schools.com/howto/img_avatar.png"} className="w-full h-full object-cover" alt="" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-none">{user.fullName || user.name}</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{user.appNo}</p>
              </div>
              <button 
                onClick={onLogout}
                className="ml-2 p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full transition-colors"
              >
                <Globe size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
