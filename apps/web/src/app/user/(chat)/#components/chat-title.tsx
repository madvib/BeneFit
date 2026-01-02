export const ChatTitle = ({ title, version }: { title: string; version?: string }) => (
  <div className="border-muted flex h-6 items-center gap-3 border-l pl-4">
    <span className="text-foreground max-w-30 truncate text-sm font-medium sm:max-w-50">
      {title}
    </span>
    {version && (
      <span className="bg-muted/50 text-muted-foreground border-muted-foreground/20 hidden rounded-md border px-1.5 py-0.5 text-[10px] font-medium sm:inline-flex">
        {version}
      </span>
    )}
  </div>
);
