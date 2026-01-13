import { typography } from '@/lib/components/theme/typography';

//TODO could this use a primitive?
export const ChatTitle = ({ title, version }: { title: string; version?: string }) => (
  <div className="border-muted flex h-6 items-center gap-3 border-l pl-4">
    <span className={`${typography.labelSm} text-foreground max-w-30 truncate sm:max-w-50`}>
      {title}
    </span>
    {version && (
      <span
        className={`${typography.labelXs} bg-muted/50 text-muted-foreground border-muted-foreground/20 hidden rounded-md border px-1.5 py-0.5 sm:inline-flex`}
      >
        {version}
      </span>
    )}
  </div>
);
