import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { BookOpen, Users, Award, Clock, MapPin, Calendar } from 'lucide-react';

export function ProfessorCourses() {
  const { user } = useAuth();
  const { courses, timeSlots } = useData();

  // Get professor's courses
  const professorCourses = courses.filter(course => course.professorId === user?.id);

  const getCourseSchedule = (courseId: string) => {
    return timeSlots.filter(slot => slot.courseId === courseId);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'bg-blue-100 text-blue-800';
      case 'lab':
        return 'bg-green-100 text-green-800';
      case 'tutorial':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnrollmentPercentage = (enrolled: number, capacity: number) => {
    return Math.round((enrolled / capacity) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600">Courses you are teaching this semester</p>
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-primary-500 rounded-lg p-3">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
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
              <p className="text-2xl font-bold text-gray-900">
                {professorCourses.reduce((sum, course) => sum + course.enrolled, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-accent-500 rounded-lg p-3">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900">
                {professorCourses.reduce((sum, course) => sum + course.credits, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-warning-500 rounded-lg p-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Weekly Hours</p>
              <p className="text-2xl font-bold text-gray-900">
                {timeSlots.filter(slot => 
                  professorCourses.some(course => course.id === slot.courseId)
                ).length * 1.5}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-6">
        {professorCourses.map((course) => {
          const courseSchedule = getCourseSchedule(course.id);
          const enrollmentPercentage = getEnrollmentPercentage(course.enrolled, course.capacity);
          
          return (
            <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary-100 rounded-lg p-3">
                        <BookOpen className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {course.name}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900 mr-2">Course Code:</span>
                            <span className="bg-gray-100 px-2 py-1 rounded font-mono">
                              {course.code}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="font-medium text-gray-900 mr-1">Credits:</span>
                            <span>{course.credits}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900 mr-2">Department:</span>
                            <span>{course.department}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900 mr-2">Semester:</span>
                            <span>{course.semester}</span>
                          </div>
                        </div>
                        
                        {course.description && (
                          <p className="mt-3 text-gray-600">{course.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enrollment Progress */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium text-gray-900">Class Strength</h4>
                    <span className="text-sm text-gray-600">
                      {course.enrolled} / {course.capacity} students
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        enrollmentPercentage >= 90 ? 'bg-error-500' :
                        enrollmentPercentage >= 75 ? 'bg-warning-500' :
                        'bg-success-500'
                      }`}
                      style={{ width: `${enrollmentPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0</span>
                    <span className="font-medium">{enrollmentPercentage}% filled</span>
                    <span>{course.capacity}</span>
                  </div>
                </div>

                {/* Course Schedule */}
                {courseSchedule.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Class Schedule
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {courseSchedule.map((slot) => (
                        <div key={slot.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{slot.day}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(slot.type)}`}>
                              {slot.type.charAt(0).toUpperCase() + slot.type.slice(1)}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-400" />
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              {slot.room}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {professorCourses.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Assigned</h3>
          <p className="text-gray-600">
            You don't have any courses assigned for this semester yet.
          </p>
        </div>
      )}
    </div>
  );
}