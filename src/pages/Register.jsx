import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, Lock } from 'lucide-react';
import { TPT_BRAND } from '../utils/branding';
import BrandedHeader from '../components/BrandedHeader';
import BrandedFooter from '../components/BrandedFooter';
import Step1Course from '../components/register/Step1Course';
import Step2Personal from '../components/register/Step2Personal';
import Step3Academic from '../components/register/Step3Academic';
import Step4Additional from '../components/register/Step4Additional';
import Step5Review from '../components/register/Step5Review';
import { supabase } from '../utils/supabaseClient';

const STEPS = [
  'Course Selection',
  'Personal Details',
  'Academic Qualification',
  'Additional Info',
  'Review & Submit'
];

const INITIAL_DATA = {
  courseId: '',
  courseCode: '',
  startDate: '',
  timing: '',
  fullName: '',
  gender: '',
  fatherName: '',
  address: '',
  mobile: '',
  dob: '',
  age: '',
  aadhar: '',
  email: '',
  academics: [
    { type: 'SSLC', passed: '', year: '', marks: '', institution: '' },
    { type: 'HSC', passed: '', year: '', marks: '', institution: '' },
    { type: 'Diploma In', passed: '', year: '', marks: '', institution: '' },
    { type: 'Degree', passed: '', year: '', marks: '', institution: '' },
    { type: 'PG', passed: '', year: '', marks: '', institution: '' },
    { type: 'Others', passed: '', year: '', marks: '', institution: '' },
  ],
  modeOfAdmission: [],
  status: '',
  workingAt: '',
  designation: '',
  photoUrl: null
};

