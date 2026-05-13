import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DUMMY_STUDENT, COURSES } from '../data/mockData';
import { generateReceipt, generateIDCard } from '../utils/pdfGenerator';
import { TPT_BRAND } from '../utils/branding';
import BrandedHeader from '../components/BrandedHeader';
import BrandedFooter from '../components/BrandedFooter';
import { 
  BookOpen, CreditCard, 
  Download, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, Building2,
  Mail, ArrowRight, ShieldCheck
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(() => {
    const localStudent = localStorage.getItem('current_student');
    if (localStudent) {
      const parsed = JSON.parse(localStudent);
      if (!parsed.courseName && parsed.courseId) {
        const course = COURSES.find(c => c.id === parsed.courseId);
        parsed.courseName = course?.title || 'Unknown Course';
        parsed.courseCode = course?.code || '';
      }
      return parsed;
    }
    return DUMMY_STUDENT;
  });

  const handlePay = (id) => {
    alert(`Connecting to TPT Secure Payment Gateway for Installment ${id}...`);
    setTimeout(() => {
      setStudent(prev => {
        const newInstallments = prev.installments.map(inst => 
          inst.id === id 
            ? { ...inst, status: 'Paid', datePaid: new Date().toISOString().split('T')[0] } 
            : inst
        );
        const updatedStudent = { ...prev, installments: newInstallments };
        localStorage.setItem('current_student', JSON.stringify(updatedStudent));
        return updatedStudent;
      });
    }, 1000);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: <ShieldCheck size={14}/> };
      case 'Pending': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: <Clock size={14}/> };
      case 'Waiting List': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <ArrowRight size={14}/> };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: <AlertCircle size={14}/> };
    }
  };

  const status = getStatusStyle(student.status);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      <BrandedHeader user={student} onLogout={() => {
        localStorage.removeItem('current_student');
        navigate('/login');
      }} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10">
        {/* Welcome Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Student Portal</h2>
            <p className="text-slate-500 mt-1 font-medium italic">Welcome back to the Continuing Education Centre</p>
          </div>
          <div className={`flex items-center gap-2 px-5 py-2 rounded-full border-2 font-black uppercase tracking-widest text-xs ${status.bg} ${status.text} ${status.border}`}>
            {status.icon} {student.status}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Profile & Course */}
          <div className="lg:col-span-4 space-y-8">
            {/* Profile Detail Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div style={{ backgroundColor: TPT_BRAND.colors.primary }} className="h-24 relative">
                <div className="absolute -bottom-12 left-8">
                  <div className="h-24 w-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
                    <img src={student.photoUrl || "https://www.w3schools.com/howto/img_avatar.png"} className="w-full h-full object-cover" alt="" />
                  </div>
                </div>
              </div>
              <div className="pt-16 px-8 pb-8">
                <h3 className="text-2xl font-black text-slate-800 uppercase leading-tight">{student.fullName || student.name}</h3>
                <div className="flex items-center gap-2 text-slate-400 mt-2 font-medium text-sm">
                  <Mail size={14} /> {student.email}
                </div>
                
                <div className="mt-8 grid grid-cols-1 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Application ID</p>
                    <p className="font-mono font-bold text-[#0054A6]">{student.appNo}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Aadhar Number</p>
                    <p className="font-bold text-slate-700">{student.aadhar || 'Not Provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div style={{ backgroundColor: TPT_BRAND.colors.primary }} className="p-2.5 rounded-xl text-white">
                  <BookOpen size={20} />
                </div>
                <h4 className="text-lg font-black uppercase text-slate-800 tracking-tight">Active Enrollment</h4>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Enrolled Program</p>
                  <p className="font-black text-slate-800 text-lg leading-tight">{student.courseName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Course Code</p>
                    <p className="font-mono font-bold text-slate-700">{student.courseCode}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Start Date</p>
                    <p className="font-bold text-slate-700">{student.startDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Payments & ID Card */}
          <div className="lg:col-span-8 space-y-8">
            {/* Payment Tracker */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div style={{ backgroundColor: TPT_BRAND.colors.primary }} className="p-2 rounded-xl text-white">
                    <CreditCard size={18} />
                  </div>
                  <h4 className="text-lg font-black uppercase text-slate-800 tracking-tight">Fee Installments</h4>
                </div>
              </div>

              <div className="p-8">
                <div className="space-y-4">
                  {student.installments?.map((inst, idx) => {
                    const isNextPending = inst.status === 'Pending' && 
                      (idx === 0 || student.installments[idx - 1].status === 'Paid');

                    return (
                      <div 
                        key={inst.id} 
                        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                          inst.status === 'Paid' 
                            ? 'border-green-100 bg-green-50/30' 
                            : isNextPending
                              ? 'border-[#0054A6]/20 bg-blue-50/50 shadow-sm'
                              : 'border-slate-100 bg-slate-50 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-5 mb-4 sm:mb-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
                            inst.status === 'Paid' ? 'bg-green-500 text-white' : 'bg-white text-slate-300 shadow-inner border border-slate-100'
                          }`}>
                            {inst.status === 'Paid' ? <CheckCircle2 size={24} /> : inst.id}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 uppercase tracking-tight">Installment {inst.id}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                              Due: {inst.dueDate} 
                              {inst.status === 'Paid' && <span className="ml-3 text-green-600">Paid on {inst.datePaid}</span>}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                          <span className="text-2xl font-black text-slate-800 tracking-tighter">₹{inst.amount}</span>
                          
                          {inst.status === 'Paid' ? (
                            <button 
                              onClick={() => generateReceipt(student, inst)}
                              style={{ backgroundColor: TPT_BRAND.colors.primary }}
                              className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white rounded-xl shadow-lg shadow-blue-900/10 hover:opacity-90"
                            >
                              <Download size={14} /> Receipt
                            </button>
                          ) : isNextPending ? (
                            <button 
                              onClick={() => handlePay(inst.id)}
                              style={{ backgroundColor: TPT_BRAND.colors.secondary }}
                              className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-800 rounded-xl shadow-lg shadow-yellow-600/10 active:scale-95"
                            >
                              Pay Now <ChevronRight size={14} />
                            </button>
                          ) : (
                            <div className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 rounded-xl">
                              Pending
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ID Card Display */}
            {student.status === 'Approved' ? (
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex flex-col md:flex-row gap-10 items-center">
                <div className="flex-1">
                  <h4 className="text-xl font-black uppercase text-slate-800 tracking-tight mb-3">Institutional ID Card</h4>
                  <p className="text-slate-500 font-medium leading-relaxed mb-8">
                    Your enrollment is approved. You can now download your official digital ID card for campus entry and course verification.
                  </p>
                  <button 
                    onClick={() => generateIDCard(student)}
                    style={{ backgroundColor: TPT_BRAND.colors.primary }}
                    className="flex items-center gap-3 px-8 py-4 font-black uppercase tracking-widest text-xs text-white rounded-xl shadow-lg shadow-blue-900/20 active:scale-95"
                  >
                    <Download size={18} /> Download ID as PDF
                  </button>
                </div>

                {/* ID Card Preview */}
                <div className="w-full max-w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden shrink-0 group transition-all duration-500 hover:-translate-y-1">
                  <div style={{ backgroundColor: TPT_BRAND.colors.primary }} className="p-5 text-center text-white relative">
                    <div className="absolute top-2 left-2 opacity-10">
                       <Building2 size={60} />
                    </div>
                    <img src={TPT_BRAND.logo} alt="" className="h-10 mx-auto mb-3 bg-white p-1 rounded shadow-sm" />
                    <h5 className="font-black text-[11px] leading-tight tracking-[0.1em] uppercase">Thiagarajar Polytechnic College</h5>
                    <p className="text-[8px] font-bold text-blue-200 mt-1 uppercase tracking-widest">Continuing Education Centre</p>
                  </div>
                  <div className="p-6 flex flex-col items-center border-b border-dashed border-slate-200 bg-white">
                    <div className="h-24 w-24 rounded-full border-4 border-slate-50 shadow-inner overflow-hidden mb-4 ring-2 ring-slate-100">
                      <img src={student.photoUrl || "https://www.w3schools.com/howto/img_avatar.png"} className="w-full h-full object-cover" alt="" />
                    </div>
                    <h5 className="font-black text-slate-800 text-lg uppercase tracking-tight">{student.fullName || student.name}</h5>
                    <div style={{ color: TPT_BRAND.colors.primary }} className="text-[10px] font-black uppercase tracking-[0.2em] mt-2 text-center bg-blue-50 px-4 py-1.5 rounded-full">
                      {student.courseName}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-5 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Verification ID</p>
                      <p className="font-mono font-bold text-slate-800 text-sm tracking-tighter">{student.uniqueId || student.appNo}</p>
                    </div>
                    <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center p-1.5 overflow-hidden">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`http://localhost:5173/verify/${student.uniqueId}`)}`} 
                        className="w-full h-full opacity-80"
                        alt="QR" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-3xl border-2 border-dashed border-[#0054A6]/20 p-10 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-[#0054A6]/10 flex items-center justify-center mx-auto mb-6 text-[#0054A6]">
                  <AlertCircle size={32} strokeWidth={2.5} />
                </div>
                <h4 className="text-xl font-black uppercase text-slate-800 tracking-tight mb-2">ID Card Not Generated</h4>
                <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                  Your official TPT ID card will be available here once your application status is updated to <span className="text-[#0054A6] font-black italic">Approved</span> by the administrator.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BrandedFooter />
    </div>
  );
}
