import { LucideIcon } from 'lucide-react';

interface IconBoxProps {
  icon: LucideIcon;
  variant?: 'blue' | 'green' | 'orange' | 'red' | 'primary' | 'gray';
  size?: 'sm' | 'md';
}

export function IconBox({ icon: Icon, variant = 'primary', size = 'md' }: IconBoxProps) {
  let variantClasses = '';
  switch (variant) {
    case 'blue':
      variantClasses = 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      break;
    case 'green':
      variantClasses = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      break;
    case 'orange':
      variantClasses = 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      break;
    case 'red':
      variantClasses = 'bg-red-500/10 text-red-600 border-red-500/20';
      break;
    case 'primary':
      variantClasses = 'bg-primary/10 text-primary border-primary/20';
      break;
    case 'gray':
      variantClasses = 'bg-muted text-muted-foreground border-transparent';
      break;
    default:
      variantClasses = 'bg-primary/10 text-primary border-primary/20';
  }

  const sizeClasses = size === 'sm' ? 'h-8 w-8 p-1.5' : 'h-10 w-10 p-2';

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-lg border ${variantClasses} ${sizeClasses}`}
    >
      <Icon className="h-full w-full" />
    </div>
  );
}
