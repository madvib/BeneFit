import { ProtectedRoute, RequireProfile } from '@/lib/components';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <RequireProfile>{children}</RequireProfile>
    </ProtectedRoute>
  );
}
