import UserLayout from '@/components/layouts/UserLayout';

export default function UserLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserLayout>{children}</UserLayout>;
}