export default function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [submitted, setSubmitted] = useState(false);
  const [appNo, setAppNo] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountError, setAccountError] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.courseId) return "Please select a course to continue.";
        break;
      case 2:
        if (!formData.fullName || !formData.gender || !formData.fatherName || !formData.address || !formData.mobile || !formData.dob || !formData.email || !formData.aadhar) {
          return "Please fill all required personal details.";
        }
        break;
      case 3:
        if (!formData.academics[0].passed || !formData.academics[0].year || !formData.academics[0].marks || !formData.academics[0].institution) {
          return "Please fill at least your SSLC academic details.";
        }
        break;
      case 4:
        if (formData.modeOfAdmission.length === 0 || !formData.status || !formData.photoUrl) {
          return "Please complete all required additional information and upload a profile photo.";
        }
        break;
      default:
        break;
    }
    return "";
  };

  const updateFormData = (newData) => {
    setValidationError('');
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const updateAcademic = (index, field, value) => {
    setValidationError('');
    const newAcademics = [...formData.academics];
    newAcademics[index] = { ...newAcademics[index], [field]: value };
    updateFormData({ academics: newAcademics });
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError('');
    if (currentStep < 5) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    setIsCreatingAccount(true);
  };

  const handleAccountCreation = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setAccountError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setAccountError('Passwords do not match');
      return;
    }
    
    const generatedAppNo = `APP-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    
    try {
      const registrationData = {
        ...formData,
        appNo: generatedAppNo,
        password: password,
        status: 'Pending',
        installments: [
          { id: 1, amount: 2500, dueDate: '2025-05-15', status: 'Pending' }
        ]
      };

      const { data, error } = await supabase
        .from('registrations')
        .insert([registrationData])
        .select();

      if (error) throw error;
      const savedData = data[0];
      localStorage.setItem('current_student', JSON.stringify(savedData));
      setAppNo(generatedAppNo);
      setIsCreatingAccount(false);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      setAccountError(`Failed to complete registration: ${error.message || 'Check console for details.'}`);
    }
  };

  if (isCreatingAccount) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <BrandedHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div style={{ backgroundColor: TPT_BRAND.colors.primary }} className="h-2 w-full"></div>
            <div className="p-8">
              <div style={{ color: TPT_BRAND.colors.primary }} className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock size={32} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-black uppercase text-slate-800 mb-2 text-center tracking-tight">Secure Your Account</h2>
              <p className="text-slate-600 mb-8 text-center text-sm font-medium leading-relaxed">Set up a password to track your application and access the student portal.</p>
              
              <form onSubmit={handleAccountCreation} className="space-y-5">
                {accountError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border-l-4 border-red-500">
                    {accountError}
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                  <input type="email" value={formData.email} disabled className="block w-full px-4 py-3 border border-slate-100 rounded-xl bg-slate-50 text-slate-400 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Create Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full px-4 py-3 border-2 border-slate-50 rounded-xl focus:ring-2 focus:ring-[#0054A6] focus:border-[#0054A6] outline-none transition-all" placeholder="At least 6 characters" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full px-4 py-3 border-2 border-slate-50 rounded-xl focus:ring-2 focus:ring-[#0054A6] focus:border-[#0054A6] outline-none transition-all" placeholder="Re-enter password" />
                </div>
                <button type="submit" style={{ backgroundColor: TPT_BRAND.colors.primary }} className="w-full text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all mt-6 shadow-lg shadow-blue-900/20 active:scale-95">
                  Complete Application
                </button>
              </form>
            </div>
          </div>
        </div>
        <BrandedFooter />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <BrandedHeader />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-10 text-center border border-slate-100">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500 border-4 border-white shadow-inner">
              <Check size={48} strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black uppercase text-slate-800 mb-3 tracking-tight">Application Sent!</h2>
            <p className="text-slate-500 mb-10 font-medium leading-relaxed">Your application for the Continuing Education Centre has been successfully received.</p>
            <div className="bg-slate-50 p-6 rounded-2xl mb-10 border border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mb-2">Application Reference</p>
              <p className="text-3xl font-black text-[#0054A6] tracking-tighter">{appNo}</p>
            </div>
            <div className="space-y-4">
              <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: TPT_BRAND.colors.primary }} className="w-full text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg shadow-blue-900/20">
                Go to Student Portal
              </button>
              <button onClick={() => window.location.reload()} className="w-full text-slate-500 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-50">
                Submit New Application
              </button>
            </div>
          </div>
        </div>
        <BrandedFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <BrandedHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-12 flex flex-col">
        {/* Stepper */}
        <div className="mb-12 relative px-4">
          <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-200 z-0"></div>
          <div className="absolute top-5 left-8 h-0.5 z-0 transition-all duration-500" style={{ width: `${((currentStep - 1) / 4) * 85}%`, backgroundColor: TPT_BRAND.colors.primary }}></div>
          
          <div className="relative z-10 flex justify-between items-center">
            {STEPS.map((step, idx) => {
              const stepNum = idx + 1;
              const isActive = stepNum === currentStep;
              const isCompleted = stepNum < currentStep;
              
              return (
                <div key={stepNum} className="flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 border-4 ${
                    isActive ? 'bg-white border-[#0054A6] text-[#0054A6] scale-110 shadow-lg' :
                    isCompleted ? 'bg-[#0054A6] border-[#0054A6] text-white' : 'bg-white border-slate-200 text-slate-300'
                  }`}>
                    {isCompleted ? <Check size={16} strokeWidth={4} /> : stepNum}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest text-center max-w-[80px] hidden sm:block ${isActive ? 'text-[#0054A6]' : 'text-slate-400'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex-1 flex flex-col">
          <div className="p-8 sm:p-12 flex-1">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
              <div style={{ backgroundColor: TPT_BRAND.colors.primary }} className="w-2 h-10 rounded-full"></div>
              <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">
                {currentStep}. {STEPS[currentStep - 1]}
              </h2>
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {currentStep === 1 && <Step1Course data={formData} update={updateFormData} />}
              {currentStep === 2 && <Step2Personal data={formData} update={updateFormData} />}
              {currentStep === 3 && <Step3Academic data={formData} updateAcademic={updateAcademic} />}
              {currentStep === 4 && <Step4Additional data={formData} update={updateFormData} />}
              {currentStep === 5 && <Step5Review data={formData} />}
            </div>
          </div>

          {/* Footer Navigation */}
          {validationError && (
            <div className="bg-red-50 text-red-600 px-8 py-4 text-sm font-bold border-t border-red-100 flex items-center justify-center animate-in fade-in">
              {validationError}
            </div>
          )}
          <div className="bg-slate-50 border-t border-slate-200 p-8 flex justify-between items-center px-12">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
                currentStep === 1 
                  ? 'text-slate-300 cursor-not-allowed' 
                  : 'text-slate-600 bg-white border-2 border-slate-200 hover:border-slate-300'
              }`}
            >
              <ChevronLeft size={16} /> Back
            </button>

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                style={{ backgroundColor: TPT_BRAND.colors.primary }}
                className="flex items-center gap-2 px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs text-white shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
              >
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{ backgroundColor: TPT_BRAND.colors.secondary }}
                className="flex items-center gap-3 px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs text-slate-800 shadow-lg shadow-yellow-600/20 active:scale-95 transition-all"
              >
                Submit Application <Check size={18} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
      </main>

      <BrandedFooter />
    </div>
  );
}
