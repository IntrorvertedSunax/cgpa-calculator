import React, { useState, useMemo } from 'react';
import { Course } from '../types';
import { SEMESTER_COURSES, GRADE_POINTS, GRADE_OPTIONS } from '../constants';
import SgpaDisplay from './SgpaDisplay';

const SgpaCalculator: React.FC = () => {
  const [selectedSemesterKey, setSelectedSemesterKey] = useState<string>('');
  const [grades, setGrades] = useState<Record<string, string>>({});

  const courses: Course[] = useMemo(
    () => (selectedSemesterKey ? SEMESTER_COURSES[selectedSemesterKey] : []),
    [selectedSemesterKey]
  );

  const semesterStats = useMemo(() => {
    let totalPoints = 0;
    let attemptedCredits = 0;
    let securedCredits = 0;

    const offeredCredits = courses.reduce((sum, course) => sum + course.credits, 0);

    courses.forEach(course => {
      const grade = grades[course.code];
      if (grade && grade !== 'N/A') {
        const gradePoint = GRADE_POINTS[grade];
        attemptedCredits += course.credits;
        totalPoints += gradePoint * course.credits;
        if (grade !== 'F') {
            securedCredits += course.credits;
        }
      }
    });

    const sgpa = attemptedCredits > 0 ? totalPoints / attemptedCredits : 0;

    return { 
        totalPoints, 
        attemptedCredits,
        offeredCredits,
        securedCredits,
        sgpa 
    };
  }, [grades, courses]);


  const handleGradeChange = (courseCode: string, grade: string) => {
    setGrades(prev => ({ ...prev, [courseCode]: grade }));
  };
  
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSemesterKey = e.target.value;
      setSelectedSemesterKey(newSemesterKey);
      setGrades({}); // Reset grades when semester changes
  };

  return (
    <div>
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mt-1 mb-2">
                Semester Grade Point Average (SGPA)
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Select a semester and input your grades for each course to see the calculated SGPA.
            </p>
        </div>
        
        <SgpaDisplay 
            sgpa={semesterStats.sgpa}
            offeredCredits={semesterStats.offeredCredits}
            securedCredits={semesterStats.securedCredits}
            totalPoints={semesterStats.totalPoints}
        />

        <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="flex justify-center mb-6">
                     <select
                      value={selectedSemesterKey}
                      onChange={handleSemesterChange}
                      className="w-full max-w-xs bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select a Semester</option>
                      {Object.keys(SEMESTER_COURSES).map(key => (
                        <option key={key} value={key}>
                          Semester {key}
                        </option>
                      ))}
                    </select>
                </div>
                
                <div className="space-y-4">
                  {courses.length > 0 ? (
                    courses.map(course => (
                      <div key={course.code} className="grid grid-cols-3 gap-2 items-center">
                        <div className="col-span-2">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{course.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {course.code} &bull; {course.credits} Credits
                          </p>
                        </div>
                        <select
                          value={grades[course.code] || 'N/A'}
                          onChange={e => handleGradeChange(course.code, e.target.value)}
                          className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          {GRADE_OPTIONS.map(grade => (
                            <option key={grade} value={grade}>
                              {grade}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                      <p>Please select a semester to see courses.</p>
                    </div>
                  )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default SgpaCalculator;