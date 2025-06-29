import React from 'react';
import { useData } from '../../contexts/DataContext';
import { BookOpen, Calendar, Users, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

export function AdminDashboard() {
  const { courses, timeSlots, timingRequests } = useData();
  
  const totalCourses = courses.length;
  const totalTimeSlots = timeSlots.length;
  const pendingRequests = timingRequests.filter(r => r.status === 'pending').length;
  const totalEnrollment = courses.reduce((sum, course) => sum + course.enrolled, 0);
  
  const stats = [
    {
      name: 'Total Courses',
      value: totalCourses,
      icon: BookOpen,
      color: 'bg-primary-500',
      change: '+2 this week'
    },
    {
      name: 'Time Slots',
      value: totalTimeSlots,
      icon: Calendar,
      color: 'bg-secondary-500',
      change: '+5 this week'
    },
    {
      name: 'Total Enrollment',
      value: totalEnrollment,
      icon: Users,
      color: 'bg-success-500',
      change: '+12 this week'
    },
    {
      name: 'Pending Requests',
      value: pendingRequests,
      icon: Clock,
      color: 'bg-warning-500',
      change: '2 urgent'
    }
  ];

  const recentRequests = timingRequests
    .filter(r => r.status === 'pending')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of time table management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Courses</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {courses.slice(0, 5).map((course) => (
                <div key={course.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{course.name}</p>
                    <p className="text-sm text-gray-500">{course.code} - {course.professor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {course.enrolled}/{course.capacity}
                    </p>
                    <p className="text-xs text-gray-500">Enrolled</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Pending Requests</h3>
              {pendingRequests > 0 && (
                <span className="bg-warning-100 text-warning-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {pendingRequests} pending
                </span>
              )}
            </div>
          </div>
          <div className="p-6">
            {recentRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending requests</p>
            ) : (
              <div className="space-y-4">
                {recentRequests.map((request) => {
                  const course = courses.find(c => c.id === request.courseId);
                  return (
                    <div key={request.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-warning-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {course?.name}
                        </p>
                        <p className="text-sm text-gray-500">{request.reason}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {request.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
              <BookOpen className="h-8 w-8 text-primary-600 mb-2" />
              <h4 className="font-medium text-gray-900">Add New Course</h4>
              <p className="text-sm text-gray-500">Create a new course offering</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-secondary-300 hover:bg-secondary-50 text-left transition-colors">
              <Calendar className="h-8 w-8 text-secondary-600 mb-2" />
              <h4 className="font-medium text-gray-900">Design Time Table</h4>
              <p className="text-sm text-gray-500">Create or modify schedules</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-warning-300 hover:bg-warning-50 text-left transition-colors">
              <TrendingUp className="h-8 w-8 text-warning-600 mb-2" />
              <h4 className="font-medium text-gray-900">View Analytics</h4>
              <p className="text-sm text-gray-500">Check system performance</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}