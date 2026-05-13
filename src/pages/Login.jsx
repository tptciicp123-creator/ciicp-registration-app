import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldAlert } from 'lucide-react';
import { TPT_BRAND } from '../utils/branding';
import BrandedHeader from '../components/BrandedHeader';
import BrandedFooter from '../components/BrandedFooter';
import { supabase } from '../utils/supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [isStudent, setIsStudent] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isStudent) {
      if (email === 'admin@tpc.edu' && password === 'admin123') {
        navigate('/admin');
      } else {
        setError('Invalid Admin credentials. Use admin@tpc.edu / admin123');
      }
      return;
    }

    try {
      const { data: student, error: authError } = await supabase
        .from('registrations')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();
      
      if (authError && authError.code !== 'PGRST116') {
        console.error('Supabase error:', authError);
      }

      if (student) {
        localStorage.setItem('current_student', JSON.stringify(student));
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Try your registered email/password.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please check your network.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <BrandedHeader />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header Accent */}
          <div style={{ backgroundColor: TPT_BRAND.colors.primary }} className="h-2 w-full"></div>
          
          <div className="p-8">
            <div className="text-center mb-10">
              <h2 style={{ color: TPT_BRAND.colors.primary }} className="text-3xl font-black uppercase tracking-tight">
                Portal Access
              </h2>
              <p className="text-slate-500 mt-2 font-medium">Select your account type to continue</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1.5 bg-slate-100 rounded-xl mb-8 border border-slate-200">
              <button
                onClick={() => { setIsStudent(true); setError(''); }}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                  isStudent 
                    ? 'bg-white shadow-md text-[#0054A6]' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Student Login
              </button>
              <button
                onClick={() => { setIsStudent(false); setError(''); }}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                  !isStudent 
                    ? 'bg-white shadow-md text-[#0054A6]' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Administrator
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex gap-3">
                  <ShieldAlert className="text-red-500 shrink-0" size={20} />
                  <p className="text-sm text-red-700 font-bold">{error}</p>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-[#0054A6] focus:border-[#0054A6] focus:bg-white outline-none transition-all font-medium"
                    placeholder={isStudent ? "Enter your email" : "admin@tpc.edu"}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-[#0054A6] focus:border-[#0054A6] focus:bg-white outline-none transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ backgroundColor: TPT_BRAND.colors.primary }}
                className="w-full flex justify-center items-center gap-3 py-4 px-4 rounded-xl shadow-lg shadow-blue-900/20 text-sm font-black uppercase tracking-widest text-white hover:opacity-90 active:scale-95 transition-all"
              >
                <LogIn size={20} />
                Sign In to Portal
              </button>
            </form>

            {isStudent && (
              <div className="mt-10 pt-8 border-t border-slate-100">
                <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">New Application?</p>
                <button
                  onClick={() => navigate('/register')}
                  style={{ borderColor: TPT_BRAND.colors.secondary }}
                  className="w-full py-4 px-4 border-2 rounded-xl text-sm font-black uppercase tracking-widest text-slate-700 hover:bg-yellow-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Apply Online Now
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <BrandedFooter />
    </div>
  );
}
