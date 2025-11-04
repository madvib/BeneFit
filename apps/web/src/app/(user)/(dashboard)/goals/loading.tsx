import { LoadingSpinner } from '@/components';

export default function Loading() {
  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Goals</h1>
      </div>
      <LoadingSpinner />
    </div>
  );
}
