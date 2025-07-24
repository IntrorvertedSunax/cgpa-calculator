
import React, { useState, useMemo, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SEMESTER_COURSES } from '../constants';
import CgpaDisplay from './CgpaDisplay';
import DownloadIcon from './icons/DownloadIcon';

const semesterCreditMap = Object.fromEntries(
    Object.entries(SEMESTER_COURSES).map(([key, courses]) => [
        key,
        courses.reduce((sum, course) => sum + course.credits, 0)
    ])
);

const semesterKeys = Object.keys(semesterCreditMap);

interface CgpaCalculatorProps {
  cgpaState: {
    gpas: Record<string, string>;
  };
  setCgpaState: React.Dispatch<React.SetStateAction<{
    gpas: Record<string, string>;
  }>>;
}

const CgpaCalculator: React.FC<CgpaCalculatorProps> = ({ cgpaState, setCgpaState }) => {
    const { gpas } = cgpaState;
    const [isSticky, setIsSticky] = useState(false);
    const displayElementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const displayElement = displayElementRef.current;
        if (!displayElement) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsSticky(!entry.isIntersecting && entry.boundingClientRect.y < 0);
            },
            { threshold: 0 }
        );
        
        observer.observe(displayElement);

        return () => {
            if (displayElement) observer.unobserve(displayElement);
        };
    }, []);

    const handleGpaChange = (semesterKey: string, value: string) => {
        if (/^(\d{1,1}(\.\d{0,3})?)?$/.test(value)) {
            setCgpaState(prev => ({ ...prev, gpas: { ...prev.gpas, [semesterKey]: value } }));
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
        return { cgpa, totalCredits, totalPoints };
    }, [gpas]);

    const handleDownloadPdf = () => {
        if (cgpaData.totalCredits === 0) return;

        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(22);
        doc.text('Overall CGPA Report', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Department of Electrical and Electronic Engineering', 105, 28, { align: 'center' });

        // Table
        const tableColumn = ["Semester", "Semester Credits", "GPA", "Points Secured"];
        const tableRows: (string | number)[][] = [];

        semesterKeys.forEach(key => {
            const gpaStr = gpas[key];
            if (gpaStr) {
                const gpa = parseFloat(gpaStr);
                const credits = semesterCreditMap[key];
                if (!isNaN(gpa) && gpa >= 0 && gpa <= 4) {
                    tableRows.push([
                        `Semester ${key}`,
                        credits.toFixed(2),
                        gpa.toFixed(3),
                        (gpa * credits).toFixed(2)
                    ]);
                }
            }
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            theme: 'grid',
            headStyles: { fillColor: [37, 99, 235] }, // primary-600
        });

        // Summary
        const finalY = (doc as any).lastAutoTable.finalY;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Overall Result', 14, finalY + 20);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        
        const summaryText = `
          Cumulative GPA (CGPA): ${cgpaData.cgpa.toFixed(3)}
          Total Credits Completed: ${cgpaData.totalCredits.toFixed(2)}
          Total Points Secured: ${cgpaData.totalPoints.toFixed(2)}
        `;
        doc.text(summaryText, 14, finalY + 27);
        
        // Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
            doc.text(`Generated by Interactive GPA & CGPA Calculator`, 14, doc.internal.pageSize.getHeight() - 10);
        }

        doc.save('CGPA_Report.pdf');
    };

    const canDownload = cgpaData.totalCredits > 0;

    return (
        <div>
            <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mt-1 mb-2">
                    Cumulative Grade Point Average (CGPA)
                </h2>
            </div>
            
            {/* In-flow element that transitions out */}
            <div 
                ref={displayElementRef} 
                className={`py-4 transition-all duration-300 ease-in-out ${isSticky ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}
            >
                <CgpaDisplay 
                    cgpa={cgpaData.cgpa} 
                    totalCredits={cgpaData.totalCredits}
                    isSticky={false}
                />
            </div>

            {/* Sticky header that transitions in */}
            <div className={`fixed top-0 left-0 right-0 z-10 py-4 bg-gray-50/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 shadow-md transition-all duration-300 ease-in-out ${isSticky ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
                <CgpaDisplay 
                    cgpa={cgpaData.cgpa} 
                    totalCredits={cgpaData.totalCredits}
                    isSticky={true}
                />
            </div>


            <div className="max-w-2xl mx-auto">
                {canDownload && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleDownloadPdf}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-75 transition-all duration-300 bg-primary-600 text-white shadow-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!canDownload}
                        >
                            <DownloadIcon />
                            Download CGPA
                        </button>
                    </div>
                )}
                
                <div className="mt-8">
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
        </div>
    );
};

export default CgpaCalculator;