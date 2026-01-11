import {
  Activity,
  CheckCircle2,
  Dumbbell,
  Flame,
  Medal,
  Salad,
  Zap,
  TrendingUp,
} from 'lucide-react';

export const getActivityIcon = (type: string) => {
  switch (type) {
    case 'workout':
      return <Dumbbell size={18} className="text-blue-500" />;
    case 'progress':
      return <CheckCircle2 size={18} className="text-emerald-500" />;
    case 'goal':
      return <Flame size={18} className="text-orange-500" />;
    case 'achievement':
      return <Medal size={18} className="text-purple-600" />;
    case 'nutrition':
      return <Salad size={18} className="text-yellow-600" />;
    case 'warmup':
      return <TrendingUp size={16} className="text-emerald-500" />;
    case 'main':
      return <Dumbbell size={16} className="text-primary" />;
    case 'cooldown':
      return <Zap size={16} className="text-orange-500" />;
    default:
      return <Activity size={18} className="text-primary" />;
  }
};

export const getActivityColorClass = (type: string) => {
  switch (type) {
    case 'workout':
      return 'bg-blue-500/10 border-blue-500/20';
    case 'progress':
      return 'bg-emerald-500/10 border-emerald-500/20';
    case 'goal':
      return 'bg-orange-500/10 border-orange-500/20';
    case 'achievement':
      return 'bg-purple-500/10 border-purple-500/20';
    case 'nutrition':
      return 'bg-yellow500/10 border-yellow500/20';
    default:
      return 'bg-primary/10 border-primary/20';
  }
};
