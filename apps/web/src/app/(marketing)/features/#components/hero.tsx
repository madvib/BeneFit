interface HeroProps {
  title: string;
  subtitle: string;
}

export default function FeaturesHero({ title, subtitle }: HeroProps) {
  return (
    <div className="mb-12 text-center">
      <h1 className="mb-4 text-5xl font-bold">{title}</h1>
      <p className="text-muted-foreground mx-auto max-w-3xl text-xl">{subtitle}</p>
    </div>
  );
}
