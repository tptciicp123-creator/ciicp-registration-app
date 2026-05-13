
import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Calendar, Hash } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

export default function Step1Course({ data, update }) {
  const [dbCourses, setDbCourses] = useState([]);
  
  useEffect(() => {
    supabase.from('courses').select('*').eq('active', true).then(({ data }) => {
      if (data) setDbCourses(data);
    });
  }, []);

  const categories = [...new Set(dbCourses.map(c => c.category))];

  const handleSelect = (course) => {
    update({
      courseId: course.id,
      courseCode: course.code,
      startDate: course.startDate,
      timing: course.timing
    });
  };

  return (
    <div className="space-y-8">
      <p className="text-slate-500 mb-6">Please select one course you wish to enroll in. Details will automatically populate.</p>
      
      {categories.map(category => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-primary-500 rounded-full inline-block"></span>
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {dbCourses.filter(c => c.category === category).map(course => {
              const isSelected = data.courseId === course.id;
              return (
                <div 
                  key={course.id}
                  onClick={() => handleSelect(course)}
                  className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
                    isSelected 
                      ? 'border-primary-500 bg-primary-50/50 shadow-md' 
                      : 'border-slate-200 hover:border-primary-300 hover:shadow-md bg-white'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 text-primary-600 animate-in zoom-in duration-200">
                      <CheckCircle2 size={24} className="fill-primary-100" />
                    </div>
                  )}
                  <div className="pr-8">
                    <h4 className={`font-bold mb-3 line-clamp-2 ${isSelected ? 'text-primary-900' : 'text-slate-700 group-hover:text-primary-700'}`}>
                      {course.title}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Hash size={16} className={isSelected ? 'text-primary-500' : 'text-slate-400'} />
                        <span className="font-mono">{course.code}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={16} className={isSelected ? 'text-primary-500' : 'text-slate-400'} />
                        <span>Starts {course.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={16} className={isSelected ? 'text-primary-500' : 'text-slate-400'} />
                        <span>{course.timing}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Selected Course Summary */}
      {data.courseId && (
        <div className="mt-8 p-6 bg-slate-900 rounded-xl text-white flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center animate-in slide-in-from-bottom-4">
          <div>
            <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Selected Course</p>
            <h3 className="text-xl font-bold">{dbCourses.find(c => c.id === data.courseId)?.title}</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="bg-slate-800 px-4 py-2 rounded-lg">
              <span className="text-slate-400 text-xs block mb-1">Course Code</span>
              <span className="font-mono font-medium">{data.courseCode}</span>
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-lg">
              <span className="text-slate-400 text-xs block mb-1">Duration</span>
              <span className="font-medium">{dbCourses.find(c => c.id === data.courseId)?.duration}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
