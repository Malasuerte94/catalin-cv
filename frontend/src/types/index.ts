export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  tags: string[];
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  isCurrent: boolean;
  tags: string[];
}

export interface ContactUrl {
  id: number;
  platform: string;
  url: string;
  icon?: string;
}
