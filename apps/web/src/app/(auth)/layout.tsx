import { Header, PageContainer } from '@/components';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer variant={'noPadding'}>
      <Header variant="marketing" />
      {/* Decorative floating elements */}
      <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-linear-to-r from-purple-400 to-indigo-500 opacity-10 blur-xl"></div>
      <div className="absolute top-1/3 right-12 h-32 w-32 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 opacity-10 blur-xl"></div>
      <div className="absolute bottom-20 left-1/4 h-24 w-24 rounded-full bg-linear-to-r from-green-400 to-emerald-500 opacity-10 blur-xl"></div>

      <div className="flex flex-1 flex-col">
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
          {children}

          {/* <p className="text-muted-foreground mt-8 text-center text-sm">
            © {new Date().getFullYear()} BeneFit. All rights reserved.
          </p> */}
        </div>
      </div>
    </PageContainer>
  );
}
