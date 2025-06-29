import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { BookOpen, Calendar, Users, MessageSquare, Clock, CheckCircle } from 'lucide-react';

export function ProfessorDashboard() {
  const { user } = useAuth();
  const { courses, timeSlots, timingRequests, polls } = useData();

  // Get professor's courses
  const professorCourses = courses.filter(course => course.professorId === user?.id);
  const professorTimeSlots = timeSlots.filter(slot => 
    professorCourses.some(course => course.id === slot.courseId)
  );

  const myRequests = timingRequests.filter(request => request.professorId === user?.id);
  const myPolls = polls.filter(poll => poll.professorId === user?.id);

  const today = new Date();
  const todaySlots = professorTimeSlots.filter(slot => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return slot.day === days[today.getDay()];
  });

  const totalStudents = professorCourses.reduce((sum, course) => sum + course.enrolled, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
        <p className="text-gray-600">{user?.department} Department</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-primary-500 rounded-lg p-3">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Courses</p>
              <p className="text-2xl font-bold text-gray-900">{professorCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-secondary-500 rounded-lg p-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-accent-500 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Classes</p>
              <p className="text-2xl font-bold text-gray-900">{todaySlots.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-warning-500 rounded-lg p-3">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Polls</p>
              <p className="text-2xl font-bold text-gray-900">{myPolls.filter(p => p.isActive).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Today's Schedule</h3>
            <p className="text-sm text-gray-500">
              {today.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="p-6">
            {todaySlots.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-success-500 mx-auto mb-4" />
                <p className="text-gray-500">No classes scheduled today!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaySlots.map((slot) => {
                  const course = professorCourses.find(c => c.id === slot.courseId);
                  const isPast = new Date() > new Date(`${today.toDateString()} ${slot.endTime}`);
                  
                  return (
                    <div 
                      key={slot.id} 
                      className={`p-4 border rounded-lg ${
                        isPast ? 'border-gray-200 bg-gray-50' : 'border-primary-200 bg-primary-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{course?.name}</h4>
                          <p className="text-sm text-gray-600">{course?.code}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {slot.startTime} - {slot.endTime}
                          </p>
                          <p className="text-sm text-gray-600">{slot.room}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          slot.type === 'lecture' ? 'bg-blue-100 text-blue-800' :
                          slot.type === 'lab' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {slot.type.charAt(0).toUpperCase() + slot.type.slice(1)}
                        </span>
                        <p className="text-sm text-gray-500">
                          {course?.enrolled} students
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* My Courses */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">My Courses</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {professorCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{course.name}</h4>
                    <p className="text-sm text-gray-600">{course.code} - {course.credits} credits</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {course.enrolled}/{course.capacity}
                    </p>
                    <p className="text-sm text-gray-500">Students</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Request Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Change Requests</h3>
        </div>
        <div className="p-6">
          {myRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No requests submitted</p>
          ) : (
            <div className="space-y-4">
              {myRequests.slice(0, 5).map((request) => {
                const course = courses.find(c => c.id === request.courseId);
                return (
                  <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{course?.name}</h4>
                      <p className="text-sm text-gray-600">{request.reason}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Submitted on {request.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                        request.status === 'approved' ? 'bg-success-100 text-success-800' :
                        'bg-error-100 text-error-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 text-left transition-colors">
              <Clock className="h-8 w-8 text-primary-600 mb-2" />
              <h4 className="font-medium text-gray-900">Request Time Change</h4>
              <p className="text-sm text-gray-500">Submit schedule modification request</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-secondary-300 hover:bg-secondary-50 text-left transition-colors">
              <MessageSquare className="h-8 w-8 text-secondary-600 mb-2" />
              <h4 className="font-medium text-gray-900">Create Poll</h4>
              <p className="text-sm text-gray-500">Get student input on timing</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-accent-300 hover:bg-accent-50 text-left transition-colors">
              <Users className="h-8 w-8 text-accent-600 mb-2" />
              <h4 className="font-medium text-gray-900">View Students</h4>
              <p className="text-sm text-gray-500">Manage course enrollment</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}