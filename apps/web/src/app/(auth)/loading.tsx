import { LoadingSpinner } from '@/components';

export default function Loading() {
  return (
    <div className="container mx-auto p-8 flex items-center justify-center h-screen">
      <LoadingSpinner />
    </div>
  );
}
