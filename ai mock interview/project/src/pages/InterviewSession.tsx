import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Send, Mic, MicOff, Clock, Check, X } from 'lucide-react';
import { useInterview } from '../contexts/InterviewContext';

const InterviewSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getInterviewById, updateInterviewStatus, saveInterviewResponse } = useInterview();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [userResponse, setUserResponse] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(120); // 2 minutes per question
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const interview = id ? getInterviewById(id) : null;
  
  // Simulated interview questions based on type
  const questions = [
    "Tell me about yourself and your background.",
    "What are your greatest strengths and weaknesses?",
    "Describe a challenging situation you faced at work and how you handled it.",
    "Why are you interested in this position?",
    "Where do you see yourself in 5 years?"
  ];
  
  useEffect(() => {
    if (!interview) {
      navigate('/dashboard');
    }
    
    // Simulate AI typing effect
    setIsTyping(true);
    const typingTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
    
    // Start timer
    startTimer();
    
    return () => {
      clearTimeout(typingTimeout);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [interview, currentQuestion, navigate]);
  
  const startTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    setTimer(120);
    timerIntervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerIntervalRef.current!);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };
  
  const handleNextQuestion = () => {
    // Save current response
    if (id) {
      saveInterviewResponse(id, currentQuestion, userResponse, feedback || '');
    }
    
    // Check if interview is complete
    if (currentQuestion >= questions.length - 1) {
      if (id) {
        updateInterviewStatus(id, 'completed');
      }
      navigate('/dashboard');
      return;
    }
    
    // Move to next question
    setCurrentQuestion(currentQuestion + 1);
    setUserResponse('');
    setFeedback(null);
    setShowFeedback(false);
    startTimer();
  };
  
  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });
      
      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks);
        // Here you would normally send this blob to a speech-to-text service
        // For now, we'll simulate with a placeholder response
        setUserResponse(userResponse + " [Transcribed audio response would appear here]");
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      });
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Unable to access microphone. Please check your browser permissions.');
    }
  };
  
  const handleSubmitResponse = () => {
    // Stop timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    // Simulate AI feedback
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setFeedback(
        "Your response demonstrates good communication skills. Consider providing more specific examples to illustrate your points. Overall, this is a solid answer that effectively addresses the question."
      );
      setShowFeedback(true);
    }, 2000);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (!interview) {
    return null;
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        {/* Interview Header */}
        <div className="bg-indigo-900 text-white p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">{interview.type} Interview</h1>
            <div className="flex items-center bg-indigo-800 rounded-full px-4 py-1">
              <Clock className="w-4 h-4 mr-2" />
              <span className={`font-mono ${timer < 30 ? 'text-red-300' : ''}`}>
                {formatTime(timer)}
              </span>
            </div>
          </div>
          <p className="mt-2 text-blue-100">Question {currentQuestion + 1} of {questions.length}</p>
        </div>
        
        {/* Interview Content */}
        <div className="p-6">
          {/* AI Interviewer */}
          <div className="mb-6">
            <div className="flex items-start mb-2">
              <div className="bg-indigo-100 rounded-full p-2 mr-3">
                <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center text-white font-bold">
                  AI
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 relative max-w-3xl">
                {isTyping ? (
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce\" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '100ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  </div>
                ) : (
                  <p>{questions[currentQuestion]}</p>
                )}
                <div className="absolute w-4 h-4 bg-gray-100 transform rotate-45 left-[-8px] top-4"></div>
              </div>
            </div>
          </div>
          
          {/* User Response */}
          <div className="mb-6">
            <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-2">
              Your Response
            </label>
            <div className="relative">
              <textarea
                id="response"
                rows={6}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm resize-none"
                placeholder="Type your answer here..."
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                disabled={showFeedback}
              ></textarea>
              <div className="absolute right-2 bottom-2 flex space-x-2">
                <button
                  onClick={toggleRecording}
                  className={`p-2 rounded-full ${
                    isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                  } hover:bg-gray-200 transition-colors`}
                  title={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Feedback section */}
          {showFeedback && feedback && (
            <div className="mb-6 border rounded-lg p-4 bg-green-50 border-green-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Feedback</h3>
              <p className="text-gray-800">{feedback}</p>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              End Interview
            </button>
            
            {!showFeedback ? (
              <button
                onClick={handleSubmitResponse}
                disabled={userResponse.trim() === '' || isTyping}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                  userResponse.trim() === '' || isTyping
                    ? 'bg-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-900 hover:bg-indigo-800'
                }`}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Response
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Next Question
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Tips */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Interview Tips</h2>
        <ul className="space-y-2">
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-green-500">
              <Check className="h-5 w-5" />
            </div>
            <p className="ml-2 text-gray-600">Use the STAR method (Situation, Task, Action, Result) for behavioral questions.</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-green-500">
              <Check className="h-5 w-5" />
            </div>
            <p className="ml-2 text-gray-600">Speak clearly and maintain a moderate pace.</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-green-500">
              <Check className="h-5 w-5" />
            </div>
            <p className="ml-2 text-gray-600">Use specific examples from your experience to support your answers.</p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-green-500">
              <Check className="h-5 w-5" />
            </div>
            <p className="ml-2 text-gray-600">Take a moment to collect your thoughts before answering complex questions.</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InterviewSession;