import React, { useState, useMemo } from 'react';
import { SEMESTER_COURSES } from '../constants';
import CgpaDisplay from './CgpaDisplay';

const semesterCreditMap = Object.fromEntries(
    Object.entries(SEMESTER_COURSES).map(([key, courses]) => [
        key,
        courses.reduce((sum, course) => sum + course.credits, 0)
    ])
);

const semesterKeys = Object.keys(semesterCreditMap);

const CgpaCalculator: React.FC = () => {
    const [gpas, setGpas] = useState<Record<string, string>>({});

    const handleGpaChange = (semesterKey: string, value: string) => {
        if (/^(\d{1,1}(\.\d{0,3})?)?$/.test(value)) {
            setGpas(prev => ({ ...prev, [semesterKey]: value }));
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, currentIndex: number) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const nextIndex = currentIndex + 1;
            if (nextIndex < semesterKeys.length) {
                const nextSemesterKey = semesterKeys[nextIndex];
                const nextInput = document.getElementById(`gpa-input-${nextSemesterKey}`);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        }
    };

    const cgpaData = useMemo(() => {
        let totalPoints = 0;
        let totalCredits = 0;
        
        for (const semesterKey in gpas) {
            const gpa = parseFloat(gpas[semesterKey]);
            const credits = semesterCreditMap[semesterKey];

            if (!isNaN(gpa) && gpa >= 0 && gpa <= 4 && credits) {
                totalPoints += gpa * credits;
                totalCredits += credits;
            }
        }

        const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
        return { cgpa, totalCredits };
    }, [gpas]);

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mt-1 mb-2">
                    Cumulative Grade Point Average (CGPA)
                </h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Enter the GPA you obtained in each semester. The CGPA will be calculated based on the official credit distribution for each semester.
                </p>
            </div>
            
            <CgpaDisplay cgpa={cgpaData.cgpa} totalCredits={cgpaData.totalCredits} />
            
            <div className="mt-12 max-w-2xl mx-auto">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                        {semesterKeys.map((key, index) => (
                            <div key={key} className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">Semester {key}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{semesterCreditMap[key]} Credits</p>
                                </div>
                                <input
                                    id={`gpa-input-${key}`}
                                    type="number"
                                    step="0.001"
                                    min="0"
                                    max="4"
                                    placeholder="GPA"
                                    value={gpas[key] || ''}
                                    onChange={e => handleGpaChange(key, e.target.value)}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    className="w-24 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-sm text-right focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    aria-label={`GPA for Semester ${key}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CgpaCalculator;