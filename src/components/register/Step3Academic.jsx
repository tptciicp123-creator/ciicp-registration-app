

export default function Step3Academic({ data, updateAcademic }) {
  const theadClass = "px-4 py-3 bg-slate-100 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200";
  const inputClass = "w-full bg-transparent px-3 py-2 border-none focus:ring-0 text-slate-800 placeholder-slate-400 outline-none";

  return (
    <div className="space-y-6">
      <p className="text-slate-500">Please provide your educational qualifications. SSLC is mandatory.</p>
      
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead>
            <tr>
              <th className={`${theadClass} w-32`}>Level</th>
              <th className={theadClass}>Examination Passed</th>
              <th className={`${theadClass} w-28`}>Year of Passing</th>
              <th className={`${theadClass} w-24`}>% Marks</th>
              <th className={theadClass}>Name of the Institution</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {data.academics.map((row, index) => (
              <tr key={row.type} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2 font-medium text-slate-700 whitespace-nowrap bg-slate-50 border-r border-slate-100">
                  {row.type} {row.type === 'SSLC' && <span className="text-red-500 ml-1">*</span>}
                </td>
                <td className="p-0 border-r border-slate-100">
                  <input 
                    type="text" 
                    value={row.passed}
                    onChange={e => updateAcademic(index, 'passed', e.target.value)}
                    className={inputClass}
                    placeholder={`e.g. ${row.type}`}
                  />
                </td>
                <td className="p-0 border-r border-slate-100">
                  <input 
                    type="text" 
                    value={row.year}
                    onChange={e => updateAcademic(index, 'year', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className={`${inputClass} text-center font-mono`}
                    placeholder="YYYY"
                  />
                </td>
                <td className="p-0 border-r border-slate-100">
                  <input 
                    type="text" 
                    value={row.marks}
                    onChange={e => updateAcademic(index, 'marks', e.target.value)}
                    className={`${inputClass} text-center font-mono`}
                    placeholder="%"
                  />
                </td>
                <td className="p-0">
                  <input 
                    type="text" 
                    value={row.institution}
                    onChange={e => updateAcademic(index, 'institution', e.target.value)}
                    className={inputClass}
                    placeholder="Institution Name"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
