import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, TimeSlot, Notification, TimingChangeRequest, Poll, Room } from '../types';

interface DataContextType {
  courses: Course[];
  timeSlots: TimeSlot[];
  notifications: Notification[];
  timingRequests: TimingChangeRequest[];
  polls: Poll[];
  rooms: Room[];
  
  // Course management
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  
  // Time slot management
  addTimeSlot: (slot: Omit<TimeSlot, 'id'>) => void;
  updateTimeSlot: (id: string, slot: Partial<TimeSlot>) => void;
  deleteTimeSlot: (id: string) => void;
  
  // Notification management
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  
  // Timing change requests
  addTimingRequest: (request: Omit<TimingChangeRequest, 'id'>) => void;
  updateTimingRequest: (id: string, status: 'approved' | 'rejected', reviewedBy: string) => void;
  
  // Poll management
  addPoll: (poll: Omit<Poll, 'id'>) => void;
  votePoll: (pollId: string, optionId: string, userId: string) => void;
  
  // Real-time updates
  triggerUpdate: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data - Enhanced with more courses for professors
const mockCourses: Course[] = [
  // Computer Science Courses
  {
    id: '1',
    name: 'Database Management Systems',
    code: 'CS301',
    professor: 'Dr. Priya Singh',
    professorId: '3',
    credits: 4,
    department: 'Computer Science',
    semester: 6,
    capacity: 80,
    enrolled: 65,
    description: 'Introduction to database concepts, SQL, and database design principles.'
  },
  {
    id: '2',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    professor: 'Dr. Amit Gupta',
    professorId: '4',
    credits: 4,
    department: 'Computer Science',
    semester: 4,
    capacity: 90,
    enrolled: 78,
    description: 'Fundamental data structures and algorithmic techniques for problem solving.'
  },
  {
    id: '3',
    name: 'Operating Systems',
    code: 'CS302',
    professor: 'Dr. Rajesh Kumar',
    professorId: '5',
    credits: 3,
    department: 'Computer Science',
    semester: 6,
    capacity: 75,
    enrolled: 68,
    description: 'Study of operating system concepts including processes, memory management, and file systems.'
  },
  {
    id: '4',
    name: 'Computer Networks',
    code: 'CS401',
    professor: 'Dr. Neha Sharma',
    professorId: '6',
    credits: 3,
    department: 'Computer Science',
    semester: 6,
    capacity: 70,
    enrolled: 62,
    description: 'Network protocols, architecture, and distributed systems fundamentals.'
  },
  // Additional courses for the demo professor (id: '3')
  {
    id: '5',
    name: 'Software Engineering',
    code: 'CS303',
    professor: 'Dr. Priya Singh',
    professorId: '3',
    credits: 3,
    department: 'Computer Science',
    semester: 6,
    capacity: 60,
    enrolled: 52,
    description: 'Software development lifecycle, project management, and quality assurance.'
  },
  {
    id: '6',
    name: 'Machine Learning',
    code: 'CS501',
    professor: 'Dr. Priya Singh',
    professorId: '3',
    credits: 4,
    department: 'Computer Science',
    semester: 8,
    capacity: 50,
    enrolled: 45,
    description: 'Introduction to machine learning algorithms, neural networks, and AI applications.'
  },
  {
    id: '7',
    name: 'Web Technologies',
    code: 'CS304',
    professor: 'Dr. Priya Singh',
    professorId: '3',
    credits: 3,
    department: 'Computer Science',
    semester: 6,
    capacity: 65,
    enrolled: 58,
    description: 'Modern web development technologies including HTML5, CSS3, JavaScript, and frameworks.'
  }
];

const mockTimeSlots: TimeSlot[] = [
  // Database Management Systems
  {
    id: '1',
    courseId: '1',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    room: 'CR-102',
    type: 'lecture'
  },
  {
    id: '2',
    courseId: '1',
    day: 'Wednesday',
    startTime: '11:00',
    endTime: '12:30',
    room: 'CR-102',
    type: 'lecture'
  },
  {
    id: '3',
    courseId: '1',
    day: 'Friday',
    startTime: '14:00',
    endTime: '17:00',
    room: 'Lab-201',
    type: 'lab'
  },
  
  // Data Structures and Algorithms
  {
    id: '4',
    courseId: '2',
    day: 'Tuesday',
    startTime: '10:00',
    endTime: '11:30',
    room: 'CR-103',
    type: 'lecture'
  },
  {
    id: '5',
    courseId: '2',
    day: 'Thursday',
    startTime: '10:00',
    endTime: '11:30',
    room: 'CR-103',
    type: 'lecture'
  },
  
  // Operating Systems
  {
    id: '6',
    courseId: '3',
    day: 'Monday',
    startTime: '14:00',
    endTime: '15:30',
    room: 'CR-101',
    type: 'lecture'
  },
  {
    id: '7',
    courseId: '3',
    day: 'Wednesday',
    startTime: '14:00',
    endTime: '15:30',
    room: 'CR-101',
    type: 'lecture'
  },
  
  // Computer Networks
  {
    id: '8',
    courseId: '4',
    day: 'Tuesday',
    startTime: '15:00',
    endTime: '16:30',
    room: 'CR-104',
    type: 'lecture'
  },
  {
    id: '9',
    courseId: '4',
    day: 'Friday',
    startTime: '10:00',
    endTime: '11:30',
    room: 'CR-104',
    type: 'lecture'
  },

  // Software Engineering (Dr. Priya Singh)
  {
    id: '10',
    courseId: '5',
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '10:30',
    room: 'CR-105',
    type: 'lecture'
  },
  {
    id: '11',
    courseId: '5',
    day: 'Thursday',
    startTime: '14:00',
    endTime: '15:30',
    room: 'CR-105',
    type: 'lecture'
  },
  {
    id: '12',
    courseId: '5',
    day: 'Saturday',
    startTime: '10:00',
    endTime: '13:00',
    room: 'Lab-301',
    type: 'lab'
  },

  // Machine Learning (Dr. Priya Singh)
  {
    id: '13',
    courseId: '6',
    day: 'Monday',
    startTime: '11:00',
    endTime: '12:30',
    room: 'CR-106',
    type: 'lecture'
  },
  {
    id: '14',
    courseId: '6',
    day: 'Wednesday',
    startTime: '09:00',
    endTime: '10:30',
    room: 'CR-106',
    type: 'lecture'
  },
  {
    id: '15',
    courseId: '6',
    day: 'Friday',
    startTime: '11:00',
    endTime: '14:00',
    room: 'Lab-302',
    type: 'lab'
  },

  // Web Technologies (Dr. Priya Singh)
  {
    id: '16',
    courseId: '7',
    day: 'Tuesday',
    startTime: '11:30',
    endTime: '13:00',
    room: 'CR-107',
    type: 'lecture'
  },
  {
    id: '17',
    courseId: '7',
    day: 'Thursday',
    startTime: '11:30',
    endTime: '13:00',
    room: 'CR-107',
    type: 'lecture'
  },
  {
    id: '18',
    courseId: '7',
    day: 'Saturday',
    startTime: '14:00',
    endTime: '17:00',
    room: 'Lab-303',
    type: 'lab'
  }
];

const mockRooms: Room[] = [
  {
    id: '1',
    name: 'CR-101',
    capacity: 100,
    type: 'classroom',
    building: 'Academic Block A',
    floor: 1,
    equipment: ['Projector', 'Whiteboard', 'AC']
  },
  {
    id: '2',
    name: 'CR-102',
    capacity: 80,
    type: 'classroom',
    building: 'Academic Block A',
    floor: 1,
    equipment: ['Projector', 'Whiteboard', 'AC']
  },
  {
    id: '3',
    name: 'Lab-201',
    capacity: 40,
    type: 'lab',
    building: 'Academic Block B',
    floor: 2,
    equipment: ['Computers', 'Projector', 'AC']
  },
  {
    id: '4',
    name: 'CR-105',
    capacity: 70,
    type: 'classroom',
    building: 'Academic Block A',
    floor: 1,
    equipment: ['Projector', 'Whiteboard', 'AC', 'Smart Board']
  },
  {
    id: '5',
    name: 'Lab-301',
    capacity: 35,
    type: 'lab',
    building: 'Academic Block B',
    floor: 3,
    equipment: ['Computers', 'Projector', 'AC', 'Software Tools']
  }
];

// Mock notifications for students
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '2',
    title: 'Schedule Change: Database Management Systems',
    message: 'CS301 lecture on Monday has been moved from 09:00 AM to 10:00 AM in room CR-105. Please update your schedule accordingly.',
    type: 'warning',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: '2',
    userId: '2',
    title: 'Class Cancelled: Operating Systems',
    message: 'CS302 lecture scheduled for today at 2:00 PM has been cancelled due to professor unavailability. Make-up class will be scheduled soon.',
    type: 'error',
    read: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
  },
  {
    id: '3',
    userId: '2',
    title: 'Extra Class: Data Structures and Algorithms',
    message: 'An additional tutorial session for CS201 has been scheduled for Saturday 10:00 AM - 12:00 PM in CR-103 to cover advanced topics.',
    type: 'info',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: '4',
    userId: '2',
    title: 'Assignment Deadline Extended',
    message: 'The deadline for CS301 Database Design assignment has been extended to next Friday. Submit your work through the course portal.',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000) // 2 days ago
  }
];

