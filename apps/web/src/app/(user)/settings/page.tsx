// Server Component - fetches data on the server

import { SettingsClient } from '@/components/user/settings';

// This page can be mostly server-rendered since it doesn't require much client interaction
export default async function SettingsPage() {
  return <SettingsClient />;
}
