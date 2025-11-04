// Server Component - fetches data on the server

import { ConnectionsClient } from '@/components/user/connections';

// This page can be mostly server-rendered since it doesn't require much client interaction
export default async function ConnectionsPage() {
  return <ConnectionsClient />;
}
