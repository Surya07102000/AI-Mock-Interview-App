import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Award, ChevronRight, Filter, Download, BarChart3, Code, PenTool, Briefcase } from 'lucide-react';
import { useInterview } from '../contexts/InterviewContext';

const InterviewHistory: React.FC = () => {
  const { getCompletedInterviews } = useInterview();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const interviews = getCompletedInterviews();
  
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'technical':
        return <Code className="w-5 h-5 text-blue-600" />;
      case 'behavioral':
        return <PenTool className="w-5 h-5 text-purple-600" />;
      case 'industry':
        return <Briefcase className="w-5 h-5 text-indigo-600" />;
      default:
        return <Code className="w-5 h-5 text-blue-600" />;
    }
  };
  
  const filteredInterviews = activeFilter === 'all' 
    ? interviews 
    : interviews.filter(interview => interview.type === activeFilter);
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interview History</h1>
          <p className="mt-2 text-gray-600">Review your past interviews and track your progress</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-900 hover:bg-indigo-800">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Filter Interviews</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <FilterButton 
            label="All Interviews"
            active={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          />
          <FilterButton 
            label="Technical"
            active={activeFilter === 'technical'}
            onClick={() => setActiveFilter('technical')}
          />
          <FilterButton 
            label="Behavioral"
            active={activeFilter === 'behavioral'}
            onClick={() => setActiveFilter('behavioral')}
          />
          <FilterButton 
            label="Industry-Specific"
            active={activeFilter === 'industry'}
            onClick={() => setActiveFilter('industry')}
          />
        </div>
      </div>
      
      {/* Interview List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Interview Sessions ({filteredInterviews.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredInterviews.length > 0 ? (
            filteredInterviews.map((interview) => (
              <div 
                key={interview.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/history/${interview.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        {getTypeIcon(interview.type)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview
                      </h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>{interview.date}</span>
                        <Clock className="flex-shrink-0 mx-1.5 h-4 w-4 text-gray-400" />
                        <span>{interview.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      <Award className="flex-shrink-0 mr-1.5 h-5 w-5 text-indigo-500" />
                      <span className="text-sm font-medium text-gray-900">{interview.score}%</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-gray-500">No interviews match the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, active, onClick }) => {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-md ${
        active
          ? 'bg-indigo-100 text-indigo-800'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default InterviewHistory;