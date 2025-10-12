interface SectionProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Section({ 
  title, 
  actions, 
  children, 
  className = '' 
}: SectionProps) {
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">{title}</h3>
        {actions && <div>{actions}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}