export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface FactItem {
  value: string;
  label: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

export interface Subject {
  name: string;
}

export interface AcademicStream {
  name: string;
  subjects: Subject[];
}

export interface AcademicStage {
  id: string;
  name: string;
  description: string;
  streams?: AcademicStream[];
}

export interface FacilityItem {
  name: string;
  description: string;
}

export interface StudentActivity {
  name: string;
  description: string;
}

export type AchievementCategory =
  | "academics"
  | "sports"
  | "arts"
  | "innovation"
  | "competitions"
  | "recognitions";

export interface AchievementItem {
  slug: string;
  title: string;
  category: AchievementCategory;
  date: string;
  description: string;
  image?: string;
}

export interface NewsArticle {
  slug: string;
  title: string;
  category: string;
  summary: string;
  body: string[];
  publishedDate: string;
  updatedDate?: string;
  featuredImage?: string;
  author?: string;
}

export type NoticeCategory =
  | "academic"
  | "admissions"
  | "examination"
  | "general"
  | "event";

export interface NoticeItem {
  slug: string;
  title: string;
  date: string;
  category: NoticeCategory;
  description: string;
  attachmentUrl?: string;
  expiryDate?: string;
  important?: boolean;
  published: boolean;
}

export interface EventItem {
  slug: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location: string;
  description: string;
  image?: string;
}

export type GalleryCategory =
  | "Campus"
  | "Classrooms"
  | "School Events"
  | "Arts & Culture"
  | "Sports"
  | "NCC & NSS"
  | "Student Activities"
  | "Achievements"
  | "Historical Photos";

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface GalleryAlbum {
  slug: string;
  title: string;
  description: string;
  category: GalleryCategory;
  date: string;
  cover?: string;
  images: GalleryImage[];
}

export type DownloadCategory =
  | "Academic"
  | "Admissions"
  | "Notices"
  | "Forms"
  | "General";

export interface DownloadItem {
  title: string;
  category: DownloadCategory;
  fileUrl: string;
  updatedDate: string;
  description?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  name: string;
  items: FaqItem[];
}
