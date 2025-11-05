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
    <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-md">
      <h3 className="text-lg sm:text-xl font-bold mb-4">Goal Suggestions</h3>
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
    </div>
  );
}