// Mock timing change requests - Enhanced with more realistic data
const mockTimingRequests: TimingChangeRequest[] = [
  {
    id: '1',
    professorId: '3',
    courseId: '1',
    currentSlot: {
      id: '1',
      courseId: '1',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
      room: 'CR-102',
      type: 'lecture'
    },
    proposedSlot: {
      day: 'Monday',
      startTime: '10:00',
      endTime: '11:30',
      room: 'CR-105',
      type: 'lecture'
    },
    reason: 'Room CR-102 has technical issues with the projector. CR-105 has better facilities and can accommodate more students comfortably.',
    status: 'pending',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
  },
  {
    id: '2',
    professorId: '3',
    courseId: '5',
    currentSlot: {
      id: '12',
      courseId: '5',
      day: 'Saturday',
      startTime: '10:00',
      endTime: '13:00',
      room: 'Lab-301',
      type: 'lab'
    },
    proposedSlot: {
      day: 'Friday',
      startTime: '15:00',
      endTime: '18:00',
      room: 'Lab-301',
      type: 'lab'
    },
    reason: 'Many students have requested to move the Saturday lab session to Friday evening to avoid weekend classes. This will improve attendance and student satisfaction.',
    status: 'approved',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    reviewedBy: 'admin'
  },
  {
    id: '3',
    professorId: '3',
    courseId: '6',
    currentSlot: {
      id: '15',
      courseId: '6',
      day: 'Friday',
      startTime: '11:00',
      endTime: '14:00',
      room: 'Lab-302',
      type: 'lab'
    },
    proposedSlot: {
      day: 'Thursday',
      startTime: '15:30',
      endTime: '18:30',
      room: 'Lab-302',
      type: 'lab'
    },
    reason: 'Conflict with another course lab session. Moving to Thursday will provide better resource allocation and avoid scheduling conflicts.',
    status: 'rejected',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    reviewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    reviewedBy: 'admin'
  },
  {
    id: '4',
    professorId: '3',
    courseId: '7',
    currentSlot: {
      id: '16',
      courseId: '7',
      day: 'Tuesday',
      startTime: '11:30',
      endTime: '13:00',
      room: 'CR-107',
      type: 'lecture'
    },
    proposedSlot: {
      day: 'Tuesday',
      startTime: '14:00',
      endTime: '15:30',
      room: 'CR-107',
      type: 'lecture'
    },
    reason: 'Students have lunch break at 12:30-13:30. Moving the class to 2:00 PM will ensure better attendance and student focus.',
    status: 'pending',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
  },
  {
    id: '5',
    professorId: '3',
    courseId: '1',
    currentSlot: {
      id: '3',
      courseId: '1',
      day: 'Friday',
      startTime: '14:00',
      endTime: '17:00',
      room: 'Lab-201',
      type: 'lab'
    },
    proposedSlot: {
      day: 'Friday',
      startTime: '09:00',
      endTime: '12:00',
      room: 'Lab-201',
      type: 'lab'
    },
    reason: 'Morning sessions are more productive for practical lab work. Students are more alert and focused in the morning hours.',
    status: 'approved',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    reviewedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    reviewedBy: 'admin'
  }
];

