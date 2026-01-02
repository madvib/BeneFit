import Image from 'next/image';

interface ImageCardProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export default function ImageCard({ src, alt, width, height }: ImageCardProps) {
  return (
    <div className="w-full max-w-2xl flex-1">
      <div className="border-accent relative transform overflow-hidden rounded-2xl border shadow-xl transition-transform duration-300 hover:scale-[1.02]">
        <div className="aspect-video w-full">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="h-full w-full object-cover"
            priority={false}
          />
        </div>
        <div className="from-background/80 pointer-events-none absolute inset-0 bg-linear-to-t to-transparent"></div>
      </div>
    </div>
  );
}
