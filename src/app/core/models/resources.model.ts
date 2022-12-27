export interface Resource {
  _id: string;
  slug: string;
  tags: string[];
  status: number;
  title: string;
  author: string;
  short_description: string;
  description: string;
  redirect_link: string;
  is_paid: false;
  cost: number;
  program_type: string;
  updatedAt: string;
  image: string;
  author_image: string;
  createdAt: string;
}

export interface GenericResources {
  docs: Resource[];
  totalDocs: number;
  prevPage : number;
  nextPage : number;
  limit: number;
}

export interface AllResources {
  blogs: Resource[];
  programs: Resource[];
  webinars: Resource[];
} 
