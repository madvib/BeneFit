// Server Component - fetches data on the server

import { AccountClient } from '@/components/user/account';

// This page can be mostly server-rendered since it doesn't require much client interaction
export default async function AccountPage() {
  return <AccountClient />;
}
