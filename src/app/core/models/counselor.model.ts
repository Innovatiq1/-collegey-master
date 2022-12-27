export interface CounselorDetail {
  invitation: Invitation[];
  profile: Profile;
  total_invitations: number;
}

interface Profile {
  avatar: string;
  createdAt: string;
  email: string;
  last_name: string;
  name: string;
  organization: string;
  phone_number: [];
  slug: string;
  status: number;
  type: string;
  updatedAt: string;
}

interface Invitation {
  createdAt: string;
  emails: string;
  id: string;
  message: string;
  status: number;
  updatedAt: string;
  user_id: string;
}
