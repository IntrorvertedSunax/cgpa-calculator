import React, { useState } from 'react';
import Header from './components/Header';
import SgpaCalculator from './components/SgpaCalculator';
import CgpaCalculator from './components/CgpaCalculator';

type View = 'sgpa' | 'cgpa';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('sgpa');

  const getButtonClasses = (view: View) => {
    const baseClasses = 'px-6 py-3 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-75 transition-all duration-300';
    if (activeView === view) {
      return `${baseClasses} bg-primary-600 text-white shadow-md`;
    }
    return `${baseClasses} bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600`;
  };

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setActiveView('sgpa')} className={getButtonClasses('sgpa')}>
            Semester GPA Calculator
          </button>
          <button onClick={() => setActiveView('cgpa')} className={getButtonClasses('cgpa')}>
            Overall CGPA Calculator
          </button>
        </div>
        
        <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                Department of Electrical and Electronic Engineering
            </h3>
        </div>

        {activeView === 'sgpa' && <SgpaCalculator />}
        {activeView === 'cgpa' && <CgpaCalculator />}

      </main>
      <footer className="text-center py-6 mt-8 text-slate-500 dark:text-slate-400 text-sm">
        <p>Developed by Introverted Sunax</p>
      </footer>
    </div>
  );
};

export default App;