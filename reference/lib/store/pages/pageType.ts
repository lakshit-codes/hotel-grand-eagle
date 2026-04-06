export interface PageBlock {
  id: string;
  type: string;
  layout: string;
  adminTitle?: string; // Identifier for sections/subsections
  content: any[]; // will contain either primitive blocks or nested PageBlocks
  columns?: any[][]; // New field for multi-column mapping
}

export interface Page {
  _id?: string;
  title: string;
  slug: string;
  content: PageBlock[];
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  // keeping these for backward compatibility if needed by existing UI
  status?: string; 
  type?: string;
  template?: string;
  isHomepage?: boolean;
}
