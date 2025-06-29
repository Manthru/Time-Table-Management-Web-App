import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MessageSquare, Plus, X, Calendar, Clock, MapPin, Users, BarChart3 } from 'lucide-react';

export function ProfessorPolls() {
  const { user } = useAuth();
  const { courses, polls, addPoll } = useData();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pollData, setPollData] = useState({
    courseId: '',
    title: '',
    description: '',
    endDate: '',
    options: [
      { day: '', startTime: '', endTime: '', room: '' },
      { day: '', startTime: '', endTime: '', room: '' }
    ]
  });

  // Get professor's courses and polls
  const professorCourses = courses.filter(course => course.professorId === user?.id);
  const professorPolls = polls.filter(poll => poll.professorId === user?.id);

  const addOption = () => {
    setPollData(prev => ({
      ...prev,
      options: [...prev.options, { day: '', startTime: '', endTime: '', room: '' }]
    }));
  };

  const removeOption = (index: number) => {
    if (pollData.options.length > 2) {
      setPollData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index: number, field: string, value: string) => {
    setPollData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const handleSubmitPoll = () => {
    if (!pollData.courseId || !pollData.title.trim() || !pollData.description.trim() || !pollData.endDate) {
      return;
    }

    const validOptions = pollData.options.filter(option => 
      option.day && option.startTime && option.endTime && option.room
    );

    if (validOptions.length < 2) {
      return;
    }

    const poll = {
      professorId: user?.id || '',
      courseId: pollData.courseId,
      title: pollData.title,
      description: pollData.description,
      options: validOptions.map((option, index) => ({
        id: `${Date.now()}-${index}`,
        day: option.day,
        startTime: option.startTime,
        endTime: option.endTime,
        room: option.room,
        votes: 0,
        voters: []
      })),
      isActive: true,
      endDate: new Date(pollData.endDate)
    };

    addPoll(poll);
    
    // Reset form
    setPollData({
      courseId: '',
      title: '',
      description: '',
      endDate: '',
      options: [
        { day: '', startTime: '', endTime: '', room: '' },
        { day: '', startTime: '', endTime: '', room: '' }
      ]
    });
    setShowCreateForm(false);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTotalVotes = (poll: any) => {
    return poll.options.reduce((sum: number, option: any) => sum + option.votes, 0);
  };

  const getVotePercentage = (option: any, totalVotes: number) => {
    return totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Polls</h1>
          <p className="text-gray-600">Create polls to get student input on schedule changes</p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="mt-4 sm:mt-0 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Poll
        </button>
      </div>

      {/* Create Poll Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Create New Poll</h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <select
                  value={pollData.courseId}
                  onChange={(e) => setPollData(prev => ({ ...prev, courseId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a course...</option>
                  {professorCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poll End Date
                </label>
                <input
                  type="date"
                  value={pollData.endDate}
                  onChange={(e) => setPollData(prev => ({ ...prev, endDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poll Title
              </label>
              <input
                type="text"
                value={pollData.title}
                onChange={(e) => setPollData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Preferred time for extra tutorial session"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={pollData.description}
                onChange={(e) => setPollData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Explain the purpose of this poll and what students are voting for..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Poll Options */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Time Slot Options
                </label>
                <button
                  onClick={addOption}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </button>
              </div>

              <div className="space-y-4">
                {pollData.options.map((option, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Option {index + 1}</h4>
                      {pollData.options.length > 2 && (
                        <button
                          onClick={() => removeOption(index)}
                          className="text-error-600 hover:text-error-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Day
                        </label>
                        <select
                          value={option.day}
                          onChange={(e) => updateOption(index, 'day', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
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
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={option.startTime}
                          onChange={(e) => updateOption(index, 'startTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={option.endTime}
                          onChange={(e) => updateOption(index, 'endTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Room
                        </label>
                        <input
                          type="text"
                          value={option.room}
                          onChange={(e) => updateOption(index, 'room', e.target.value)}
                          placeholder="e.g., CR-101"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                onClick={handleSubmitPoll}
                disabled={!pollData.courseId || !pollData.title.trim() || !pollData.description.trim() || !pollData.endDate}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Poll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Polls List */}
      <div className="space-y-6">
        {professorPolls.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Polls Created</h3>
            <p className="text-gray-600">
              You haven't created any polls yet. Click "Create Poll" to get student input on schedule changes.
            </p>
          </div>
        ) : (
          professorPolls.map((poll) => {
            const course = courses.find(c => c.id === poll.courseId);
            const totalVotes = getTotalVotes(poll);
            const timeRemaining = Math.ceil((poll.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div key={poll.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{poll.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        poll.isActive && timeRemaining > 0 ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {poll.isActive && timeRemaining > 0 ? 'Active' : 'Ended'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{poll.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="font-medium text-primary-600">{course?.name}</span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {totalVotes} total votes
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {timeRemaining > 0 ? `${timeRemaining} days left` : 'Ended'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Poll Results */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Results:</h4>
                  {poll.options.map((option) => {
                    const percentage = getVotePercentage(option, totalVotes);

                    return (
                      <div key={option.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <span className="font-medium text-gray-900">{option.day}</span>
                            <span className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatTime(option.startTime)} - {formatTime(option.endTime)}
                            </span>
                            <span className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-1" />
                              {option.room}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-gray-900">{option.votes} votes</span>
                            <span className="text-sm text-gray-500 ml-2">({percentage}%)</span>
                          </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                  <span>Created on {poll.createdAt.toLocaleDateString()}</span>
                  <span>Ends on {poll.endDate.toLocaleDateString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}