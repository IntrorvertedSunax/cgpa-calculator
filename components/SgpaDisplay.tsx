
import React from 'react';

interface SgpaDisplayProps {
  sgpa: number;
  offeredCredits: number;
  securedCredits: number;
  totalPoints: number;
  isSticky: boolean;
}

const SgpaDisplay: React.FC<SgpaDisplayProps> = ({ sgpa, offeredCredits, securedCredits, totalPoints, isSticky }) => {
    const getSgpaColor = () => {
        if (sgpa >= 3.75) return 'text-green-500';
        if (sgpa >= 3.25) return 'text-blue-500';
        if (sgpa >= 2.5) return 'text-yellow-500';
        if (sgpa > 0) return 'text-orange-500';
        return 'text-slate-500';
    };

    if (isSticky) {
        // Sticky header version: Compact, modern, and horizontal
        return (
             <div className="max-w-2xl mx-auto px-4">
                <div className="flex justify-between items-center gap-4">
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-600 dark:text-slate-300">
                            Semester GPA (SGPA)
                        </h2>
                        <div className="flex gap-x-6 text-xs sm:text-sm text-center sm:text-left text-slate-500 dark:text-slate-400 mt-1.5">
                            <div>
                                <span className="block font-semibold text-slate-700 dark:text-slate-200">{offeredCredits.toFixed(2)}</span>
                                Offered
                            </div>
                            <div>
                                <span className="block font-semibold text-slate-700 dark:text-slate-200">{securedCredits.toFixed(2)}</span>
                                Secured
                            </div>
                            <div>
                                <span className="block font-semibold text-slate-700 dark:text-slate-200">{totalPoints.toFixed(2)}</span>
                                Points
                            </div>
                        </div>
                    </div>
                    <p className={`text-5xl sm:text-6xl font-bold transition-colors duration-300 ${getSgpaColor()} text-right flex-shrink-0`}>
                        {sgpa.toFixed(3)}
                    </p>
                </div>
            </div>
        );
    }

    // Normal version: A larger, more detailed card
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 max-w-2xl mx-auto text-center">
            <h2 className="text-lg font-medium text-slate-500 dark:text-slate-400">
                Semester GPA (SGPA)
            </h2>
            <p className={`text-7xl font-bold my-2 transition-colors duration-300 ${getSgpaColor()}`}>
                {sgpa.toFixed(3)}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-center gap-x-6 text-sm text-slate-500 dark:text-slate-400">
                <div>
                    <span className="block font-semibold text-slate-700 dark:text-slate-200">{offeredCredits.toFixed(2)}</span>
                    Credit Offered
                </div>
                <div>
                    <span className="block font-semibold text-slate-700 dark:text-slate-200">{securedCredits.toFixed(2)}</span>
                    Credit Secured
                </div>
                 <div>
                    <span className="block font-semibold text-slate-700 dark:text-slate-200">{totalPoints.toFixed(2)}</span>
                    Points Secured
                </div>
            </div>
        </div>
    );
};

export default SgpaDisplay;
