import { Header, PageContainer } from '@/lib/components';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer variant={'noPadding'}>
      <Header variant="auth" />
      <div className="flex flex-1 flex-col">
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </PageContainer>
  );
}
