import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CsvDataPreviewProps {
  data: {
    headers: string[];
    rows: string[][];
  };
}

export const CsvDataPreview: React.FC<CsvDataPreviewProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  
  const startRow = (currentPage - 1) * rowsPerPage;
  const endRow = Math.min(startRow + rowsPerPage, data.rows.length);
  const totalPages = Math.ceil(data.rows.length / rowsPerPage);
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {data.headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {data.rows.slice(startRow, endRow).map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="whitespace-nowrap px-6 py-4 text-sm text-slate-800"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-slate-50 px-4 py-3 sm:flex sm:items-center sm:justify-between sm:px-6">
          <div className="flex-1 text-sm text-slate-700">
            Showing {startRow + 1} to {endRow} of {data.rows.length} rows
          </div>
          <div className="mt-3 flex items-center justify-between sm:mt-0">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>
            <span className="mx-4 text-sm text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};