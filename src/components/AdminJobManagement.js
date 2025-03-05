import React, { useState, useEffect } from 'react';
import { Trash2,ChevronLeft,ChevronLeftCircleIcon } from 'lucide-react';
import { config } from '../config';
import { useNavigate } from 'react-router-dom';
const AdminJobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
const navigate=useNavigate();
  useEffect(() => {
    const fetchJobOpenings = async () => {
      try {
        const response = await fetch(`${config.API_HOST}/api/user/getJobOpenings`);
        if (!response.ok) throw new Error('Failed to fetch JobOpenings');
        const data = await response.json();
        setJobs(data.data);
      } catch (error) {
        setError('Unable to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobOpenings();
  }, []);

  const handleDeleteClick = (job) => {
    setSelectedJob(job);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${config.API_HOST}/api/user/deleteJobOpenings/${selectedJob._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to delete job');

      setJobs(jobs.filter(job => job._id !== selectedJob._id));
      setShowConfirmModal(false);
      setSelectedJob(null);
    } catch (error) {
      setError('Failed to delete job. Please try again.');
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-400">
      <h1 className="text-2xl font-bold mb-4">Manage Job Openings</h1>
      <button className='top-3 left-10 absolute flex font-bold text-2xl' onClick={()=>navigate(-1)}><ChevronLeftCircleIcon className='mt-1 text-2xl'/>Back</button>
      <div className="overflow-x-auto">
        <table className="w-full  border-collapse">
          <thead>
            <tr className="bg-gray-300 ">
              <th className="text-left p-4 border">Job Title</th>
              <th className="text-left p-4 border">Experience</th>
              <th className="text-left p-4 border">Location</th>
              <th className="text-left p-4 border">Type</th>
              <th className="text-center p-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50">
                <td className="p-4 border font-medium">{job.jobTitle}</td>
                <td className="p-4 border">{job.experience}</td>
                <td className="p-4 border">{job.location}</td>
                <td className="p-4 border">{job.jobType}</td>
                <td className="p-4 border text-center">
                  <button
                    onClick={() => handleDeleteClick(job)}
                    className="p-2 hover:bg-red-100 rounded-full transition-colors"
                    aria-label="Delete job"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Delete Job Opening</h2>
            <p className="mb-6">Are you sure you want to delete this job opening? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
     
    </div>
  );
};

export default AdminJobManagement;