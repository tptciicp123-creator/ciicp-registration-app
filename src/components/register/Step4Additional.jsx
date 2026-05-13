import { useRef } from 'react';
import { Upload, X } from 'lucide-react';

export default function Step4Additional({ data, update }) {
  const fileInputRef = useRef(null);

  const admissionModes = ['Advertisement', 'Friends', 'Old Student', 'Staff'];
  const statuses = ['Student', 'Unemployed', 'Employed', 'Business', 'Senior Citizen'];

  const handleModeToggle = (mode) => {
    const newModes = data.modeOfAdmission.includes(mode)
      ? data.modeOfAdmission.filter(m => m !== mode)
      : [...data.modeOfAdmission, mode];
    update({ modeOfAdmission: newModes });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for Base64 storage
        alert("Photo is too large. Please upload an image under 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        update({ photoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const labelClass = "block text-sm font-semibold text-slate-700 mb-3";

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <label className={labelClass}>Mode of Admission</label>
        <div className="flex flex-wrap gap-3">
          {admissionModes.map(mode => {
            const isSelected = data.modeOfAdmission.includes(mode);
            return (
              <button
                key={mode}
                type="button"
                onClick={() => handleModeToggle(mode)}
                className={`px-5 py-2.5 rounded-xl border font-medium text-sm transition-colors ${
                  isSelected 
                    ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-600/20' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-primary-300 hover:bg-slate-50'
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className={labelClass}>Status of the Candidate</label>
        <div className="flex flex-wrap gap-3">
          {statuses.map(status => {
            const isSelected = data.status === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => update({ status })}
                className={`px-5 py-2.5 rounded-xl border font-medium text-sm transition-colors ${
                  isSelected 
                    ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-600/20' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-primary-300 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {data.status === 'Employed' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">If employed, working at</label>
            <input 
              type="text" 
              value={data.workingAt}
              onChange={e => update({ workingAt: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none text-slate-800"
              placeholder="Company / Organization Name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">As (Designation)</label>
            <input 
              type="text" 
              value={data.designation}
              onChange={e => update({ designation: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none text-slate-800"
              placeholder="Job Title"
            />
          </div>
        </div>
      )}

      <div>
        <label className={labelClass}>Profile Photo <span className="text-red-500">*</span></label>
        
        {data.photoUrl ? (
          <div className="relative inline-block">
            <img 
              src={data.photoUrl} 
              alt="Profile preview" 
              className="w-32 h-32 object-cover rounded-2xl border-4 border-white shadow-lg"
            />
            <button
              onClick={() => update({ photoUrl: null })}
              className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-sm border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-50 hover:bg-primary-50 hover:border-primary-400 hover:text-primary-600 transition-colors cursor-pointer text-slate-500 group"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload size={24} />
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm">Click to upload photo</p>
              <p className="text-xs mt-1 opacity-70">JPG, PNG (Max 2MB)</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden" 
            />
          </div>
        )}
      </div>
    </div>
  );
}
