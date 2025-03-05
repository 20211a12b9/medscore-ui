import React, { useState } from 'react';
import { config } from '../config';
import { ArrowLeft } from 'lucide-react';

const JobPostingForm = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobType: '',
    experience: '',
    location: '',
    departmant: '',
    Salary: '',
    about: '',
    jobDescription: '',
    mandatorySkills: '',
    prefferedSkills: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch(`${config.API_HOST}/api/user/postjobOpenings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(data.message);
      setFormData({
        jobTitle: '',
        jobType: '',
        experience: '',
        location: '',
        departmant: '',
        Salary: '',
        about: '',
        jobDescription: '',
        mandatorySkills: '',
        prefferedSkills: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={handleBack}
          className="flex items-center text-white mb-4 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <h1 className="text-2xl font-bold mb-6 text-white">Post New Job Opening</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Enter job title"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select job type</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Experience Required</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g., 2-3 years"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Job location"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Department</label>
              <input
                type="text"
                name="departmant"
                value={formData.departmant}
                onChange={handleChange}
                placeholder="Enter department"
                required
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Salary</label>
              <input
                type="text"
                name="Salary"
                value={formData.Salary}
                onChange={handleChange}
                placeholder="Enter salary or leave blank"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">About Medscore</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Brief description about Medscore"
              required
              className="w-full p-2 border rounded h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">Job Description</label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Detailed job description"
              required
              className="w-full p-2 border rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-white">Mandatory Skills</label>
                <span className="text-xs text-blue-300">Must-have skills required for the job</span>
              </div>
              <textarea
                name="mandatorySkills"
                value={formData.mandatorySkills}
                onChange={handleChange}
                placeholder="Enter mandatory skills (comma separated)"
                required
                className="w-full p-2 border rounded h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-white">Preferred Skills</label>
                <span className="text-xs text-blue-300">Additional skills that give candidates an advantage</span>
              </div>
              <textarea
                name="prefferedSkills"
                value={formData.prefferedSkills}
                onChange={handleChange}
                placeholder="Enter preferred skills (comma separated)"
                required
                className="w-full p-2 border rounded h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg text-sm text-white">
            <h3 className="font-medium mb-2">Skills Requirements</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="font-medium mr-2">•</span>
                <span><strong>Mandatory Skills:</strong> These are the must-have skills required for the job. Without them, a candidate won't be considered.</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">•</span>
                <span><strong>Preferred Skills:</strong> These are good-to-have skills that can give a candidate an advantage, but they are not strictly required.</span>
              </li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Posting...' : 'Post Job Opening'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobPostingForm;