interface CardLayoutProps {
  mainContent: React.ReactNode;
  sideContent?: React.ReactNode;
  mainCols?: string; // Tailwind grid columns for main content (default: lg:col-span-2)
  sideCols?: string; // Tailwind grid columns for side content (default: lg:col-span-1)
}

export default function CardLayout({
  mainContent,
  sideContent,
  mainCols = "lg:col-span-2",
  sideCols = "lg:col-span-1",
}: CardLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className={mainCols}>{mainContent}</div>
      {sideContent && <div className={sideCols}>{sideContent}</div>}
    </div>
  );
}
