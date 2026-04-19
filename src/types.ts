export interface Profile {
  name: string;
  bio: string;
  cvUrl?: string;
  email: string;
  linkedin?: string;
  github?: string;
}

export interface Research {
  id: string;
  title: string;
  description: string;
  date: string;
  link?: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  date: string;
  slug: string;
}

export interface Hobby {
  id: string;
  name: string;
  icon?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: any;
}
