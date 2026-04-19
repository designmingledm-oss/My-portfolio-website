export interface Profile {
  name: string;
  bio: string;
  cvUrl?: string;
  heroImage?: string;
  email: string;
  linkedin?: string;
  github?: string;
}

export interface Research {
  id: string;
  title: string;
  description: string;
  content?: string;
  date: string;
  link?: string;
  coverImage?: string;
  gallery?: string[];
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  date: string;
  slug: string;
  coverImage?: string;
  gallery?: string[];
}

export interface Hobby {
  id: string;
  name: string;
  icon?: string;
}

export interface TickerImage {
  id: string;
  url: string;
  alt?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: any;
}
