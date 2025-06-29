export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'professor';
  department?: string;
  semester?: number;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  professor: string;
  professorId: string;
  credits: number;
  department: string;
  semester: number;
  capacity: number;
  enrolled: number;
  description?: string;
}

export interface TimeSlot {
  id: string;
  courseId: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

export interface Schedule {
  id: string;
  studentId?: string;
  professorId?: string;
  courses: Course[];
  timeSlots: TimeSlot[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface TimingChangeRequest {
  id: string;
  professorId: string;
  courseId: string;
  currentSlot: TimeSlot;
  proposedSlot: Omit<TimeSlot, 'id' | 'courseId'>;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface Poll {
  id: string;
  professorId: string;
  courseId: string;
  title: string;
  description: string;
  options: PollOption[];
  isActive: boolean;
  createdAt: Date;
  endDate: Date;
}

export interface PollOption {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  votes: number;
  voters: string[];
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: 'classroom' | 'lab' | 'seminar' | 'auditorium';
  building: string;
  floor: number;
  equipment: string[];
}