import { COURSES } from '../../data/mockData';

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6 shadow-sm">
    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
      <h3 className="font-bold text-slate-800">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const Field = ({ label, value }) => (
  <div className="mb-4 last:mb-0">
    <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</span>
    <span className="block font-medium text-slate-900">{value || <span className="text-slate-400 italic">Not provided</span>}</span>
  </div>
);

export default function Step5Review({ data }) {
  const course = COURSES.find(c => c.id === data.courseId);



  const hasAcademics = data.academics.some(a => a.passed || a.institution);

  return (
    <div className="max-w-4xl">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-8 text-sm flex gap-3">
        <div className="mt-0.5">⚠️</div>
        <p>Please review your details carefully before submitting. You cannot edit the application once submitted.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Course Details">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Selected Course" value={course?.title} />
              <Field label="Course Code" value={data.courseCode} />
              <Field label="Start Date" value={data.startDate} />
              <Field label="Practical Timing" value={data.timing} />
            </div>
          </Section>

          <Section title="Personal Details">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name" value={data.fullName} />
              <Field label="Gender" value={data.gender} />
              <Field label="Father/Husband Name" value={data.fatherName} />
              <Field label="Date of Birth (Age)" value={`${data.dob} (${data.age} years)`} />
              <div className="col-span-2">
                <Field label="Contact Address" value={data.address} />
              </div>
              <Field label="Mobile Number" value={data.mobile ? `+91 ${data.mobile}` : ''} />
              <Field label="Email ID" value={data.email} />
              <div className="col-span-2">
                <Field label="Aadhar Number" value={data.aadhar} />
              </div>
            </div>
          </Section>

          <Section title="Academic Qualifications">
            {hasAcademics ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-slate-500 border-b">
                      <th className="pb-2 font-medium">Level</th>
                      <th className="pb-2 font-medium">Passed</th>
                      <th className="pb-2 font-medium">Year</th>
                      <th className="pb-2 font-medium">%</th>
                      <th className="pb-2 font-medium">Institution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.academics.filter(a => a.passed || a.institution).map(row => (
                      <tr key={row.type} className="border-b last:border-0 border-slate-100">
                        <td className="py-3 font-medium text-slate-700">{row.type}</td>
                        <td className="py-3">{row.passed}</td>
                        <td className="py-3">{row.year}</td>
                        <td className="py-3">{row.marks}</td>
                        <td className="py-3">{row.institution}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 italic">No academic details provided.</p>
            )}
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Additional Info">
            <Field label="Mode of Admission" value={data.modeOfAdmission.join(', ')} />
            <div className="mt-4">
              <Field label="Status" value={data.status} />
            </div>
            {data.status === 'Employed' && (
              <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <Field label="Working At" value={data.workingAt} />
                <div className="mt-3">
                  <Field label="Designation" value={data.designation} />
                </div>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-slate-100">
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Profile Photo</span>
              {data.photoUrl ? (
                <img src={data.photoUrl} alt="Profile" className="w-full aspect-square object-cover rounded-xl border border-slate-200" />
              ) : (
                <div className="w-full aspect-square bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
                  No Photo
                </div>
              )}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
