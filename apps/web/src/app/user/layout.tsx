import { ProtectedRoute } from '@/lib/components/auth';
import { RequireProfile } from '@/lib/components/auth/require-profile';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <RequireProfile>{children}</RequireProfile>
    </ProtectedRoute>
  );
}
