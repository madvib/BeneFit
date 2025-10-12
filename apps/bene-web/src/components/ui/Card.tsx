interface CardProps {
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export default function Card({ 
  title, 
  actions, 
  children, 
  className = '', 
  titleClassName = '' 
}: CardProps) {
  return (
    <div className={`bg-secondary p-6 rounded-lg shadow-md ${className}`}>
      {(title || actions) && (
        <div className="flex justify-between items-center mb-6">
          {title && <h3 className={`text-2xl font-bold ${titleClassName}`}>{title}</h3>}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}