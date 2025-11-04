import RecommendationCard from '@/components/user/dashboard/recommendation-card';

interface RecommendationData {
  id: number | string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
}

interface RecommendationsViewProps {
  recommendations: RecommendationData[];
}

export default function RecommendationsView({
  recommendations,
}: RecommendationsViewProps) {
  console.log(recommendations);
  return (
    <div className="bg-secondary p-6 rounded-lg shadow-md h-full">
      <h3 className="text-xl font-bold mb-4">Personal Recommendations</h3>

      <div className="space-y-4">
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
