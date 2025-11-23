import { LucideIcon } from 'lucide-react';

interface IconBoxProps {
  icon: LucideIcon;
  variant?: 'blue' | 'green' | 'orange' | 'red' | 'primary' | 'gray';
  size?: 'sm' | 'md';
}

export function IconBox({
  icon: Icon,
  variant = 'primary',
  size = 'md',
}: IconBoxProps) {
  const variants = {
    blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    green: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    orange: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    red: 'bg-red-500/10 text-red-600 border-red-500/20',
    primary: 'bg-primary/10 text-primary border-primary/20',
    gray: 'bg-muted text-muted-foreground border-transparent',
  };

  const sizes = {
    sm: 'h-8 w-8 p-1.5',
    md: 'h-10 w-10 p-2',
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-lg border ${variants[variant]} ${sizes[size]}`}
    >
      <Icon className="h-full w-full" />
    </div>
  );
}
