import { Dropdown } from './common.model';
import { MentorProfile, Profile as StudentProfile } from './student-profile.model';

export class Profile {
  name: string;
  email: string;
  last_name: string;
  qualification: string;
  avatar: string;
  countryObj: Dropdown = new Dropdown();
  stateObj: Dropdown = new Dropdown();
  cityObj: Dropdown = new Dropdown();
  profile_completion: ProfileCompletion = new ProfileCompletion();
}

export class MentorsProfile {
  [x: string]: any;
  name: string;
  email: string;
  last_name: string;
  qualification: string;
  AllbannerImage : FetchAllBannerImage = new FetchAllBannerImage();
  avatar: string;
  countryObj: Dropdown = new Dropdown();
  stateObj: Dropdown = new Dropdown();
  cityObj: Dropdown = new Dropdown();
  profile_completion: MentorsProfileCompletion = new MentorsProfileCompletion();
  mentor_profile_completion: any;
}

export class ProfileCompletion {
  profile_completed: boolean;
  profile_percentage: number;
  profile_text: string;
  profile_status: ProfileStatus = new ProfileStatus();
}

export class MentorsProfileCompletion {
  profile_completed: boolean;
  profile_percentage: number;
  profile_text: string;
  profile_status: MentorProfileStatus = new MentorProfileStatus();
}

export class FetchAllBannerImage {
  active: boolean;
  image: string; 
}

export class ProjectWrapper {
  docs: Project[] = [];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: boolean;
  nextPage: boolean;
}

export class Project {
  sdg: string[] = [];
  slug: string;
  _id: string;
  partner: Partner = new Partner();
  title: string;
  description: string;
  signedup: boolean;
  cssIndex: number;
  hash_tags: string[] = [];
  projectType : string;
}

export interface SignedUpProjects {
  id: string;
  project: Project;
  cssIndex: number;
}

export interface WatchlistProjects {
  id: string;
  project: Project;
  cssIndex: number;
}

export interface CompletedProjects {
  id: string;
  project: Project;
  cssIndex: number;
}

export interface EnrollProjects {
  signedupProject: SignedUpProjects[];
}



export class Dashboard {
  projects: ProjectWrapper = new ProjectWrapper();
  profile: Profile = new Profile();
  signedupProjects: SignedUpProjects[];
  watchlistProjects: WatchlistProjects[];
  completedProjects: CompletedProjects[];
  questionnaire: {};
}

export class MentorDashboard {
  profile: MentorsProfile = new MentorsProfile();
  projects: Project[];
  completedProjects: Project[];
  liveProjects: Project[];
  inviteProjects: Project[];
  inProgressProjects: Project[];
  pendingProjects: Project[];
  allCollegeyMentorProjects:Project[];
  allCollegyProject:Project[]
}

export class ProfileStatus {
  geography: boolean;
  headed: boolean;
  history_updated: boolean;
  interest: boolean;
  know_you_better: boolean;
  prefrences: boolean;
  projects: boolean;
  ways_to_be_in_touch: boolean;
}

export class MentorProfileStatus {
  profile: boolean;
  officeHours: boolean;
  projects: boolean;
}

export class Partner {
  name: string;
  avatar: string;
  _id: string;
}



export class PublicProfile extends Profile {
  _id: string;
  student_profile: StudentProfile;
  profile_completion: ProfileCompletion;
}
