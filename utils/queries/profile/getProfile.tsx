import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

interface ProfileVisibility {
  show_linked_github: boolean;
  show_linked_discord: boolean;
  show_linked_email: boolean;
  show_profile: boolean;
}

interface ProfileUser {
  created_at?: string;
  bio?: string;
  profile_picture?: string;
  username: string;
  slug: string;
  full_name?: string;
  prg_languages?: string[];
  githubAccount?: string;
  discordAccount?: string;
  email?: string;
  role?: string;
  submissions?: Submission[];
  show_linked_email?: boolean;
}

interface Submission {
  id: string;
  title?: string;
  challenge?: string;
  problem_title?: string;
  timestamp?: string;
  created_at: string;
  status: 'ACCEPTED' | 'FAILED';
  score: number;
}

const fetchProfile = async (username: string): Promise<ProfileUser | null> => {
  const supabase = createClient();

  if (!username) {
    return null;
  }

  const { data: visibilityData, error: visibilityError } = await supabase
    .from("users")
    .select("show_linked_github, show_linked_discord, show_linked_email, show_profile")
    .or(`username.eq.${username},slug.eq.${username}`)
    .single();
  

  if (visibilityError) {
    return null;
  }

  if (!visibilityData) {
    return null;
  }

  const { show_linked_github, show_linked_discord, show_linked_email, show_profile } = visibilityData as ProfileVisibility;
  
  if (!show_profile) {
    return null;
  }

  const { data: userDetails, error: detailsError } = await supabase
    .from("users")
    .select("created_at, bio, profile_picture, username, slug, full_name, prg_languages, githubAccount, discordAccount, email, role, submissions")
    .or(`username.eq.${username},slug.eq.${username}`)
    .single();


    
  if (detailsError) {
    return null;
  }

  if (!userDetails) {
    return null;
  }

  const filteredData: ProfileUser = {
    ...userDetails,
    githubAccount: show_linked_github ? userDetails.githubAccount : undefined,
    discordAccount: show_linked_discord ? userDetails.discordAccount : undefined,
    email: show_linked_email ? userDetails.email : undefined,
  };

  return filteredData;
};

export const useProfile = <T = ProfileUser>(username: string) => {
  return useQuery<T, Error>({
    queryKey: ["profile", username],
    queryFn: () => fetchProfile(username) as Promise<T>,
    enabled: !!username,
    retry: false,
    refetchOnWindowFocus: false,
  });
};