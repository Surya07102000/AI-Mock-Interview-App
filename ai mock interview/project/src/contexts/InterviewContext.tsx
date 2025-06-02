import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

// Types
interface Interview {
  id: string;
  type: string;
  status: 'in-progress' | 'completed';
  startTime: Date;
  endTime?: Date;
  score?: number;
  questions?: Question[];
  userId: string;
  
  // For display purposes in the history
  date?: string;
  duration?: string;
}

interface Question {
  id: number;
  text: string;
  response?: string;
  feedback?: string;
}

interface InterviewContextType {
  startInterview: (type: string) => string;
  getInterviewById: (id: string) => Interview | null;
  updateInterviewStatus: (id: string, status: 'in-progress' | 'completed') => void;
  saveInterviewResponse: (id: string, questionIndex: number, response: string, feedback: string) => void;
  getCompletedInterviews: () => Interview[];
}

const InterviewContext = createContext<InterviewContextType | null>(null);

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};

interface InterviewProviderProps {
  children: React.ReactNode;
}

export const InterviewProvider: React.FC<InterviewProviderProps> = ({ children }) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const { currentUser } = useAuth();
  
  const startInterview = (type: string): string => {
    const newId = uuidv4();
    const newInterview: Interview = {
      id: newId,
      type,
      status: 'in-progress',
      startTime: new Date(),
      userId: currentUser?.uid || 'anonymous',
    };
    
    setInterviews([...interviews, newInterview]);
    return newId;
  };
  
  const getInterviewById = (id: string): Interview | null => {
    return interviews.find(interview => interview.id === id) || null;
  };
  
  const updateInterviewStatus = (id: string, status: 'in-progress' | 'completed') => {
    setInterviews(prevInterviews => 
      prevInterviews.map(interview => {
        if (interview.id === id) {
          const updatedInterview = { 
            ...interview, 
            status,
            endTime: status === 'completed' ? new Date() : undefined,
            // Simulate a score for completed interviews
            score: status === 'completed' ? Math.floor(Math.random() * 21) + 80 : undefined,
          };
          return updatedInterview;
        }
        return interview;
      })
    );
  };
  
  const saveInterviewResponse = (id: string, questionIndex: number, response: string, feedback: string) => {
    setInterviews(prevInterviews => 
      prevInterviews.map(interview => {
        if (interview.id === id) {
          const questions = interview.questions || [];
          const updatedQuestions = [...questions];
          
          updatedQuestions[questionIndex] = {
            id: questionIndex,
            text: `Question ${questionIndex + 1}`,
            response,
            feedback
          };
          
          return {
            ...interview,
            questions: updatedQuestions
          };
        }
        return interview;
      })
    );
  };
  
  const getCompletedInterviews = (): Interview[] => {
    // Simulate some completed interviews for display
    const mockInterviews = [
      {
        id: 'mock1',
        type: 'technical',
        status: 'completed' as const,
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 30), // 30 min later
        score: 92,
        userId: currentUser?.uid || 'anonymous',
        date: '2 days ago',
        duration: '30 min'
      },
      {
        id: 'mock2',
        type: 'behavioral',
        status: 'completed' as const,
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
        endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4 + 1000 * 60 * 45), // 45 min later
        score: 85,
        userId: currentUser?.uid || 'anonymous',
        date: '4 days ago',
        duration: '45 min'
      },
      {
        id: 'mock3',
        type: 'industry',
        status: 'completed' as const,
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
        endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 35), // 35 min later
        score: 78,
        userId: currentUser?.uid || 'anonymous',
        date: '1 week ago',
        duration: '35 min'
      }
    ];
    
    const completedInterviews = interviews
      .filter(interview => interview.status === 'completed')
      .map(interview => ({
        ...interview,
        date: formatDate(interview.startTime),
        duration: formatDuration(interview.startTime, interview.endTime || new Date())
      }));
    
    return [...mockInterviews, ...completedInterviews];
  };
  
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };
  
  const formatDuration = (start: Date, end: Date): string => {
    const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    return `${diffMinutes} min`;
  };
  
  const value = {
    startInterview,
    getInterviewById,
    updateInterviewStatus,
    saveInterviewResponse,
    getCompletedInterviews
  };
  
  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};