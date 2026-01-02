export function FormSuccessMessage({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="bg-success/15 flex items-center gap-x-2 rounded-md p-4 text-sm text-green-600 transition-all duration-300">
      <p>{message}</p>
    </div>
  );
}
