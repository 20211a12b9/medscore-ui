import React, { useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { config } from '../config';
import { Navbar } from './Navbar';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setStatus('error');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
        const customerid=await localStorage.getItem('userId')
      const response = await fetch(`${config.API_HOST}/api/user/outstanding/${customerid}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar/>
      </div>
      <div className="p-4 border-b border-gray-200 mt-16">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Outstanding File
        </h2>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label 
            htmlFor="file-upload" 
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <File className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-600">
              {file ? file.name : 'Drop your file here or click to browse'}
            </span>
            <span className="text-xs text-gray-400">
              Supported formats: XLSX, XLS, CSV
            </span>
          </label>
        </div>

        {status === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 rounded-md">
            <CheckCircle className="w-4 h-4" />
            <p>File uploaded successfully!</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-md">
            <AlertCircle className="w-4 h-4" />
            <p>{!file ? 'Please select a file first' : 'Error uploading file. Please try again.'}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${!file || loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
            } transition-colors duration-200`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading...
            </span>
          ) : (
            'Upload File'
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;