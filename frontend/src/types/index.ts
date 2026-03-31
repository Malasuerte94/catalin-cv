export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  logoUrl?: string;
  projectUrl?: string;
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
}

export interface ContactUrl {
  id: number;
  platform: string;
  url: string;
  icon?: string;
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
