import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Calendar, BookOpen, Clock, MessageSquare, CheckCircle, Bell } from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuth();
  const { courses, timeSlots, polls, notifications } = useData();

  // Get student's courses
  const studentCourses = courses.filter(course => 
    course.department === user?.department && course.semester === user?.semester
  );

  const studentTimeSlots = timeSlots.filter(slot => 
    studentCourses.some(course => course.id === slot.courseId)
  );

  const activePolls = polls.filter(poll => 
    poll.isActive && studentCourses.some(course => course.id === poll.courseId)
  );
  
  const unreadNotifications = notifications.filter(n => 
    n.userId === user?.id && !n.read
  ).length;

  const today = new Date();
  const todaySlots = studentTimeSlots.filter(slot => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return slot.day === days[today.getDay()];
  });

  const upcomingSlots = todaySlots.filter(slot => {
    const now = new Date();
    const slotTime = new Date();
    const [hours, minutes] = slot.startTime.split(':');
    slotTime.setHours(parseInt(hours), parseInt(minutes));
    return slotTime > now;
  }).slice(0, 3);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">
          {user?.department} Department - Semester {user?.semester}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-primary-500 rounded-lg p-3">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
              <p className="text-2xl font-bold text-gray-900">{studentCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-secondary-500 rounded-lg p-3">
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
            <div className="bg-accent-500 rounded-lg p-3">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Polls</p>
              <p className="text-2xl font-bold text-gray-900">{activePolls.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-warning-500 rounded-lg p-3">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{unreadNotifications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule Section */}
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
              <p className="text-sm text-gray-400 mt-1">Enjoy your free day</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todaySlots.map((slot) => {
                const course = studentCourses.find(c => c.id === slot.courseId);
                const isPast = new Date() > new Date(`${today.toDateString()} ${slot.endTime}`);
                const isUpcoming = new Date() < new Date(`${today.toDateString()} ${slot.startTime}`);
                const isCurrent = !isPast && !isUpcoming;
                
                return (
                  <div 
                    key={slot.id} 
                    className={`p-4 border rounded-lg transition-all ${
                      isPast ? 'border-gray-200 bg-gray-50' : 
                      isCurrent ? 'border-success-300 bg-success-50 ring-2 ring-success-200' :
                      'border-primary-200 bg-primary-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{course?.name}</h4>
                        <p className="text-sm text-gray-600">{course?.code} - {course?.professor}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
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
                      {isCurrent && (
                        <span className="text-xs text-success-600 font-medium flex items-center">
                          <div className="w-2 h-2 bg-success-500 rounded-full mr-1 animate-pulse"></div>
                          In Progress
                        </span>
                      )}
                      {isPast && (
                        <span className="text-xs text-gray-500">Completed</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Next Classes</h3>
          </div>
          <div className="p-6">
            {upcomingSlots.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No more classes today</p>
            ) : (
              <div className="space-y-4">
                {upcomingSlots.map((slot) => {
                  const course = studentCourses.find(c => c.id === slot.courseId);
                  
                  return (
                    <div key={slot.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="bg-primary-100 rounded-lg p-2">
                          <Clock className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{course?.name}</h4>
                        <p className="text-sm text-gray-600">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)} | {slot.room}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Notifications</h3>
              {unreadNotifications > 0 && (
                <span className="bg-error-100 text-error-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {unreadNotifications} new
                </span>
              )}
            </div>
          </div>
          <div className="p-6">
            {notifications.filter(n => n.userId === user?.id).length === 0 ? (
              <p className="text-gray-500 text-center py-4">No notifications yet</p>
            ) : (
              <div className="space-y-4">
                {notifications
                  .filter(n => n.userId === user?.id)
                  .slice(0, 3)
                  .map((notification) => (
                    <div key={notification.id} className={`p-3 rounded-lg border ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {notification.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Polls Section */}
      {activePolls.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Active Professor Polls</h3>
            <p className="text-sm text-gray-500">Vote on proposed schedule changes</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePolls.slice(0, 4).map((poll) => {
                const course = courses.find(c => c.id === poll.courseId);
                return (
                  <div key={poll.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                    <h4 className="font-medium text-gray-900">{poll.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{course?.name}</p>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{poll.description}</p>
                    <div className="mt-3">
                      <span className="text-xs text-gray-500">
                        {poll.options.reduce((sum, opt) => sum + opt.votes, 0)} votes
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}