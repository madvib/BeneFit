"use client";

import { useState, useEffect } from "react";
import ActivityFeed from "@/components/ActivityFeed";
import ProgressBar from "@/components/common/ProgressBar";
import {
  Card,
  DashboardLayout,
  PageContainer,
  TopTabNavigation,
} from "@/components";
import { fetchCurrentGoal, fetchChartData } from "@/lib/data/nextDataService";
import { Goal, ChartData } from "@/lib/data/types/dataTypes";

export default function DashboardPage() {
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [progressData, setProgressData] = useState<ChartData[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const [goal, chartData] = await Promise.all([
        fetchCurrentGoal(),
        fetchChartData(),
      ]);
      setCurrentGoal(goal);
      setProgressData(chartData);
    }
    fetchData();
  }, []);

  const renderGoalCard = () => (
    <Card title="Current Goal">
      {currentGoal ? (
        <div>
          <h4 className="font-semibold text-lg break-words">
            {currentGoal.title}
          </h4>
          <p className="text-muted-foreground text-sm mb-4 break-words">
            {currentGoal.description}
          </p>
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm mb-1">
              <div className="flex gap-2">
                <span className="font-medium">
                  {currentGoal.currentValue} {currentGoal.unit}
                </span>
                <span className="text-muted-foreground">
                  / {currentGoal.targetValue} {currentGoal.unit}
                </span>
              </div>
            </div>
            <ProgressBar
              value={currentGoal.currentValue}
              max={currentGoal.targetValue}
              className="mt-1"
            />
          </div>
          <div className="text-sm space-y-1">
            <p className="text-muted-foreground break-words">
              Deadline: {new Date(currentGoal.deadline).toLocaleDateString()}
            </p>
            <p className="text-muted-foreground break-words">
              Remaining:{" "}
              {(currentGoal.targetValue - currentGoal.currentValue).toFixed(1)}{" "}
              {currentGoal.unit}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground italic">No current goal set</p>
      )}
      <button className="mt-4 w-full btn btn-primary">Set New Goal</button>
    </Card>
  );

  const renderProgressChart = () => (
    <Card title="Progress Chart">
      <div className="h-48 sm:h-64 flex items-end space-x-1 sm:space-x-2 pt-4 sm:pt-6 overflow-x-auto pb-2 -mx-4 px-4">
        {progressData.map((data, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-1 min-w-[30px] max-w-[60px]"
          >
            <div className="text-xs text-muted-foreground mb-1 shrink-0">
              {data.date}
            </div>
            <div
              className="w-full bg-primary rounded-t hover:opacity-75 transition-opacity min-h-[5px]"
              style={{ height: `${Math.max(5, (data.value / 50) * 100)}%` }}
            ></div>
            <div className="text-xs mt-1 shrink-0">{data.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center pt-4 border-t border-accent">
        <p className="text-muted-foreground text-sm mb-2 break-words">
          Weekly Progress
        </p>
        <p className="text-xl sm:text-2xl font-bold text-primary break-words">
          +7.5 miles this week
        </p>
      </div>
    </Card>
  );

  const feedView = () => (
    <div className="space-y-4">
      <ActivityFeed />
    </div>
  );

  const goalView = () => <div className="space-y-4">{renderGoalCard()}</div>;

  const progressView = () => (
    <div className="space-y-4">{renderProgressChart()}</div>
  );

  const tabs = [
    { id: "feed", label: "Feed" },
    { id: "goal", label: "Goal" },
    { id: "progress", label: "Progress" },
  ];

  if (isMobile) {
    return (
      <PageContainer>
        <TopTabNavigation tabs={tabs} defaultActiveTab="feed">
          {{
            feed: feedView(),
            goal: goalView(),
            progress: progressView(),
          }}
        </TopTabNavigation>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Welcome, User!" hideTitle={true}>
      <DashboardLayout
        sidebar={
          <div className="space-y-6 w-full">
            {renderGoalCard()}
            {renderProgressChart()}
          </div>
        }
      >
        <ActivityFeed />
      </DashboardLayout>
    </PageContainer>
  );
}
