import React, { useCallback } from 'react';
import { FileText, Upload } from 'lucide-react';

interface CsvUploadAreaProps {
  file: File | null;
  onFileChange: (file: File) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const CsvUploadArea: React.FC<CsvUploadAreaProps> = ({ 
  file, 
  onFileChange,
  fileInputRef 
}) => {
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        onFileChange(droppedFile);
      } else {
        alert('Please upload a CSV file');
      }
    }
  }, [onFileChange]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  }, [onFileChange]);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center transition-colors hover:bg-slate-100`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileInputChange}
      />
      
      {file ? (
        <div className="space-y-2 text-center">
          <FileText size={40} className="mx-auto text-indigo-600" />
          <div className="text-sm font-medium text-slate-900">{file.name}</div>
          <div className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</div>
        </div>
      ) : (
        <div className="space-y-2">
          <Upload size={40} className="mx-auto text-slate-400" />
          <div className="text-sm font-medium text-slate-900">
            Drag & drop a CSV file here, or click to browse
          </div>
          <div className="text-xs text-slate-500">
            Supported formats: .csv
          </div>
        </div>
      )}
    </div>
  );
};