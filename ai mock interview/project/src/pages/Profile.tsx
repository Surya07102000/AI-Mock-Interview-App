import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Save, Upload, X, PenTool } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [industry, setIndustry] = useState('Technology');
  const [experience, setExperience] = useState('3-5 years');
  const [isEditing, setIsEditing] = useState(false);
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const handleSaveProfile = async () => {
    try {
      if (currentUser) {
        await updateUserProfile(currentUser, {
          displayName,
          photoURL,
          // In a real app, you would save the other fields to a database
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setPhotoURL(event.target.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and interview preferences</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-900 hover:bg-indigo-800"
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </>
            ) : (
              <>
                <PenTool className="h-4 w-4 mr-1" />
                Edit
              </>
            )}
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            {/* Profile Photo */}
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                  {photoURL ? (
                    <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-700 text-2xl font-bold">
                      {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="mt-2">
                    <label
                      htmlFor="photo-upload"
                      className="inline-block px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      Change Photo
                    </label>
                    <input
                      id="photo-upload"
                      name="photo"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handlePhotoChange}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile Form */}
            <div className="flex-grow space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
                    value={currentUser?.email || ''}
                    readOnly
                  />
                </div>
                
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <select
                    id="industry"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    disabled={!isEditing}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    id="experience"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    disabled={!isEditing}
                  >
                    <option value="Entry-level">Entry-level (0-2 years)</option>
                    <option value="3-5 years">Mid-level (3-5 years)</option>
                    <option value="6-10 years">Senior (6-10 years)</option>
                    <option value="10+ years">Expert (10+ years)</option>
                  </select>
                </div>
              </div>
              
              {/* Resume Upload */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Resume/CV
                  </label>
                  {!isEditing && resumeFile && (
                    <button className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                      Download
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="flex items-center mt-1">
                    <label
                      htmlFor="resume-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Resume
                    </label>
                    <input
                      id="resume-upload"
                      name="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                    {resumeFile && (
                      <span className="ml-3 text-sm text-gray-500">
                        {resumeFile.name}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    {resumeFile ? resumeFile.name : 'No resume uploaded yet.'}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Upload your resume to help personalize your interview questions.
                </p>
              </div>
              
              {/* Save Button */}
              {isEditing && (
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-900 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Interview Preferences */}
      <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Interview Preferences</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {/* Interview Focus */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Interview Focus Areas</h3>
              <div className="space-y-2">
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="focus-coding"
                      name="focus-coding"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="focus-coding" className="font-medium text-gray-700">
                      Coding & Algorithms
                    </label>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="focus-system"
                      name="focus-system"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="focus-system" className="font-medium text-gray-700">
                      System Design
                    </label>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="focus-behavioral"
                      name="focus-behavioral"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="focus-behavioral" className="font-medium text-gray-700">
                      Behavioral Questions
                    </label>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="focus-leadership"
                      name="focus-leadership"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="focus-leadership" className="font-medium text-gray-700">
                      Leadership & Management
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Difficulty Level */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Difficulty Level</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    id="difficulty-beginner"
                    name="difficulty"
                    type="radio"
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="difficulty-beginner" className="ml-2 text-sm text-gray-700">
                    Beginner
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="difficulty-intermediate"
                    name="difficulty"
                    type="radio"
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    defaultChecked
                  />
                  <label htmlFor="difficulty-intermediate" className="ml-2 text-sm text-gray-700">
                    Intermediate
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="difficulty-advanced"
                    name="difficulty"
                    type="radio"
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="difficulty-advanced" className="ml-2 text-sm text-gray-700">
                    Advanced
                  </label>
                </div>
              </div>
            </div>
            
            {/* Interview Length */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Interview Length</h3>
              <select
                id="interview-length"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                defaultValue="medium"
              >
                <option value="short">Short (15 minutes, ~5 questions)</option>
                <option value="medium">Medium (30 minutes, ~10 questions)</option>
                <option value="long">Long (45 minutes, ~15 questions)</option>
                <option value="comprehensive">Comprehensive (60 minutes, ~20 questions)</option>
              </select>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-900 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;