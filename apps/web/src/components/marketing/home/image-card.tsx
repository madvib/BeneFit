import Image from 'next/image';

interface ImageCardProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export default function ImageCard({ src, alt, width, height }: ImageCardProps) {
  return (
    <div className="flex-1 w-full max-w-2xl">
      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-accent transform transition-transform duration-300 hover:scale-[1.02]">
        <div className="aspect-video w-full">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-full object-cover"
            priority={false}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}