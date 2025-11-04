// Server Component - fetches data on the server

import { ProfileClient } from '@/components/user/profile';

// This page can be mostly server-rendered since it doesn't require much client interaction
export default async function ProfilePage() {
  return <ProfileClient />;
}
