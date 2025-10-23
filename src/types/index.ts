export interface Profile {
  id: string;
  email: string;
  full_name: string;
  department: string | null;
  position: string | null;
  avatar_url: string | null;
  status: string | null;
  join_date: string | null;
  performance_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  from_user: string;
  to_user: string | null;
  subject: string;
  content: string;
  is_broadcast: boolean;
  read: boolean;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  assigned_to: string;
  assigned_by: string;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  scheduled_by: string;
  date: string;
  time: string;
  link: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  employee_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  created_at: string;
}

export interface Evaluation {
  id: string;
  employee_id: string;
  evaluator_id: string;
  satisfaction_score: number;
  meetings_held: number;
  training_applied: number;
  outcome_summary: string | null;
  evaluation_date: string;
  created_at: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  position: string;
  role: 'admin' | 'employee';
  joinDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  performanceScore: number;
}
