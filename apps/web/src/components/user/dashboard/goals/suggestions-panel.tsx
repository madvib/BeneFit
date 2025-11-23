import { Card } from '@/components';
import RecommendationCard from '@/components/user/dashboard/recommendation-card';

interface RecommendationDTO {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface SuggestionsPanelProps {
  recommendations: RecommendationDTO[];
}

export default function SuggestionsPanel({ recommendations }: SuggestionsPanelProps) {
  return (
    <Card title="Suggestions">
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <RecommendationCard
            key={rec.id}
            title={rec.title}
            description={rec.description}
            category={rec.category}
          />
        ))}
      </div>
    </Card>
  );
}
