
import React from 'react';

interface CgpaDisplayProps {
  cgpa: number;
  totalCredits: number;
  isSticky: boolean;
}

const CgpaDisplay: React.FC<CgpaDisplayProps> = ({ cgpa, totalCredits, isSticky }) => {
    const getCgpaColor = () => {
        if (cgpa >= 3.5) return 'text-green-500';
        if (cgpa >= 3.0) return 'text-blue-500';
        if (cgpa >= 2.5) return 'text-yellow-500';
        if (cgpa > 0) return 'text-orange-500';
        return 'text-slate-500';
    };

    if (isSticky) {
        // Sticky header version: Compact, modern, and horizontal
        return (
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-600 dark:text-slate-300">
                            Cumulative GPA (CGPA)
                        </h2>
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
                            Based on <span className="font-semibold text-primary-500 dark:text-primary-400">{totalCredits.toFixed(2)}</span> total credits.
                        </p>
                    </div>
                    <p className={`text-5xl sm:text-6xl font-bold transition-colors duration-300 ${getCgpaColor()}`}>
                        {cgpa.toFixed(3)}
                    </p>
                </div>
            </div>
        );
    }

    // Normal version: A larger, more detailed card
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 max-w-2xl mx-auto text-center">
            <h2 className="text-lg font-medium text-slate-500 dark:text-slate-400">
                Cumulative GPA (CGPA)
            </h2>
            <p className={`text-7xl font-bold my-2 transition-colors duration-300 ${getCgpaColor()}`}>
                {cgpa.toFixed(3)}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Based on <span className="font-semibold text-primary-500 dark:text-primary-400">{totalCredits.toFixed(2)}</span> total credits.
            </p>
        </div>
    );
};

export default CgpaDisplay;
