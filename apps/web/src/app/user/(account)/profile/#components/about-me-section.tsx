'use client';

interface AboutMeSectionProps {
  aboutMe: string;
  onChange: (_value: string) => void;
}

export default function AboutMeSection({ aboutMe, onChange }: AboutMeSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-xl font-semibold sm:text-2xl">About Me</h3>
      <textarea
        className="border-muted bg-background min-h-30 w-full rounded border p-3 text-sm sm:text-base"
        value={aboutMe}
        onChange={(e) => onChange(e.target.value)}
      ></textarea>
    </div>
  );
}
