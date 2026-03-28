export interface Entry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  date: string; // "YYYY-MM-DD"
  created_at: string; // ISO 8601
}

export interface User {
  id: string;
  email: string;
}
