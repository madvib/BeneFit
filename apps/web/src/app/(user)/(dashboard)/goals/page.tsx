// Server Component - fetches data on the server

import { GoalsClient } from '@/components/user/dashboard/goals';

// This page can be mostly server-rendered since it doesn't require much client interaction
export default async function GoalsPage() {
  return <GoalsClient />;
}
