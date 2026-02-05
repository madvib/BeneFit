import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ProtectedRoute, RequireProfile } from '@/lib/components';

export const Route = createFileRoute('/$user')({
  component: UserLayout,
});

function UserLayout() {
  return (
    <ProtectedRoute>
      <RequireProfile>
        <Outlet />
      </RequireProfile>
    </ProtectedRoute>
  );
}
