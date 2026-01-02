import { ProtectedRoute } from '@/lib/components/auth';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
