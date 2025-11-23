'use client';

import { Badge, Button, Card } from '@/components';

interface RecommendationCardProperties {
  title: string;
  description: string;
  category: string;
  className?: string;
}

export default function RecommendationCard({
  title,
  description,
  category,
  className = '',
}: RecommendationCardProperties) {
  return (
    <Card className={className}>
      <div className="flex justify-between">
        <h4 className="font-medium">{title}</h4>
        <Badge variant="secondary">{category}</Badge>
      </div>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => console.log(`Learning more about ${title}`)}
        className="mt-3"
      >
        Learn More
      </Button>
    </Card>
  );
}
