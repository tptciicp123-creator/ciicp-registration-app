import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TPT_BRAND } from '../utils/branding';
import BrandedHeader from '../components/BrandedHeader';
import BrandedFooter from '../components/BrandedFooter';
import { supabase } from '../utils/supabaseClient';
import { 
  Users, CheckCircle2, 
  Clock, XCircle, Search, 
  Download, Shield, IndianRupee,
  Plus, Edit2, Trash2, ArrowRight
} from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('students');
  const [registrations, setRegistrations] = useState([]);
  const [dbCourses, setDbCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchData = async () => {
    try {
      const [regRes, courseRes] = await Promise.all([
        supabase.from('registrations').select('*'),
        supabase.from('courses').select('*')
      ]);
      setRegistrations(regRes.data || []);
      setDbCourses(courseRes.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const reg = registrations.find(r => r.id === id);
      if (!reg) return;

      const updates = { status: newStatus };
      if (newStatus === 'Approved' && !reg.uniqueId) {
        const prefix = (reg.courseCode || 'PRG').split('-')[0];
        updates.uniqueId = `${prefix}-CS-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      await supabase
        .from('registrations')
        .update(updates)
        .eq('id', id);

      fetchData();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['App No', 'Name', 'Email', 'Course', 'Status', 'Registered At'];
    const rows = registrations.map(r => [
      r.appNo, 
      r.fullName || r.name, 
      r.email, 
      r.courseName || 'N/A', 
      r.status, 
      r.registeredAt
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "TPT_Registrations_Export.csv");
    document.body.appendChild(link);
    link.click();
  };

  // Stats calculation
  const stats = {
    totalRegistrations: registrations.length,
    approved: registrations.filter(r => r.status === 'Approved').length,
    pending: registrations.filter(r => r.status === 'Pending').length,
    rejected: registrations.filter(r => r.status === 'Rejected').length,
    waitingList: registrations.filter(r => r.status === 'Waiting List').length,
    totalRevenue: registrations.reduce((acc, curr) => {
      const paidAmt = curr.installments?.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0) || 0;
      return acc + paidAmt;
    }, 0)
  };

  const filteredStudents = registrations.filter(s => {
    const name = s.fullName || s.name || '';
    const matchSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        s.appNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0054A6]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      <BrandedHeader onLogout={() => navigate('/login')} />
      
      {/* Admin Nav Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <div className="flex space-x-10">
            {['Students', 'Courses', 'Settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-5 px-1 border-b-4 font-black uppercase tracking-widest text-[11px] transition-all ${
                  activeTab === tab.toLowerCase() 
                    ? 'border-[#0054A6] text-[#0054A6]' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            <Shield size={14} className="text-[#0054A6]" /> Root Administrator
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-8 py-10">
        
        {/* Analytics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-10">
          {[
            { title: 'Total', value: stats.totalRegistrations, color: 'text-blue-600', bg: 'bg-blue-50', icon: <Users size={18}/> },
            { title: 'Approved', value: stats.approved, color: 'text-green-600', bg: 'bg-green-50', icon: <CheckCircle2 size={18}/> },
            { title: 'Pending', value: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50', icon: <Clock size={18}/> },
            { title: 'Waitlist', value: stats.waitingList, color: 'text-purple-600', bg: 'bg-purple-50', icon: <ArrowRight size={18}/> },
            { title: 'Rejected', value: stats.rejected, color: 'text-red-600', bg: 'bg-red-50', icon: <XCircle size={18}/> },
            { title: 'Revenue', value: `₹${stats.totalRevenue}`, color: 'text-blue-900', bg: 'bg-blue-100', icon: <IndianRupee size={18}/> },
          ].map(s => (
            <div key={s.title} className="bg-white p-5 rounded-2xl shadow-xl shadow-slate-200/40 border border-white">
              <div className={`${s.bg} ${s.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                {s.icon}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{s.title}</p>
              <p className="text-xl font-black text-slate-800">{s.value}</p>
            </div>
          ))}
        </div>

        {activeTab === 'students' && (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-black uppercase text-slate-800 tracking-tight">Registration Management</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Review and process student applications</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="relative group">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0054A6] transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search by name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm w-full md:w-64 focus:ring-2 focus:ring-[#0054A6]/20 focus:border-[#0054A6] outline-none transition-all font-medium"
                  />
                </div>
                
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-600 outline-none hover:border-[#0054A6] transition-all cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Waiting List">Waitlist</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button 
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg"
                >
                  <Download size={14} /> Export Data
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-[0.15em] text-[10px] border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5">Application No.</th>
                    <th className="px-8 py-5">Student Details</th>
                    <th className="px-8 py-5">Program</th>
                    <th className="px-8 py-5">Fee Status</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-8 py-6">
                        <span className="font-mono font-bold text-[#0054A6] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100/50">
                          {student.appNo}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img src={student.photoUrl || "https://www.w3schools.com/howto/img_avatar.png"} className="h-10 w-10 rounded-xl object-cover border-2 border-white shadow-sm" alt=""/>
                          <div>
                            <p className="font-black text-slate-800 leading-tight">{student.fullName || student.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-bold text-slate-600 uppercase text-xs">
                          {student.courseName || 'Selected Course'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500" 
                                style={{ width: `${(student.installments?.filter(i => i.status === 'Paid').length / (student.installments?.length || 1)) * 100}%` }}
                              ></div>
                           </div>
                           <span className="text-[10px] font-black text-slate-400">
                             {student.installments?.filter(i => i.status === 'Paid').length}/{student.installments?.length}
                           </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                          student.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-100' :
                          student.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          student.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                          'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <div className="inline-flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                          <button 
                            onClick={() => handleStatusChange(student.id, 'Approved')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve"
                          >
                            <CheckCircle2 size={16} strokeWidth={3} />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(student.id, 'Waiting List')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Waitlist"
                          >
                            <ArrowRight size={16} strokeWidth={3} />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(student.id, 'Rejected')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject"
                          >
                            <XCircle size={16} strokeWidth={3} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
              <div>
                <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tight">Active Curriculum</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Manage vocational and skill development programs</p>
              </div>
              <button style={{ backgroundColor: TPT_BRAND.colors.primary }} className="flex items-center gap-2 px-6 py-4 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-95 transition-all">
                <Plus size={18} /> Add New Course
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dbCourses.map(course => (
                <div key={course.id} className="bg-white border-2 border-slate-100 rounded-3xl p-6 hover:border-[#0054A6] transition-all group shadow-sm hover:shadow-xl">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0054A6] bg-blue-50 px-3 py-1.5 rounded-lg">
                      {course.code}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors"><Edit2 size={14}/></button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={14}/></button>
                    </div>
                  </div>
                  <h3 className="font-black text-slate-800 text-lg leading-tight mb-2 uppercase tracking-tight">{course.title}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">{course.category}</p>
                  
                  <div className="flex justify-between items-end pt-6 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Course Fee</p>
                      <p className="text-2xl font-black text-slate-800 tracking-tighter">₹{course.fee}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Duration</p>
                       <p className="font-bold text-slate-600">{course.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
      <BrandedFooter />
    </div>
  );
}