// Mock polls - Enhanced with more realistic data
const mockPolls: Poll[] = [
  {
    id: '1',
    professorId: '3',
    courseId: '1',
    title: 'Preferred Time for Extra Tutorial Session',
    description: 'I would like to schedule an additional tutorial session for Database Management Systems. Please vote for your preferred time slot.',
    options: [
      {
        id: '1',
        day: 'Saturday',
        startTime: '10:00',
        endTime: '12:00',
        room: 'CR-102',
        votes: 15,
        voters: ['student1', 'student2', 'student3']
      },
      {
        id: '2',
        day: 'Sunday',
        startTime: '14:00',
        endTime: '16:00',
        room: 'CR-102',
        votes: 8,
        voters: ['student4', 'student5']
      },
      {
        id: '3',
        day: 'Friday',
        startTime: '16:00',
        endTime: '18:00',
        room: 'CR-102',
        votes: 22,
        voters: ['student6', 'student7', 'student8', 'student9']
      }
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
  },
  {
    id: '2',
    professorId: '3',
    courseId: '5',
    title: 'Software Engineering Project Presentation Schedule',
    description: 'We need to schedule final project presentations for Software Engineering. Please choose your preferred time slot.',
    options: [
      {
        id: '4',
        day: 'Thursday',
        startTime: '14:00',
        endTime: '17:00',
        room: 'CR-105',
        votes: 18,
        voters: ['student10', 'student11', 'student12']
      },
      {
        id: '5',
        day: 'Friday',
        startTime: '09:00',
        endTime: '12:00',
        room: 'CR-105',
        votes: 25,
        voters: ['student13', 'student14', 'student15', 'student16']
      },
      {
        id: '6',
        day: 'Saturday',
        startTime: '10:00',
        endTime: '13:00',
        room: 'CR-105',
        votes: 12,
        voters: ['student17', 'student18']
      }
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
  },
  {
    id: '3',
    professorId: '3',
    courseId: '6',
    title: 'Machine Learning Lab Session Timing',
    description: 'Due to high demand, we are adding an extra ML lab session. Vote for the most convenient time.',
    options: [
      {
        id: '7',
        day: 'Wednesday',
        startTime: '15:00',
        endTime: '18:00',
        room: 'Lab-302',
        votes: 20,
        voters: ['student19', 'student20', 'student21']
      },
      {
        id: '8',
        day: 'Saturday',
        startTime: '09:00',
        endTime: '12:00',
        room: 'Lab-302',
        votes: 14,
        voters: ['student22', 'student23']
      }
    ],
    isActive: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // Ended 1 day ago
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(mockTimeSlots);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [timingRequests, setTimingRequests] = useState<TimingChangeRequest[]>(mockTimingRequests);
  const [polls, setPolls] = useState<Poll[]>(mockPolls);
  const [rooms] = useState<Room[]>(mockRooms);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Course management
  const addCourse = (course: Omit<Course, 'id'>) => {
    const newCourse = { ...course, id: Date.now().toString() };
    setCourses(prev => [...prev, newCourse]);
    triggerUpdate();
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, ...updates } : course
    ));
    triggerUpdate();
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
    setTimeSlots(prev => prev.filter(slot => slot.courseId !== id));
    triggerUpdate();
  };

  // Time slot management
  const addTimeSlot = (slot: Omit<TimeSlot, 'id'>) => {
    const newSlot = { ...slot, id: Date.now().toString() };
    setTimeSlots(prev => [...prev, newSlot]);
    triggerUpdate();
  };

  const updateTimeSlot = (id: string, updates: Partial<TimeSlot>) => {
    setTimeSlots(prev => prev.map(slot => 
      slot.id === id ? { ...slot, ...updates } : slot
    ));
    triggerUpdate();
  };

  const deleteTimeSlot = (id: string) => {
    setTimeSlots(prev => prev.filter(slot => slot.id !== id));
    triggerUpdate();
  };

  // Notification management
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification = { 
      ...notification, 
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // Timing change requests
  const addTimingRequest = (request: Omit<TimingChangeRequest, 'id'>) => {
    const newRequest = { 
      ...request, 
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setTimingRequests(prev => [...prev, newRequest]);
  };

  const updateTimingRequest = (id: string, status: 'approved' | 'rejected', reviewedBy: string) => {
    setTimingRequests(prev => prev.map(request => 
      request.id === id 
        ? { ...request, status, reviewedBy, reviewedAt: new Date() }
        : request
    ));
    
    if (status === 'approved') {
      const request = timingRequests.find(r => r.id === id);
      if (request) {
        updateTimeSlot(request.currentSlot.id, request.proposedSlot);
      }
    }
    triggerUpdate();
  };

  // Poll management
  const addPoll = (poll: Omit<Poll, 'id'>) => {
    const newPoll = { 
      ...poll, 
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setPolls(prev => [...prev, newPoll]);
  };

  const votePoll = (pollId: string, optionId: string, userId: string) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id !== pollId) return poll;
      
      // Remove user's previous vote from all options
      const updatedOptions = poll.options.map(option => ({
        ...option,
        votes: option.voters.includes(userId) ? option.votes - 1 : option.votes,
        voters: option.voters.filter(voter => voter !== userId)
      }));
      
      // Add vote to selected option
      return {
        ...poll,
        options: updatedOptions.map(option => {
          if (option.id !== optionId) return option;
          
          return {
            ...option,
            votes: option.votes + 1,
            voters: [...option.voters, userId]
          };
        })
      };
    }));
  };

  const triggerUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <DataContext.Provider value={{
      courses,
      timeSlots,
      notifications,
      timingRequests,
      polls,
      rooms,
      addCourse,
      updateCourse,
      deleteCourse,
      addTimeSlot,
      updateTimeSlot,
      deleteTimeSlot,
      addNotification,
      markNotificationRead,
      addTimingRequest,
      updateTimingRequest,
      addPoll,
      votePoll,
      triggerUpdate
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}