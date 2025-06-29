import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Clock, CheckCircle, X, Calendar, MapPin, AlertTriangle } from 'lucide-react';

export function AdminRequests() {
  const { timingRequests, courses, updateTimingRequest, addNotification } = useData();

  const handleApproveRequest = (requestId: string) => {
    const request = timingRequests.find(r => r.id === requestId);
    if (!request) return;

    updateTimingRequest(requestId, 'approved', 'admin');
    
    // Send notification to all students in the course
    const course = courses.find(c => c.id === request.courseId);
    if (course) {
      // In a real app, you'd get all students enrolled in this course
      // For demo, we'll send to the student user (id: '2')
      addNotification({
        userId: '2',
        title: 'Schedule Change Approved',
        message: `The schedule for ${course.name} (${course.code}) has been updated. New timing: ${request.proposedSlot.day} ${formatTime(request.proposedSlot.startTime)} - ${formatTime(request.proposedSlot.endTime)} in ${request.proposedSlot.room}.`,
        type: 'warning'
      });
    }
  };

  const handleRejectRequest = (requestId: string) => {
    const request = timingRequests.find(r => r.id === requestId);
    if (!request) return;

    updateTimingRequest(requestId, 'rejected', 'admin');
    
    // Send notification to professor
    addNotification({
      userId: request.professorId,
      title: 'Schedule Change Request Rejected',
      message: `Your request to change the schedule for ${courses.find(c => c.id === request.courseId)?.name} has been rejected. Please contact the administration for more details.`,
      type: 'error'
    });
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
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const pendingRequests = timingRequests.filter(r => r.status === 'pending');
  const processedRequests = timingRequests.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Change Requests</h1>
        <p className="text-gray-600">Review and approve schedule change requests from professors</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-warning-500 rounded-lg p-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-success-500 rounded-lg p-3">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {timingRequests.filter(r => r.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-error-500 rounded-lg p-3">
              <X className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {timingRequests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 text-warning-500 mr-2" />
              Pending Approval ({pendingRequests.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {pendingRequests.map((request) => {
              const course = courses.find(c => c.id === request.courseId);
              
              return (
                <div key={request.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-lg font-medium text-gray-900">{course?.name}</h4>
                        <span className="text-sm text-gray-500">({course?.code})</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{request.reason}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Current Slot */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <h5 className="font-medium text-red-900 mb-2">Current Schedule</h5>
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
                            <div className="text-xs mt-2 bg-red-100 px-2 py-1 rounded">
                              {request.currentSlot.type.charAt(0).toUpperCase() + request.currentSlot.type.slice(1)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Proposed Slot */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h5 className="font-medium text-green-900 mb-2">Proposed Schedule</h5>
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
                            <div className="text-xs mt-2 bg-green-100 px-2 py-1 rounded">
                              {request.proposedSlot.type.charAt(0).toUpperCase() + request.proposedSlot.type.slice(1)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span>Submitted on {request.createdAt.toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>Professor: {course?.professor}</span>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="px-4 py-2 bg-error-600 text-white rounded-md hover:bg-error-700 transition-colors flex items-center"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveRequest(request.id)}
                        className="px-4 py-2 bg-success-600 text-white rounded-md hover:bg-success-700 transition-colors flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Decisions</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {processedRequests.slice(0, 5).map((request) => {
              const course = courses.find(c => c.id === request.courseId);
              
              return (
                <div key={request.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{course?.name}</h4>
                        <span className="text-sm text-gray-500">({course?.code})</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{request.reason}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>Decided on {request.reviewedAt?.toLocaleDateString()}</div>
                      <div>Submitted {request.createdAt.toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {timingRequests.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Change Requests</h3>
          <p className="text-gray-600">
            No schedule change requests have been submitted yet.
          </p>
        </div>
      )}
    </div>
  );
}