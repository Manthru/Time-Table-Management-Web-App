import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MessageSquare, Clock, CheckCircle, Users, Calendar, MapPin } from 'lucide-react';

export function StudentPolls() {
  const { user } = useAuth();
  const { polls, courses, votePoll } = useData();
  const [votedPolls, setVotedPolls] = useState<Set<string>>(new Set());

  // Get active polls for student's courses
  const studentCourses = courses.filter(course => 
    course.department === user?.department && course.semester === user?.semester
  );
  
  const availablePolls = polls.filter(poll => 
    poll.isActive && studentCourses.some(course => course.id === poll.courseId)
  );

  const handleVote = (pollId: string, optionId: string) => {
    if (!user || votedPolls.has(pollId)) return;
    
    votePoll(pollId, optionId, user.id);
    setVotedPolls(prev => new Set([...prev, pollId]));
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

  const hasUserVoted = (poll: any) => {
    return poll.options.some((option: any) => option.voters.includes(user?.id || ''));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Professor Polls</h1>
        <p className="text-gray-600">Vote on proposed schedule changes and timing preferences</p>
      </div>

      {/* Active Polls Count */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="bg-primary-500 rounded-lg p-3">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Active Polls</p>
            <p className="text-2xl font-bold text-gray-900">{availablePolls.length}</p>
          </div>
        </div>
      </div>

      {/* Polls List */}
      <div className="space-y-6">
        {availablePolls.map((poll) => {
          const course = courses.find(c => c.id === poll.courseId);
          const totalVotes = getTotalVotes(poll);
          const userHasVoted = hasUserVoted(poll) || votedPolls.has(poll.id);
          const timeRemaining = Math.ceil((poll.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

          return (
            <div key={poll.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                {/* Poll Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{poll.title}</h3>
                      {userHasVoted && (
                        <span className="bg-success-100 text-success-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Voted
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{poll.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="font-medium text-primary-600">{course?.name}</span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {totalVotes} votes
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {timeRemaining > 0 ? `${timeRemaining} days left` : 'Expired'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Poll Options */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Choose your preferred time slot:</h4>
                  {poll.options.map((option) => {
                    const percentage = getVotePercentage(option, totalVotes);
                    const isSelected = option.voters.includes(user?.id || '');

                    return (
                      <div key={option.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
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
                          </div>
                          
                          {!userHasVoted && timeRemaining > 0 && (
                            <button
                              onClick={() => handleVote(poll.id, option.id)}
                              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
                            >
                              Vote
                            </button>
                          )}
                        </div>

                        {/* Vote Results */}
                        {(userHasVoted || timeRemaining <= 0) && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                {option.votes} votes ({percentage}%)
                              </span>
                              {isSelected && (
                                <span className="text-success-600 font-medium flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Your choice
                                </span>
                              )}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  isSelected ? 'bg-success-500' : 'bg-primary-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Poll Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Created on {poll.createdAt.toLocaleDateString()}
                    </span>
                    <span>
                      Ends on {poll.endDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {availablePolls.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Polls</h3>
          <p className="text-gray-600">
            There are currently no active polls from your professors. Check back later for new polls about schedule changes.
          </p>
        </div>
      )}
    </div>
  );
}