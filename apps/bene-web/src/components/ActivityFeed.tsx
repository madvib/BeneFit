"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatTimeAgo } from "@/utils/timeUtils";
import { Card, EmptyState, LoadingSpinner } from "@/components";
import { getActivityFeed } from "@/lib/data/mockDataService";
import { ActivityItem } from "@/lib/data/types/dataTypes";

type ActivityType =
  | "workout"
  | "nutrition"
  | "goal"
  | "achievement"
  | "progress";

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch activity feed data
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activityData = await getActivityFeed();
        setActivities(activityData);
      } catch (error) {
        console.error("Error fetching activity feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "workout":
        return (
          <div className="bg-primary/20 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        );
      case "nutrition":
        return (
          <div className="bg-primary/20 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
          </div>
        );
      case "goal":
        return (
          <div className="bg-primary/20 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case "achievement":
        return (
          <div className="bg-primary/20 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
        );
      case "progress":
        return (
          <div className="bg-primary/20 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-primary/20 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  // Remove the local formatTime function since we're using the utility function

  if (loading) {
    return (
      <Card title="Activity Feed" className="h-full">
        <LoadingSpinner />
      </Card>
    );
  }

  return (
    <Card
      title="Activity Feed"
      actions={
        <button className="btn btn-ghost text-sm px-3 py-1.5">View All</button>
      }
      className="h-full"
    >
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-background p-4 rounded-lg shadow-sm border border-muted flex flex-col sm:flex-row gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 w-full">
                    <h4 className="font-semibold text-sm sm:text-base break-words max-w-full">
                      {activity.title}
                    </h4>
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap self-start sm:self-auto">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-foreground/80 text-sm mt-1 break-words max-w-full">
                    {activity.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3 items-center pl-12 sm:pl-0">
                <div className="flex items-center min-w-0">
                  <Image
                    src={activity.avatar}
                    alt={activity.user}
                    width={24}
                    height={24}
                    className="rounded-full mr-2 flex-shrink-0"
                  />
                  <span className="text-sm text-muted-foreground truncate">
                    {activity.user}
                  </span>
                </div>

                {activity.duration && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                    {activity.duration}
                  </span>
                )}

                {activity.calories !== undefined && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                    {activity.calories} cal
                  </span>
                )}

                {activity.value !== undefined &&
                  activity.goal !== undefined && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                      {activity.value}/{activity.goal}
                    </span>
                  )}
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No Recent Activity"
            description="There's no recent activity to display. Start working out to see your activity feed!"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            action={{
              label: "Start Workout",
              onClick: () => console.log("Start workout clicked"),
            }}
          />
        )}
      </div>
    </Card>
  );
}
