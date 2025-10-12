'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type ActivityType = 'workout' | 'nutrition' | 'goal' | 'achievement' | 'progress';

interface ActivityItem {
  id: number;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string; // ISO date string
  user: string;
  avatar: string;
  duration?: string;
  calories?: number;
  value?: number;
  goal?: number;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for the activity feed
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      const mockActivities: ActivityItem[] = [
        {
          id: 1,
          type: 'workout',
          title: 'Completed 5K Run',
          description: 'Great pace today! Finished with a new personal best time.',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          user: 'Alex Johnson',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          duration: '28:45',
        },
        {
          id: 2,
          type: 'nutrition',
          title: 'Lunch Added',
          description: 'Grilled chicken salad with vegetables',
          timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          user: 'Sarah Miller',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          calories: 420,
        },
        {
          id: 3,
          type: 'goal',
          title: 'New Goal Set',
          description: 'Run 50 miles this month',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          user: 'Mike Thompson',
          avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
          value: 12,
          goal: 50,
        },
        {
          id: 4,
          type: 'achievement',
          title: 'Milestone Reached',
          description: 'Congratulations on completing 30 consecutive days of exercise!',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          user: 'You',
          avatar: 'https://randomuser.me/api/portraits/men/97.jpg',
        },
        {
          id: 5,
          type: 'progress',
          title: 'Weight Loss Progress',
          description: 'Lost 2 lbs this week',
          timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          user: 'Emma Davis',
          avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
          value: 2,
        },
      ];
      
      setActivities(mockActivities);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'workout':
        return (
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        );
      case 'nutrition':
        return (
          <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
        );
      case 'goal':
        return (
          <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'achievement':
        return (
          <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        );
      case 'progress':
        return (
          <div className="bg-teal-100 dark:bg-teal-900 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  if (loading) {
    return (
      <div className="bg-secondary p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Activity Feed</h3>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-muted h-12 w-12"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary p-6 rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Activity Feed</h3>
        <button className="btn btn-ghost text-sm">View All</button>
      </div>
      
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div 
              key={activity.id} 
              className="bg-background p-4 rounded-lg shadow-sm border border-muted flex items-start"
            >
              <div className="mr-3">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-semibold">{activity.title}</h4>
                  <span className="text-sm text-muted-foreground">{formatTime(activity.timestamp)}</span>
                </div>
                <p className="text-foreground/80 text-sm mt-1">{activity.description}</p>
                
                <div className="flex items-center mt-2">
                  <Image 
                    src={activity.avatar} 
                    alt={activity.user} 
                    width={24} 
                    height={24} 
                    className="rounded-full mr-2"
                  />
                  <span className="text-sm text-muted-foreground">{activity.user}</span>
                  
                  {activity.duration && (
                    <span className="ml-3 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {activity.duration}
                    </span>
                  )}
                  
                  {activity.calories !== undefined && (
                    <span className="ml-3 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      {activity.calories} cal
                    </span>
                  )}
                  
                  {activity.value !== undefined && activity.goal !== undefined && (
                    <span className="ml-3 text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                      {activity.value}/{activity.goal}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground italic">No recent activity</p>
        )}
      </div>
    </div>
  );
}