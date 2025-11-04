interface HeroProps {
  title: string;
  subtitle: string;
}

export default function FeaturesHero({ title, subtitle }: HeroProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl font-bold mb-4">{title}</h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
}