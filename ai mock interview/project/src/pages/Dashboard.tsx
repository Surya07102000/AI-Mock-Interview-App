import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Code, PenTool, PlayCircle, Award, BookOpen, Clock, BarChart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useInterview } from '../contexts/InterviewContext';

const interviewTypes = [
  { 
    id: 'technical', 
    name: 'Technical Interview', 
    description: 'Practice coding problems, system design, and technical concepts',
    icon: <Code className="w-8 h-8 text-blue-600" />,
    color: 'bg-blue-100 border-blue-200'
  },
  { 
    id: 'behavioral', 
    name: 'Behavioral Interview', 
    description: 'Master common behavioral questions and STAR method responses',
    icon: <PenTool className="w-8 h-8 text-purple-600" />,
    color: 'bg-purple-100 border-purple-200'
  },
  { 
    id: 'industry', 
    name: 'Industry-Specific', 
    description: 'Focused on your industry with specialized questions',
    icon: <Briefcase className="w-8 h-8 text-indigo-600" />,
    color: 'bg-indigo-100 border-indigo-200'
  }
];

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { startInterview } = useInterview();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const handleStartInterview = () => {
    if (selectedType) {
      const interviewId = startInterview(selectedType);
      navigate(`/interview/${interviewId}`);
    }
  };
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {currentUser?.displayName || 'User'}</h1>
        <p className="mt-2 text-gray-600">Ready to practice for your next interview? Select an interview type to get started.</p>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={<PlayCircle className="w-6 h-6 text-indigo-600" />}
          title="Total Interviews"
          value="12"
          change="+3 this week"
          positive={true}
        />
        <StatCard 
          icon={<Clock className="w-6 h-6 text-indigo-600" />}
          title="Practice Time"
          value="8h 30m"
          change="+2h this week"
          positive={true}
        />
        <StatCard 
          icon={<Award className="w-6 h-6 text-indigo-600" />}
          title="Performance Score"
          value="85%"
          change="+5% from last interview"
          positive={true}
        />
      </div>
      
      {/* Interview Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Interview Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {interviewTypes.map((type) => (
            <div 
              key={type.id}
              className={`border rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                selectedType === type.id 
                  ? `${type.color} border-2` 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  {type.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.name}</h3>
                <p className="text-gray-600 mb-4 flex-grow">{type.description}</p>
                <div className="flex justify-end">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedType === type.id 
                      ? 'border-indigo-600 bg-indigo-600' 
                      : 'border-gray-300'
                  }`}>
                    {selectedType === type.id && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center">
          <button 
            className={`py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              selectedType 
                ? 'bg-indigo-900 text-white hover:bg-indigo-800' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedType}
            onClick={handleStartInterview}
          >
            Start Interview
          </button>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
            View all
          </button>
        </div>
        
        <div className="space-y-6">
          <ActivityItem 
            type="technical"
            date="Today"
            score={92}
            duration="32 min"
          />
          <ActivityItem 
            type="behavioral"
            date="Yesterday"
            score={78}
            duration="45 min"
          />
          <ActivityItem 
            type="industry"
            date="3 days ago"
            score={85}
            duration="28 min"
          />
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  positive: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, positive }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className={`text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </p>
      </div>
    </div>
  );
};

interface ActivityItemProps {
  type: string;
  date: string;
  score: number;
  duration: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ type, date, score, duration }) => {
  const typeInfo = interviewTypes.find(t => t.id === type) || interviewTypes[0];
  
  return (
    <div className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-150">
      <div className={`p-3 rounded-lg ${typeInfo.color}`}>
        {typeInfo.icon}
      </div>
      <div className="ml-4 flex-grow">
        <h4 className="text-sm font-medium text-gray-900">{typeInfo.name}</h4>
        <p className="text-sm text-gray-500">{date} • {duration}</p>
      </div>
      <div className="flex items-center">
        <BarChart className="w-4 h-4 text-gray-400 mr-2" />
        <span className="font-medium text-gray-900">{score}%</span>
      </div>
    </div>
  );
};

export default Dashboard;