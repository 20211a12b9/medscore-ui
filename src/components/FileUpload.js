import React, { useState, useRef } from 'react';
import { Upload, File, CheckCircle, AlertCircle, CloudUpload, X } from 'lucide-react';
import { config } from '../config';
import { Navbar } from './Navbar';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
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
      const customerId = await localStorage.getItem('userId');
      const response = await fetch(`${config.API_HOST}/api/user/outstanding/${customerId}`, {
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

  const clearFile = () => {
    setFile(null);
    setStatus(null);
    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-800">
                Upload Outstanding File
              </h2>
              <p className="mt-2 text-center text-gray-600">
                Import your outstanding data file here
              </p>
            </div>
            
            <div className="p-8 space-y-6">
              <div
                className={`relative border-3 border-dashed rounded-xl p-10 transition-all
                  ${dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}
                  ${file ? 'bg-gray-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={!file ? triggerFileInput : undefined}
              >
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  ref={fileInputRef}
                />
                
                {!file ? (
                  <div className="cursor-pointer flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                      <CloudUpload className="w-10 h-10 text-purple-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-700">
                        Drop your file here or <span className="text-purple-600">browse</span>
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Supported formats: XLSX, XLS, CSV
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <File className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile();
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Remove file"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>

              {file && (
                <div className="flex justify-center">
                  <button
                    onClick={triggerFileInput}
                    className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    Choose a different file
                  </button>
                </div>
              )}

              {status === 'success' && (
                <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-medium">File uploaded successfully!</p>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-medium">
                    {!file ? 'Please select a file first' : 'Error uploading file. Please try again.'}
                  </p>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={!file || loading}
                  className={`px-8 py-4 rounded-xl font-medium text-white shadow-lg
                    ${!file || loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    } transition-all duration-200`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    'Upload File'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;