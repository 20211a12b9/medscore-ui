import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, Clock,ChevronRight } from 'lucide-react';
import { config } from '../config';
import { HomeNavbar } from './HomeNavbar';
import HomeFooter from './HomeFooter';

export const Openings = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const Modal = ({ job, onClose }) => {
    if (!job) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-10 z-50 w-full">
        <div className="bg-white rounded-lg p-6 max-w-full w-full max-h-[90vh] overflow-y-auto">
        <div className="watermark absolute top-1/2 left-1/2 rotate-[-30deg] opacity-30 pointer-events-none">
          <h1 className="text-6xl font-extrabold text-gray-300">MedScore</h1>
        </div>

        <div className="watermark absolute top-1/3 left-1/3 rotate-[-30deg] opacity-30 pointer-events-none">
          <h1 className="text-6xl font-extrabold text-gray-300">MedScore</h1>
        </div>

          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-[#005676]">{job.jobTitle}</h2>
            <button 
              onClick={onClose}
              className=" text-gray-500 hover:text-gray-700 text-3xl"
            >
              ✕
            </button>
          </div>
          <div>
            <div className='flex flex-row gap-6'>
            <span className="text-base font-bold text-[#00ADEE]">{job.jobType} </span>
            <h1>|</h1>
            <span className="text-base font-bold text-[#00ADEE]">{job.experience} </span>
            <h1>|</h1>
            <span className="text-base font-bold text-[#00ADEE]">{job.location}</span>
            </div>
            </div>
            <div className="mt-6  mb-6 text-start">
              <p className="text-lg font-bold text-[#005676]">
                Interested candidates can share their CV at <a href="mailto:medscore24@gmail.com" className="text-[#00ADEE] hover:underline">
  medscore24@gmail.com
</a>

              </p>
            </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-extrabold mb-2 text-start text-[#005676]">About Us</h4>
              <p className="text-gray-600 text-start">{job.about}</p>
            </div>
            <div>
              <h4 className="font-extrabold mb-2 text-start text-[#005676]">Job Description</h4>
              <p className="text-gray-600 text-start">{job.jobDescription}</p>
            </div>
            <div>
              <h4 className="font-extrabold mb-2 text-start text-[#005676]">Required Skills</h4>
              <div className="space-y-2">
                {job.mandatorySkills.split(';').map((skill, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span className="text-gray-600">{skill.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-extrabold mb-2 text-start text-[#005676]">Preferred Skills</h4>
              <div className="space-y-2">
                {job.prefferedSkills.split(';').map((skill, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span className="text-gray-600">{skill.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6  mb-6 text-start">
              <p className="text-lg font-bold text-[#005676]">
                Interested candidates can share their CV at <a href="mailto:medscore24@gmail.com" className="text-[#00ADEE] hover:underline">
  medscore24@gmail.com
</a>

              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HomeNavbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-serif mb-8 text-[#005676]">Current Openings</h2>
        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {jobs.map((job) => (
            <div 
              key={job._id} 
              className="border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white"
            >
                
                <div className='mr-36 mt-4'>
                  <h3 className="text-2xl font-bold text-[#005676]">{job.jobTitle}</h3>
                  
                </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-bold">Job Type:</span>
                      <span className="text-sm">{job.jobType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-bold">Experience:</span>
                      <span className="text-sm">{job.experience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-bold">Location:</span>
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                     
                      <span className="font-bold">Posted on:</span>
                      <span className="text-sm">{formatDate(job.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
  <button
    onClick={() => {
      setSelectedJob(job);
      setIsModalOpen(true);
    }}
    className="mt-4 text-lime-700 py-2 px-4 transition-colors duration-200 flex items-center gap-1"
  >
    View Details <ChevronRight className="w-4 h-4 text-[#005676]" />
  </button>
</div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <Modal 
          job={selectedJob} 
          onClose={() => {
            setSelectedJob(null);
            setIsModalOpen(false);
          }}
        />
      )}
      <HomeFooter />
    </div>
  );
};

export default Openings;