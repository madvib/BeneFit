interface PageContainerProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ 
  title, 
  subtitle, 
  actions, 
  children,
  className = '' 
}: PageContainerProps) {
  return (
    <main className={`flex-grow container mx-auto p-8 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-bold">{title}</h2>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      
      {children}
    </main>
  );
}