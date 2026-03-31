export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  logoUrl?: string;
  projectUrl?: string;
  techType?: 'wordpress' | 'custom';
  gallery: string[];
  tags: string[];
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  companyLogo?: string;
  period: string;
  description: string;
  isCurrent: boolean;
  tags: string[];
  order?: number;
}

export interface ContactUrl {
  id: number;
  platform: string;
  url?: string;
  value?: string;
  iconUrl?: string;
}

export interface BackgroundKeyframe {
  id: number;
  sectionId: string;
  posX: string;
  posY: string;
  posZ: string;
  rotX: string;
  rotY: string;
  rotZ: string;
  scale: string;
}
