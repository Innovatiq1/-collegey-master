import { MentorProfile } from "./student-profile.model";

export class User {
  _id: string;
  email?: string;
  name?: string;
  avatar: string;
  bannerImage: string;
  qualification: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  phone_number: [];
  last_name;
  slug: string;
  status: number;
  type: string;
  organization?: string;
  profile_completed: boolean;
  cityObj:any;
  countryObj:any;
  stateObj:any;
  mentor_profile: MentorProfile;
}

export interface Student {
  user: User;
  token: string;
}
