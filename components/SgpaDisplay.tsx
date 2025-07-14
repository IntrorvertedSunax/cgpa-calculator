import React from 'react';

interface SgpaDisplayProps {
  sgpa: number;
  offeredCredits: number;
  securedCredits: number;
  totalPoints: number;
}

const SgpaDisplay: React.FC<SgpaDisplayProps> = ({ sgpa, offeredCredits, securedCredits, totalPoints }) => {
    const getSgpaColor = () => {
        if (sgpa >= 3.75) return 'text-green-500';
        if (sgpa >= 3.25) return 'text-blue-500';
        if (sgpa >= 2.5) return 'text-yellow-500';
        if (sgpa > 0) return 'text-orange-500';
        return 'text-slate-500';
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 max-w-md mx-auto text-center relative">
            <h2 className="text-lg font-medium text-slate-500 dark:text-slate-400">
                Semester GPA (SGPA)
            </h2>
            <p className={`text-7xl font-bold my-2 transition-colors duration-300 ${getSgpaColor()}`}>
                {sgpa.toFixed(3)}
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm text-slate-500 dark:text-slate-400 mt-4">
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