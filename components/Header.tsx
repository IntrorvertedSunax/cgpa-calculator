import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-5 text-center">
        <h1 className="text-4xl font-extrabold text-primary-600 dark:text-primary-400">
          GPA &amp; CGPA Calculator
        </h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          Choose between calculating your Semester GPA (SGPA) by course, or calculating your overall CGPA from your semester-wise GPA.
        </p>
      </div>
    </header>
  );
};

export default Header;