import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Building2, User, BookOpen, ShieldCheck } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

export default function Verify() {
  const { uniqueId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('registrations')
      .select('*')
      .eq('uniqueId', uniqueId)
      .single()
      .then(({ data, error }) => {
        if (data && !error) {
          setResult({
            valid: true,
            name: data.fullName || data.name,
            course: data.courseName,
            status: data.status,
            photo: data.photoUrl
          });
        } else {
          setResult({ valid: false });
        }
        setLoading(false);
      });
  }, [uniqueId]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-primary-600 p-6 text-center text-white">
          <Building2 className="mx-auto mb-2" size={32} />
          <h1 className="text-xl font-bold">CIICP Verification System</h1>
          <p className="text-primary-100 text-sm">Thiagarajar Polytechnic College</p>
        </div>

        <div className="p-8">
          {result?.valid ? (
            <div className="text-center animate-in zoom-in-95 duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Valid Credential</h2>
              <p className="text-green-600 font-semibold mb-6">Status: {result.status}</p>

              <div className="space-y-4 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4 border-b border-slate-200 pb-4 mb-4">
                  {result.photo ? (
                    <img src={result.photo} className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm" alt="" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                      <User size={24} />
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Student Name</p>
                    <p className="font-bold text-slate-900 text-lg">{result.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BookOpen className="text-slate-400 shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Enrolled Course</p>
                    <p className="font-semibold text-slate-800">{result.course}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-slate-400 shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Verification ID</p>
                    <p className="font-mono text-slate-800">{uniqueId}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
                <XCircle size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Invalid Credential</h2>
              <p className="text-slate-500 mb-6">The ID card or credential you are trying to verify was not found in our records.</p>
              <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Try Again</button>
            </div>
          )}
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">© 2025 CIICP Continuing Education Centre</p>
        </div>
      </div>
    </div>
  );
}
