'use client';

interface AboutMeSectionProps {
  aboutMe: string;
  onChange: (value: string) => void;
}

export default function AboutMeSection({ aboutMe, onChange }: AboutMeSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-xl sm:text-2xl font-semibold mb-3">About Me</h3>
      <textarea
        className="w-full p-3 rounded border border-muted bg-background min-h-[120px] text-sm sm:text-base"
        value={aboutMe}
        onChange={(e) => onChange(e.target.value)}
      ></textarea>
    </div>
  );
}