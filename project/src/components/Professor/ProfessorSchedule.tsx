import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';

export function ProfessorSchedule() {
  const { user } = useAuth();
  const { courses, timeSlots } = useData();
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Get professor's courses
  const professorCourses = courses.filter(course => course.professorId === user?.id);
  const professorTimeSlots = timeSlots.filter(slot => 
    professorCourses.some(course => course.id === slot.courseId)
  );

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlotHours = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const getSlotForDayAndTime = (day: string, time: string) => {
    return professorTimeSlots.find(slot => {
      const slotStart = slot.startTime;
      const slotEnd = slot.endTime;
      return slot.day === day && slotStart <= time && time < slotEnd;
    });
  };

  const getCourseForSlot = (slot: any) => {
    return professorCourses.find(course => course.id === slot.courseId);
  };

  const getSlotColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'lab':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'tutorial':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Teaching Schedule</h1>
          <p className="text-gray-600">Your weekly class timetable</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'week'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'day'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Day View
            </button>
          </div>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <button
          onClick={() => {
            const newDate = new Date(currentWeek);
            newDate.setDate(newDate.getDate() - 7);
            setCurrentWeek(newDate);
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Week of {currentWeek.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </h3>
        </div>
        
        <button
          onClick={() => {
            const newDate = new Date(currentWeek);
            newDate.setDate(newDate.getDate() + 7);
            setCurrentWeek(newDate);
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Timetable Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  TIME
                </th>
                {days.map((day) => (
                  <th key={day} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeSlotHours.map((time) => (
                <tr key={time} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {formatTime(time)}
                    </div>
                  </td>
                  {days.map((day) => {
                    const slot = getSlotForDayAndTime(day, time);
                    const course = slot ? getCourseForSlot(slot) : null;
                    
                    return (
                      <td key={`${day}-${time}`} className="px-2 py-4 text-center">
                        {slot && course ? (
                          <div className={`rounded-lg border-2 p-3 ${getSlotColor(slot.type)} transition-all hover:shadow-md`}>
                            <div className="font-semibold text-sm mb-1">
                              {course.name}
                            </div>
                            <div className="text-xs opacity-80 mb-1">
                              {course.code}
                            </div>
                            <div className="flex items-center justify-center text-xs opacity-70 mb-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {slot.room}
                            </div>
                            <div className="flex items-center justify-center text-xs opacity-70 mb-1">
                              <User className="h-3 w-3 mr-1" />
                              {course.enrolled} students
                            </div>
                            <div className="text-xs mt-1 font-medium">
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm py-8">
                            Free
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Class Types</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Lecture</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Lab</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-100 border-2 border-purple-300 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Tutorial</span>
          </div>
        </div>
      </div>
    </div>
  );
}