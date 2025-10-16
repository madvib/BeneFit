interface PageContainerProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  hideTitle?: boolean;
}

export default function PageContainer({ 
  title, 
  subtitle, 
  actions, 
  children,
  className = '',
  hideTitle = false
}: PageContainerProps) {
  return (
    <div className={`w-full ${className}`}>
      {!hideTitle && title && (
        <div className="container mx-auto py-6 md:py-8 px-4 sm:px-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold">{title}</h2>
              {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
            </div>
            {actions && <div>{actions}</div>}
          </div>
        </div>
      )}
      
      <div className={!hideTitle ? "container mx-auto sm:px-2" : "w-full"}>
        {children}
      </div>
    </div>
  );
}