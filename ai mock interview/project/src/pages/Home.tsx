import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Users, Clock, BarChart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Ace Your Next Interview with AI
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Practice with our AI-powered mock interviews and get real-time feedback to improve your interview skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/login" 
                  className="bg-transparent border border-white text-white font-medium py-3 px-6 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200 inline-flex items-center justify-center"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Our Platform</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<CheckCircle2 className="h-10 w-10 text-purple-600" />}
                title="Realistic Interviews"
                description="AI-powered questions tailored to your industry and experience level"
              />
              <FeatureCard 
                icon={<Users className="h-10 w-10 text-purple-600" />}
                title="Multiple Categories"
                description="Practice technical, behavioral, and industry-specific interviews"
              />
              <FeatureCard 
                icon={<Clock className="h-10 w-10 text-purple-600" />}
                title="Practice Anytime"
                description="24/7 access to interview practice from anywhere"
              />
              <FeatureCard 
                icon={<BarChart className="h-10 w-10 text-purple-600" />}
                title="Detailed Feedback"
                description="Get actionable insights to improve your performance"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-0 inset-y-0 ml-6 w-0.5 bg-gray-200 lg:ml-8"></div>
                <Step 
                  number="1"
                  title="Create an account"
                  description="Sign up and complete your profile to help us tailor your interview experience."
                />
                <Step 
                  number="2"
                  title="Select interview type"
                  description="Choose from technical, behavioral, or industry-specific interviews."
                />
                <Step 
                  number="3"
                  title="Practice with AI"
                  description="Answer questions from our AI interviewer and receive feedback in real-time."
                />
                <Step 
                  number="4"
                  title="Review and improve"
                  description="Analyze your performance and practice areas that need improvement."
                  isLast={true}
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-indigo-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to ace your next interview?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
              Join thousands of job seekers who have improved their interview skills with our platform.
            </p>
            <Link 
              to="/register" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center"
            >
              Start Practicing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

interface StepProps {
  number: string;
  title: string;
  description: string;
  isLast?: boolean;
}

const Step: React.FC<StepProps> = ({ number, title, description, isLast = false }) => {
  return (
    <div className="relative pl-16 pb-8 lg:pl-20">
      <div className="absolute left-0 top-0 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-900 text-white font-bold text-xl lg:w-16 lg:h-16">
        {number}
      </div>
      <div className={`pb-8 ${isLast ? '' : 'mb-8 border-b border-gray-200'}`}>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default Home;