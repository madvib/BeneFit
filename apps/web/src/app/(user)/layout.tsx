import UserLayout from "@/presentation/layouts/user-layout";

export default function UserLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserLayout>{children}</UserLayout>;
}
