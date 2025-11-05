import ConnectionServiceCard from './connection-service-card';

interface ConnectionServicesSectionProps {
  title: string;
  subtitle: string;
  services: { name: string; logo: string }[];
}

export default function ConnectionServicesSection({ title, subtitle, services }: ConnectionServicesSectionProps) {
  return (
    <div className="bg-secondary p-8 rounded-xl shadow-md mb-16">
      <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
        {subtitle}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {services.map((service, index) => (
          <ConnectionServiceCard key={index} name={service.name} logo={service.logo} />
        ))}
      </div>
    </div>
  );
}