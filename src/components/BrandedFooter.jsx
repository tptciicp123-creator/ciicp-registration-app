
import { TPT_BRAND } from '../utils/branding';
import { MapPin, Phone, Mail, ChevronRight } from 'lucide-react';

export default function BrandedFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Column 1: About */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white p-1 rounded">
              <img src={TPT_BRAND.logo} alt="Logo" className="h-10" />
            </div>
            <h3 className="text-white font-bold leading-tight">TPT Continuing<br/>Education Centre</h3>
          </div>
          <p className="text-sm leading-relaxed mb-6">
            Providing high-quality skill development and vocational training since 1993 under the Canada India Institutional Co-operation Project (CIICP).
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-yellow-400 pl-3">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            {['About CIICP', 'Skill Development', 'Awards & Recognition', 'Infrastructure', 'Contact Us'].map(link => (
              <li key={link}>
                <a href="#" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                  <ChevronRight size={14} className="text-yellow-400" /> {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-yellow-400 pl-3">Contact Us</h3>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <MapPin size={20} className="text-yellow-400 shrink-0" />
              <span>Thiagarajar Polytechnic College, Junction Main Road, Salem - 636 005.</span>
            </div>
            <div className="flex gap-3">
              <Phone size={18} className="text-yellow-400 shrink-0" />
              <span>+91 427 4099399 / 4099116</span>
            </div>
            <div className="flex gap-3">
              <Mail size={18} className="text-yellow-400 shrink-0" />
              <span>ciicp@tpt.edu.in</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 px-6 text-center text-xs tracking-wider uppercase font-medium">
        <p>© 2025 Thiagarajar Polytechnic College. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
