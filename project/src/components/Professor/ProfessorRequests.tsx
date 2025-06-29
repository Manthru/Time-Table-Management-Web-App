import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Clock, Calendar, MapPin, Plus, Send, AlertCircle, CheckCircle, X } from 'lucide-react';

export function ProfessorRequests() {
  const { user } = useAuth();
  const { courses, timeSlots, timingRequests, addTimingRequest } = useData();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [newSlotData, setNewSlotData] = useState({
    day: '',
    startTime: '',
    endTime: '',
    room: '',
    type: 'lecture' as 'lecture' | 'lab' | 'tutorial'
  });
  const [reason, setReason] = useState('');

  // Get professor's courses and requests
  const professorCourses = courses.filter(course => course.professorId === user?.id);
  const professorRequests = timingRequests.filter(request => request.professorId === user?.id);

  const getCourseTimeSlots = (courseId: string) => {
    return timeSlots.filter(slot => slot.courseId === courseId);
  };

  const handleSubmitRequest = () => {
    if (!selectedCourse || !selectedSlot || !reason.trim()) return;

    const currentSlot = timeSlots.find(slot => slot.id === selectedSlot);
    if (!currentSlot) return;

    const request = {
      professorId: user?.id || '',
      courseId: selectedCourse,
      currentSlot,
      proposedSlot: {
        day: newSlotData.day,
        startTime: newSlotData.startTime,
        endTime: newSlotData.endTime,
        room: newSlotData.room,
        type: newSlotData.type
      },
      reason,
      status: 'pending' as const
    };

    addTimingRequest(request);
    
    // Reset form
    setSelectedCourse('');
    setSelectedSlot('');
    setNewSlotData({
      day: '',
      startTime: '',
      endTime: '',
      room: '',
      type: 'lecture'
    });
    setReason('');
    setShowCreateForm(false);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'approved':
        return 'bg-success-100 text-success-800';
      case 'rejected':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Change Requests</h1>
          <p className="text-gray-600">Request schedule modifications and track their status</p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="mt-4 sm:mt-0 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </button>
      </div>

      {/* Create Request Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Create Change Request</h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedSlot('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Choose a course...</option>
                {professorCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Current Time Slot Selection */}
            {selectedCourse && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Time Slot to Change
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choose current slot...</option>
                  {getCourseTimeSlots(selectedCourse).map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.day} {formatTime(slot.startTime)} - {formatTime(slot.endTime)} ({slot.room})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* New Time Slot Details */}
            {selectedSlot && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Day
                  </label>
                  <select
                    value={newSlotData.day}
                    onChange={(e) => setNewSlotData(prev => ({ ...prev, day: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select day...</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Type
                  </label>
                  <select
                    value={newSlotData.type}
                    onChange={(e) => setNewSlotData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="lecture">Lecture</option>
                    <option value="lab">Lab</option>
                    <option value="tutorial">Tutorial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newSlotData.startTime}
                    onChange={(e) => setNewSlotData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newSlotData.endTime}
                    onChange={(e) => setNewSlotData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room
                  </label>
                  <input
                    type="text"
                    value={newSlotData.room}
                    onChange={(e) => setNewSlotData(prev => ({ ...prev, room: e.target.value }))}
                    placeholder="e.g., CR-101, Lab-201"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Change
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Please explain why you need this schedule change..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                disabled={!selectedCourse || !selectedSlot || !reason.trim() || !newSlotData.day || !newSlotData.startTime || !newSlotData.endTime || !newSlotData.room}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {professorRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Requests Yet</h3>
            <p className="text-gray-600">
              You haven't submitted any schedule change requests. Click "New Request" to get started.
            </p>
          </div>
        ) : (
          professorRequests.map((request) => {
            const course = courses.find(c => c.id === request.courseId);
            
            return (
              <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-medium text-gray-900">{course?.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status}</span>
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{request.reason}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Current Slot */}
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-medium text-red-900 mb-2">Current Schedule</h4>
                        <div className="space-y-1 text-sm text-red-700">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {request.currentSlot.day}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {formatTime(request.currentSlot.startTime)} - {formatTime(request.currentSlot.endTime)}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {request.currentSlot.room}
                          </div>
                        </div>
                      </div>
                      
                      {/* Proposed Slot */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-2">Proposed Schedule</h4>
                        <div className="space-y-1 text-sm text-green-700">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {request.proposedSlot.day}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {formatTime(request.proposedSlot.startTime)} - {formatTime(request.proposedSlot.endTime)}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {request.proposedSlot.room}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                  <span>Submitted on {request.createdAt.toLocaleDateString()}</span>
                  {request.reviewedAt && (
                    <span>
                      {request.status === 'approved' ? 'Approved' : 'Rejected'} on {request.reviewedAt.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}