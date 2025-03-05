import React, { useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle, CloudUpload, X } from 'lucide-react';
import { config } from '../config';
import { Navbar } from './Navbar';

const UploadDistCentalData = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [dragActive, setDragActive] = useState(false);

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
      const customerId = localStorage.getItem('userId');
      const response = await fetch(`${config.API_HOST}/api/user/uploadMaharastracentalData`, {
        method: 'POST',
        // headers:{
        //   'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
        //   'Content-Type':'application/json'
        // },
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
            <div className="p-8 border-b border-emerald-100">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <Upload className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-800">
                Upload Distribution Data
              </h2>
              <p className="mt-2 text-center text-gray-600">
                Import your central distribution data file
              </p>
            </div>
            
            <div className="p-8 space-y-6">
              <div
                className={`relative border-3 border-dashed rounded-2xl p-10 transition-all
                  ${dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-200 hover:border-emerald-300'}
                  ${file ? 'bg-emerald-50/50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                
                {!file ? (
                  <label 
                    htmlFor="file-upload" 
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CloudUpload className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-700">
                        Drop your file here or <span className="text-emerald-600">browse</span>
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Supported formats: XLSX, XLS, CSV
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <File className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearFile}
                      className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>

              {status === 'success' && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-medium">File uploaded successfully!</p>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-medium">
                    {!file ? 'Please select a file first' : 'Error uploading file. Please try again.'}
                  </p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!file || loading}
                className={`w-full py-4 px-6 rounded-xl font-medium text-white shadow-lg
                  ${!file || loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
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
  );
};

export default UploadDistCentalData;