'use client';

interface RecommendationCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  className?: string;
}

export default function RecommendationCard({
  title,
  description,
  category,
  className = ''
}: RecommendationCardProps) {
  return (
    <div className={`p-4 bg-background rounded-lg border border-muted ${className}`}>
      <div className="flex justify-between">
        <h4 className="font-medium">{title}</h4>
        <span className="text-xs bg-muted px-2 py-1 rounded">
          {category}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mt-2">{description}</p>
   
        <button 
          onClick={() => console.log(`Learning more about ${title}`)}
          className="mt-3 text-sm btn btn-ghost"
        >
          Learn More
        </button>
      
    </div>
  );
}