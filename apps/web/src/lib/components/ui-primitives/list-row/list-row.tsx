interface ListRowProps {
  title: string;
  subtitle?: string;
  leftElement?: React.ReactNode; // Usually an IconBox
  rightElement?: React.ReactNode; // Time ago, or action button
  onClick?: () => void;
  children?: React.ReactNode; // For content below title (badges, etc)
}

export function ListRow({
  title,
  subtitle,
  leftElement,
  rightElement,
  onClick,
  children,
}: ListRowProps) {
  return (
    <div
      onClick={onClick}
      className={`group border-muted bg-card hover:border-primary/40 relative flex gap-4 rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
    >
      {leftElement}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-4">
          <h4 className="text-foreground group-hover:text-primary truncate text-sm font-bold transition-colors">
            {title}
          </h4>
          {rightElement && <div className="shrink-0">{rightElement}</div>}
        </div>

        {subtitle && (
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {subtitle}
          </p>
        )}

        {children && (
          <div className="mt-3 flex flex-wrap items-center gap-2">{children}</div>
        )}
      </div>
    </div>
  );
}
