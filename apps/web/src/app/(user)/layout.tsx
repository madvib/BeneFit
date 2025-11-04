import UserLayout from '@/components/user/user-layout';

export default function UserLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserLayout>{children}</UserLayout>;
}
