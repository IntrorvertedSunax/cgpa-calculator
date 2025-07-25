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
            { rootMargin: '-1px 0px 0px 0px', threshold: 1 }
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
        if (event.key === 'Enter' || event.key === 'ArrowDown') {
            event.preventDefault();
            const nextIndex = currentIndex + 1;
            if (nextIndex < semesterKeys.length) {
                document.getElementById(`gpa-input-${semesterKeys[nextIndex]}`)?.focus();
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            const prevIndex = currentIndex - 1;
            if (prevIndex >= 0) {
                document.getElementById(`gpa-input-${semesterKeys[prevIndex]}`)?.focus();
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
        doc.setFont('helvetica');

        doc.setFontSize(22);
        doc.setTextColor(40);
        doc.text('Overall CGPA Report', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('Department of Electrical and Electronic Engineering', 105, 28, { align: 'center' });

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
            headStyles: { fillColor: [79, 70, 229] }, // primary-600
        });

        const finalY = (doc as any).lastAutoTable.finalY;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40);
        doc.text('Overall Result', 14, finalY + 20);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        
        const summaryText = `
          CGPA: ${cgpaData.cgpa.toFixed(3)}
          Total Credits Completed: ${cgpaData.totalCredits.toFixed(2)}
          Total Points Secured: ${cgpaData.totalPoints.toFixed(2)}
        `;
        doc.text(summaryText, 14, finalY + 27);
        
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
    const cardBaseClasses = "transition-all duration-300 ease-in-out";
    const glassEffectClasses = "bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-white/20 dark:border-neutral-800/80 shadow-lg";

    return (
        <section>
            <div ref={displayElementRef} className="py-4">
                <CgpaDisplay 
                    cgpa={cgpaData.cgpa} 
                    totalCredits={cgpaData.totalCredits}
                    isSticky={false}
                />
            </div>

            <div className={`fixed top-0 left-0 right-0 z-20 py-4 ${glassEffectClasses} transition-all duration-300 ease-in-out ${isSticky ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
                <CgpaDisplay 
                    cgpa={cgpaData.cgpa} 
                    totalCredits={cgpaData.totalCredits}
                    isSticky={true}
                />
            </div>

            <div className="max-w-3xl mx-auto">
                <div className={`mt-8 ${cardBaseClasses} ${glassEffectClasses} rounded-2xl p-6`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {semesterKeys.map((key, index) => (
                            <div key={key} className="flex items-center justify-between gap-4 p-2 rounded-lg transition-colors hover:bg-neutral-500/10">
                                <div>
                                    <p className="font-semibold text-neutral-800 dark:text-neutral-100">Semester {key}</p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{semesterCreditMap[key]} Credits</p>
                                </div>
                                <input
                                    id={`gpa-input-${key}`}
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="GPA"
                                    value={gpas[key] || ''}
                                    onChange={e => handleGpaChange(key, e.target.value)}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    className="w-28 bg-white/50 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 rounded-lg p-2 text-sm text-right focus:ring-2 focus:ring-primary-500/80 focus:border-primary-500 outline-none transition"
                                    aria-label={`GPA for Semester ${key}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                 {canDownload && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleDownloadPdf}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-950 focus:ring-primary-500/70 transition-all duration-300 bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-primary-500/40 hover:from-primary-600 hover:to-primary-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <DownloadIcon />
                            Download Report
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CgpaCalculator;