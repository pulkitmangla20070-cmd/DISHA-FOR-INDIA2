import React from 'react';
import { exportCSV, exportExcel, exportPDF } from '../../utils/export';

/**
 * ExportButtons – renders three export triggers (CSV, Excel, PDF).
 * `data` is the array of objects to export, `fileName` is the base name without extension.
 */
const ExportButtons = ({ data, fileName }) => {
  const handleCSV = () => exportCSV(data, `${fileName}.csv`);
  const handleExcel = () => exportExcel(data, `${fileName}.xlsx`);
  const handlePDF = () => exportPDF(data, `${fileName}.pdf`);

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleCSV}
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        aria-label="Export CSV"
      >
        CSV
      </button>
      <button
        onClick={handleExcel}
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        aria-label="Export Excel"
      >
        Excel
      </button>
      <button
        onClick={handlePDF}
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        aria-label="Export PDF"
      >
        PDF
      </button>
    </div>
  );
};

export default ExportButtons;
