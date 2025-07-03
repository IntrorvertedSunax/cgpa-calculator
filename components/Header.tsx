import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-5 text-center">
        <h1 className="text-4xl font-extrabold text-primary-600 dark:text-primary-400">
          GPA &amp; CGPA Calculator
        </h1>
      </div>
    </header>
  );
};

export default Header;