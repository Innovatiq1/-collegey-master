export class AppConstants {
  // Local Storage Keys
  static readonly KEY_USER_DATA = 'user_data';
  static readonly KEY_STATIC_DATA = 'static_data';
  static readonly KEY_COUNTRIES_DATA = 'countries_data';
  static readonly KEY_COUNTRY_PHONE_CODE = 'phone_code';
  static readonly KEY_User_Reward_Point = 'reward_point';

  static readonly KEY_COUNSELOR_SOURCE = 'counselor_source';

  static readonly STUDENT_INTERESTED_AREAS = [
    'Sports',
    'Music',
    'Performing',
    'Arts',
    'Visual Arts',
    'Volunteer Activity',
    'Music Writing',
    'Photography',
    'Public Speaking',
    'Environment Related Projects', 'Social Projects', 'Design Projects',
    'Recycling',
    'Tutoring/Coaching',
    'Social Activities',
    'Fundraising',
    'Gardening',
    'Doing Art Projects',
    'Doing Science Projects',
  ];

  static readonly FAVOURITE_MESSAGING_SERVICE = [
    'Kik',
    'Whatsapp',
    'iMessage',
    'Line',
    'Viber',
    'FB',
    'Messenger',
  ];

  static readonly STUDENT_CLASS_OPTIONS = [
    '8th or less',
    '9th',
    '10th',
    '11th',
    '12th',
    'high school graduate/college',
  ];

  static readonly STUDENT_SCHOOL_BOARD = [
    'IB',
    'CBSE',
    'IGCSE',
    'A-Levels',
    'CISCE',
    'US High School',
    'ICSE',
    'State board',
    'Other'
  ];

  static readonly STUDENT_SUBJECT = [
    'STEM (Science, Technology, Engineering, Mathematics)',
    'Liberal Arts (Humanities, Arts, Social Sciences)',
    'Performing Arts (Film, Music, Theater, Dance, etc.)',
    'Business & Economics',
    'Art & Design',
    'Health Sciences (Medicine, Nutrition, Public Health, Other)',
  ];

  static readonly BIG_PICTURE_PROJECT = [
    { value: true, name: 'Yes' },
    { value: false, name: 'No' },
    { value: true, name: 'Ongoing' },
    { value: true, name: 'Planning to do' },
  ];

  static readonly WISH_TO_SHARE = [
    { id: 1, name: 'Yes' },
    { id: 2, name: 'No' },
    { id: 3, name: 'I am thinking about it' },
  ];

  static readonly STUDENT_TESTS = [
    'ACT',
    'AP',
    'SAT',
    'PSAT',
    'TOEFL',
    'IELTS',
    'PTE',
  ];

  static readonly COLLEGE_DEGREE = [
    'Bachelors',
    'Masters',
    'Ph.D',
    'Certificate program',
    'Undecided',
    'Research',
    'MPhil'
  ];

  static readonly EDUCATION_TYPE = [
    { value: 'School', name: 'High School' },
    { value: 'College', name: 'College' },
  ];

  static readonly STUDENT_CURRENT_CLASS = [
    { id: 1, name: '9' },
    { id: 2, name: '10' },
    { id: 3, name: '11' },
    { id: 4, name: '12' },
    { id: 5, name: 'Others' },
  ];

  static readonly STUDENT_CURRENT_CLASS2 = [
   '9',
   '10',
   '11',
   '12',
  ];

  static readonly STUDENT_CURRENT_CLASS3 = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    '5th Year'
   ];

  static readonly STUDENT_FAVORITE_SUBJECTS = [
    'Maths',
    'Physics',
    'Chemistry',
    'Java',
    'Python',
    'C',
    'OOPS',
    'Computer Networks',
    'Computer Organization',
    'Biology',
    'Commerce',
    'Languages',
    'Literature',
    'History',
    'Music',
    'Art',
    'Psychology',
    'Economics',
    'Design',
    'Computer Science',
    'Geography',
    'Business',
    'Drama',
    'Dance',
    'Physical',
    'Education',
  ];

  static readonly college_FAVORITE_SUBJECTS = [
    'java',
    'python',
  ];

  static readonly SCORE_TYPE = [
    'Score',
    'Points',
    'GPA',
    'Percentage',
  ];

  static readonly new_FAVORITE_SUBJECTS = [
    'angular',
    'react',
  ];

  static readonly PAY_PER_YEAR = [
    '< $10,000',
    '$10,000-$20,000',
    '$20,000-40,000',
    '$40,000-$60,000',
    '>$60,000',
  ];

  static readonly FAMILY_INCOME = [
    '< $10,000',
    '$10,000-$20,000',
    '$20,000-40,000',
    '$40,000-$60,000',
    '$60,000-$80,000',
    '>$80,000',
  ];

  static readonly UNIVERSITY_PARTNER_TESTS = [
    'AP',
    'ACT',
    'SAT',
    'TOEFL',
    'IELTS',
    'PTE',
    'GMAT',
    'GRE',
    'NEET',
    'ETC',
  ];

  static readonly SOCIAL_MEDIA_CHANNEL = [
    'Facebook',
    'Instagram',
    'Youtube',
    'Snapchat',
    'Blog',
    'Video link',
    'LinkedIn',
    'Twitter',
    'Tumblr',
    'Twitch',
    'Spotify',
    'Pinterest',
    'Reddit',
    'Periscope',
    'GroupMe',
    'Discord',
    'Tik Tok',
    'Houseparty',
    'Monkey',
  ];

  static readonly STUDENT_DOCUMENT = [
    'Award',
    'Certificates',
    'Experience',
    'Internship',
    'Online learning',
    'Participations',
    'Volunteer', 
  ];

  
  static readonly PRIVACY = [
    'Public Profile',
    'Private Profile',
  ];
  static readonly INTERESTED_TO_PURSUE = [
    { id: 1, name: 'Undergraduate Program' },
    { id: 2, name: 'Post Graduate program' },
    { id: 3, name: "Don't know yet" },
  ];

  static readonly TAKEN_TESTS = [
    { value: 'taken', name: 'Taken' },
    { value: 'planned', name: 'Plan to take' },
  ];

  static readonly DEFAULT_PAGE_LIMIT = 12;


  static readonly DEFAULT_SEARCH_PARAMS: { [key: string]: string | number } = {
    limit: AppConstants.DEFAULT_PAGE_LIMIT
  };

  static readonly INVITATION_MESSAGE = 'I invite you to build your comprehensive portfolio on Collegey. It will help you in your higher education pursuits and learning new skills while building a global network. You will also be able to select projects of your choice. I am using Collegey, too. Check it out!';

  static readonly PHONE_PATTERN = /^[6789]{1}[0-9]{9}$/;
  // tslint:disable-next-line:max-line-length
  static readonly EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  static readonly URL_PATTERN = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

  static DATE_LOCALE = 'en-US';
  static FULL_DATE: 'EE, MMMM d, y';
  static LONG_DATE: 'yyyy-MM-dd';
  static DISPLAY_DATE_SHORT: 'short';
    
  static readonly START_YEAR = [
    '2010',
    '2011',
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024',
    '2025',
    '2026',
    '2027',
    '2028',
    '2029',
    '2030',


  ];
  static readonly END_YEAR = [
    '2010',
    '2011',
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024',
    '2025',
    '2026',
    '2027',
    '2028',
    '2029',
    '2030',
  ];
}
