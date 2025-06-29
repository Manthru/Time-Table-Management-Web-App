import React from 'react';
import { GraduationCap, Calendar, Users, BookOpen, BarChart3, Clock, Shield, Sparkles, Zap, Globe } from 'lucide-react';

interface LandingPageProps {
  setCurrentPage: (page: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">
                  IIT Indore
                </h1>
                <p className="text-sm text-gray-600">Timetable Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('login')}
                className="text-gray-700 hover:text-blue-600 font-medium transition duration-200"
              >
                Login
              </button>
              <button
                onClick={() => setCurrentPage('signup')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-3xl mx-4"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full px-6 py-2 mb-8 shadow-lg">
            <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Next-Generation Academic Management</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            IIT Indore
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              Timetable Portal
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            A comprehensive solution for managing academic schedules, course assignments, and 
            student-faculty interactions with modern design and powerful features.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              onClick={() => setCurrentPage('login')}
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105"
            >
              <span className="flex items-center justify-center">
                Access Portal
                <Zap className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-50 transition duration-300 backdrop-blur-sm">
              Learn More
            </button>
          </div>

          {/* Floating Elements */}
          <div className="relative">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -top-10 -right-32 w-60 h-60 bg-gradient-to-br from-gray-200/30 to-slate-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full px-6 py-2 mb-6">
              <Globe className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-700">Powerful Features</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Everything you need for
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                academic excellence
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your educational workflow with our comprehensive suite of tools designed for modern academic institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Smart Timetable Management",
                description: "Efficiently manage and view course schedules with an intuitive interface and real-time updates.",
                gradient: "from-blue-500 to-indigo-500"
              },
              {
                icon: Users,
                title: "Role-Based Access",
                description: "Separate dashboards for administrators, professors, and students with tailored experiences.",
                gradient: "from-indigo-500 to-blue-500"
              },
              {
                icon: BookOpen,
                title: "Course Management",
                description: "Add, edit, and organize courses with detailed information and enrollment tracking.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Create polls for time preferences and gather comprehensive student feedback.",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: Clock,
                title: "Change Requests",
                description: "Streamlined process for requesting and approving schedule changes with notifications.",
                gradient: "from-purple-500 to-indigo-500"
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description: "Built with enterprise-grade security and reliability for academic institutions.",
                gradient: "from-teal-500 to-blue-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl from-blue-200/30 to-indigo-200/30"></div>
                <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: "500+", label: "Courses Managed", icon: BookOpen },
              { number: "5000+", label: "Students", icon: Users },
              { number: "200+", label: "Faculty Members", icon: GraduationCap },
              { number: "15+", label: "Departments", icon: Globe }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <stat.icon className="w-8 h-8 mx-auto mb-4 text-white/80 group-hover:text-white transition-colors duration-300" />
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg text-white/90">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400"></div>
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to transform your
            <br />
            academic experience?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join thousands of students and faculty using our platform for efficient timetable management and academic excellence.
          </p>
          <button
            onClick={() => setCurrentPage('signup')}
            className="bg-white text-orange-600 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-50 transition duration-300 shadow-2xl transform hover:scale-105"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">IIT Indore Portal</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Streamlined timetable management system for students, professors, and administrators.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition duration-200 cursor-pointer">Help & Support</li>
                <li className="hover:text-white transition duration-200 cursor-pointer">User Guide</li>
                <li className="hover:text-white transition duration-200 cursor-pointer">Contact IT Helpdesk</li>
                <li className="hover:text-white transition duration-200 cursor-pointer">System Status</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
              <div className="text-gray-400 space-y-3">
                <p className="flex items-center">
                  <span className="mr-2">📧</span>
                  helpdesk@iiti.ac.in
                </p>
                <p>IIT Indore, Simrol, Indore - 453552</p>
                <p>Madhya Pradesh, India</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 Indian Institute of Technology Indore. All rights reserved.</p>
            <p className="text-gray-400 mt-4 md:mt-0 flex items-center">
              Made with <span className="text-red-500 mx-1">❤️</span> for IIT Indore
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;