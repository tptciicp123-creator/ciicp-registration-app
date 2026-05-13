

export default function Step2Personal({ data, update }) {
  const calculateAge = (dobString) => {
    if (!dobString) return '';
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDobChange = (e) => {
    const dob = e.target.value;
    update({ dob, age: calculateAge(dob) });
  };

  const handleAadharChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 12);
    if (val.length > 8) val = val.slice(0,4) + '-' + val.slice(4,8) + '-' + val.slice(8);
    else if (val.length > 4) val = val.slice(0,4) + '-' + val.slice(4);
    update({ aadhar: val });
  };

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none text-slate-800";
  const labelClass = "block text-sm font-semibold text-slate-600 mb-2";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className={labelClass}>Name of the Candidate (Initials at the end)</label>
          <input 
            type="text" 
            value={data.fullName}
            onChange={e => update({ fullName: e.target.value.toUpperCase() })}
            className={`${inputClass} uppercase tracking-widest font-mono text-lg`}
            placeholder="e.g. JOHN DOE A"
          />
        </div>

        <div>
          <label className={labelClass}>Sex</label>
          <div className="flex gap-4">
            {['Male', 'Female'].map(option => (
              <label key={option} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${data.gender === option ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold shadow-sm' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                <input 
                  type="radio" 
                  name="gender" 
                  value={option}
                  checked={data.gender === option}
                  onChange={e => update({ gender: e.target.value })}
                  className="hidden"
                />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${data.gender === option ? 'border-primary-500' : 'border-slate-300'}`}>
                  {data.gender === option && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                </div>
                {option}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Name of the Father / Husband</label>
          <input 
            type="text" 
            value={data.fatherName}
            onChange={e => update({ fatherName: e.target.value.toUpperCase() })}
            className={`${inputClass} uppercase`}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Contact Address</label>
          <textarea 
            rows={3}
            value={data.address}
            onChange={e => update({ address: e.target.value })}
            className={`${inputClass} resize-none`}
            placeholder="Full address with pincode"
          />
        </div>

        <div>
          <label className={labelClass}>Mobile Number</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">+91</span>
            <input 
              type="tel" 
              maxLength={10}
              value={data.mobile}
              onChange={e => update({ mobile: e.target.value.replace(/\D/g, '') })}
              className={`${inputClass} pl-12 font-mono text-lg tracking-wider`}
              placeholder="00000 00000"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Email ID</label>
          <input 
            type="email" 
            value={data.email}
            onChange={e => update({ email: e.target.value })}
            className={inputClass}
            placeholder="example@domain.com"
          />
        </div>

        <div>
          <label className={labelClass}>Date of Birth</label>
          <input 
            type="date" 
            value={data.dob}
            onChange={handleDobChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Age</label>
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              value={data.age}
              readOnly
              className="w-24 px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl font-mono text-lg text-slate-600 text-center"
            />
            <span className="text-slate-500 font-medium">Years</span>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Aadhar Number</label>
          <input 
            type="text" 
            value={data.aadhar}
            onChange={handleAadharChange}
            placeholder="XXXX-XXXX-XXXX"
            className={`${inputClass} font-mono text-lg tracking-widest`}
          />
        </div>
      </div>
    </div>
  );
}
