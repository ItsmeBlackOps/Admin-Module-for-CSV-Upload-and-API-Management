import React, { useState, useRef } from 'react';
import { 
  Upload, FileText, AlertCircle, CheckCircle, 
  Download, RefreshCw, Eye 
} from 'lucide-react';
import { CsvDataPreview } from '../components/csv/CsvDataPreview';
import { CsvUploadArea } from '../components/csv/CsvUploadArea';
import { CsvProcessingOptions } from '../components/csv/CsvProcessingOptions';
import { CandidateReview } from '../components/csv/CandidateReview';

interface CsvData {
  headers: string[];
  rows: string[][];
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
type ViewMode = 'preview' | 'review' | 'options';

export const CsvUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setUploadStatus('idle');
    setErrorMessage('');
    setViewMode('preview');
    setCsvData(null);
  };

  const parseCsvFile = (file: File): Promise<CsvData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const csvContent = event.target?.result as string;
          const lines = csvContent.split('\n');
          
          // Extract headers from the first line
          const headers = lines[0].split(',').map(header => header.trim());
          
          // Process the rest of the rows
          const rows = lines.slice(1)
            .filter(line => line.trim() !== '') // Remove empty lines
            .map(line => line.split(',').map(cell => cell.trim()));
          
          resolve({ headers, rows });
        } catch (error) {
          reject('Error parsing CSV file. Please check the format.');
        }
      };
      
      reader.onerror = () => {
        reject('Error reading the file');
      };
      
      reader.readAsText(file);
    });
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 5;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 200);
    
    try {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Parse CSV file
      const data = await parseCsvFile(file);
      setCsvData(data);
      
      // Complete the upload
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
      setViewMode('preview');
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus('error');
      setErrorMessage(error as string);
    }
  };

  const handleReset = () => {
    setFile(null);
    setCsvData(null);
    setUploadStatus('idle');
    setErrorMessage('');
    setUploadProgress(0);
    setViewMode('preview');
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStop = () => {
    // Export remaining candidates
    if (csvData) {
      const blob = new Blob([
        // Add headers
        csvData.headers.join(',') + '\n',
        // Add unprocessed rows
        csvData.rows.map(row => row.join(',')).join('\n')
      ], { type: 'text/csv' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'remaining_candidates.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-800">CSV File Upload</h2>
          <p className="mt-1 text-sm text-slate-600">
            Upload and process CSV files with candidate and company data
          </p>
        </div>
        
        <CsvUploadArea 
          file={file}
          onFileChange={handleFileChange}
          fileInputRef={fileInputRef}
        />
        
        {/* Upload status */}
        {uploadStatus === 'uploading' && (
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Uploading...</span>
              <span className="text-sm font-medium text-slate-700">{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div 
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {uploadStatus === 'error' && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="mr-3 h-5 w-5 text-red-500" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error uploading file</h3>
                <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Success message */}
        {uploadStatus === 'success' && (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
              <div>
                <h3 className="text-sm font-medium text-green-800">File uploaded successfully</h3>
                <p className="mt-1 text-sm text-green-700">
                  Your CSV file has been uploaded and is ready for processing.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="mt-6 flex justify-between">
          <div className="flex space-x-3">
            {file && uploadStatus === 'idle' && (
              <button
                onClick={handleUpload}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Upload size={16} className="mr-2" />
                Upload File
              </button>
            )}
            
            {uploadStatus === 'success' && (
              <>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    viewMode === 'preview'
                      ? 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Eye size={16} className="mr-2" />
                  Preview
                </button>
                
                <button
                  onClick={() => setViewMode('review')}
                  className={`inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    viewMode === 'review'
                      ? 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <FileText size={16} className="mr-2" />
                  Review
                </button>
                
                <button
                  onClick={() => setViewMode('options')}
                  className={`inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    viewMode === 'options'
                      ? 'border-transparent bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <RefreshCw size={16} className="mr-2" />
                  Options
                </button>
              </>
            )}
          </div>
          
          <button
            onClick={handleReset}
            className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <RefreshCw size={16} className="mr-2" />
            Reset
          </button>
        </div>
      </div>
      
      {/* Content based on view mode */}
      {uploadStatus === 'success' && csvData && (
        <>
          {viewMode === 'preview' && (
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-slate-800">Data Preview</h3>
              <CsvDataPreview data={csvData} />
              
              <div className="mt-6 flex justify-between border-t border-slate-200 pt-6">
                <div>
                  <button
                    onClick={() => {
                      const blob = new Blob([
                        csvData.headers.join(',') + '\n',
                        csvData.rows.map(row => row.join(',')).join('\n')
                      ], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'exported_data.csv';
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                    className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {viewMode === 'review' && (
            <CandidateReview 
              data={csvData}
              onStop={handleStop}
            />
          )}
          
          {viewMode === 'options' && (
            <CsvProcessingOptions />
          )}
        </>
      )}
    </div>
  );
};