import Image from 'next/image';

interface ConnectionServiceCardProps {
  name: string;
  logo: string;
}

export default function ConnectionServiceCard({ name, logo }: ConnectionServiceCardProps) {
  return (
    <div className="flex flex-col items-center p-4 bg-background rounded-lg">
      <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-800 p-1 flex items-center justify-center mb-2">
        <Image
          src={logo}
          alt={name}
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
        />
      </div>
      <span className="text-sm">{name}</span>
    </div>
  );
}