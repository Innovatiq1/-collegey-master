import { ProfileCompletion,MentorsProfileCompletion, MentorProfileStatus,FetchAllBannerImage } from './student-dashboard.model';

export interface StudentProfile {
  student_profile: Profile;
  profile_completion: ProfileCompletion;
}


export interface Profile {
  geography: Geography;
  history: History;
  history_updated: History;
  ways_to_be_in_touch: WaysToBeInTouch;
  headed: Headed;
  interest: Interest;
  know_you_better: KnowYouBetter;
  prefrences: Preferences;
  projects: Projects;
}

export interface Geography {
  school_clg_name: string;
  school_clg_city: string;
  citizenship: string;
  timezone: string;
  country: string;
  city: string;
  state: string;
  city_projects: string;
  city_problem: string;
  is_completed: false;
}

export interface History {
    education: Education[];
    curious_about: string;
    is_completed: false;
}

export interface Education {
  type: string;
  name: string;
  locationCity: string;
  locationState: string;
  locationCountry: string;
  field_of_study: [];
  degree: string;
  start_year: string;
  end_year: string;
  score: number;
  _id: string;
  grade_choosen: [];
  year_choosen: [];
  curious_about: string;
  grade: StudentSchoolGrade[];
  collegegrade: StudentCollegeGrade[];
}

export interface StudentSchoolGrade {
  name: number;
  board: string;
  other_board: string;
  field_of_study: [];
  start_year: number;
  end_year: number;
  score: number;
  _id: string;
  tbd: boolean;
  scoreType: any;
  school_fileName: string; 
  // transcript: any;
}

export interface StudentCollegeGrade {
  name: string;
  field_of_study: [];
  score: number;
  stdyear: number;
  _id: string;
  scoreType: any;
  college_fileName: string;
  tbd: boolean;
  // transcript: any;
}

export interface WaysToBeInTouch {
  phone_number: PhoneNumber;
  parents_details: ParentDetails;
  school_counselor: SchoolCounselor[];
  social_media: any[];
  dob: string;
  age: string;
  // name: string;
  // email: string;
  is_completed: boolean;
}

export interface PhoneNumber {
  extension: string;
  number: string;
}

export interface ParentDetails {
  name: string;
  email: string;
  relation: string;
  relation_with_guardian: string;
  phone_number: PhoneNumber;
  privacy:string
}

interface SchoolCounselor {
  name: string;
  email: string;
  privacy:string;
}

export interface Headed {
  expected_year_to_start: ExpectedYearToStart;
  preferred_countries: [];
  test_info: TestInfo[];
  wish_to_study: WishToStudy[];
  institutes_Wishlist: InstituteArray[];
  is_completed: false;
}

export interface ExpectedYearToStart {
  preferred_countries: any;
  duration: string;
  grade: string;
  year: string;
  other_degree: string;
}

export interface TestInfo {
  test_name: string;
  test_status: string;
  current_score: string;
  test_date: string;
}
export interface InstituteArray {
  institute_name: string;
}

export interface WishToStudy {
  grade: string;
  subjects: string;
  majors: string;
  other_text: string;
}

export interface Interest {
  [x: string]: any;
  interest_area: string[];
  fav_subjects: string[];
  key_problems:string;
  improve_projects:string;
  is_completed: false;
}

export interface KnowYouBetter {
  people_who_inspire_you: CommonKnowYouBetter[];
  fav_books: CommonKnowYouBetter[];
  fav_movies: CommonKnowYouBetter[];
  fav_websites: CommonKnowYouBetter[];
  fav_activity_on_internet: string;
  fav_websites1: string;
  fav_websites2: string;
  fav_websites3: string;
  fav_message_service: CommonKnowYouBetter[];
  // awards: string[];
  is_completed: false;
}

export class CommonKnowYouBetter {
  name: string;
}


export interface Projects {
  any_bpp: BigPictureProject;
  describe_any_project: DescribeProject[];
  writing_sample: WritingSample[];
  someone_said_something_or_recommendation: Recommendation[];
  award: Award[];
  is_completed: false;
}

export interface Award {
  title:	string;
  issuing_organisation:	string;
  role:	string;
  duration:	string[];
  description:	string;
  file:	string[];
  _id: string;
  type: string;
}
export interface Recommendation {
  title:	string;
  description:	string;
  file:	string[];
  _id: string;

}
export interface WritingSample {
  answer: string;
  title: string;
  description: string;
  file: string[];
  _id: string;
}

export interface DescribeProject {
  title: string;
  description: string;
  project_url: string;
  _id: string;
}

export interface BigPictureProject {
  title: string;
  description: string;
  answer: boolean;
}

export interface MentorProfile {
  mentor_profile: MProfile;
  mentor_profile_completion: MentorsProfileCompletion;
  profile_completion: MentorsProfileCompletion;
  AllbannerImage: FetchAllBannerImage;
}

export interface MProfile {
  profile: MentorsProfile;
  officeHours:MentorsOfficeHours;
  officeTimezone:MentorsOfficeTime;
  projects:StudentProjects
}

export interface MentorsProfile {
  professionalTitle:string,
  location: string,
  fullLegalName: string,
  aboutYou: string,
  adviceToYoungPeople: string,
  favBooks: string[],
  interest: string[],
  can_help: string[],
  expertise: string[],
  industry: string,
  lastCollegeDegree: string,
  linkedIn: string,
  experience: number,
  lastEducationalInstitutionAttended: string,
  website: string,
  videoIntroduction:string,
  is_completed: boolean,
  shouldAgree: boolean,
  mentor_profile_completion: MentorsProfileCompletion;
}
export interface MentorsOfficeHours {
  // date: string;
  // days:string;
  time:Date;
  is_completed:boolean;
}
export interface MentorsOfficeTime {
  timezoneName:String;
  is_completed: boolean,
}
export interface StudentProjects {
  projectTitle: string,
  bannerImage:string,
  lastDate:string,
  startDate:Date,
  keyword:string[],
  maxNumberOfStudentsAllowed:string,
  minNumberOfStudentsAllowed:string,
  projectUNSDG:string,
  aboutProject:string,
  projectPlan:string,
  isPaid:boolean,
  price:number,
  is_completed: boolean,
}

export interface Preferences {
  answer: any;
  imoprtance: any;
  future_privacy: any;
  interested_in_gap: false;
  how_would_like_to_pay: string[];
  wish_to_apply_for_scholarships: {
    answer: false;
    imoprtance: string;
  };
  family_income: string;
  is_completed: false;
  privacy:string;
}