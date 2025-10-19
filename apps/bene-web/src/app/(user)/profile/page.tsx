"use client";

import Image from "next/image";
import { PageContainer } from "@/components";

export default function ProfilePage() {
  return (
    <PageContainer title="Profile">
      <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-6 mb-6">
          <div className="relative">
            <Image
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Profile picture"
              width={120}
              height={120}
              className="rounded-full object-cover border-4 border-primary"
            />
            <button className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-md hover:bg-primary/90">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>

          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold">{`John Doe`}</h3>
            <p className="text-muted-foreground mb-4">Fitness Enthusiast</p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <div className="bg-background p-3 rounded-lg text-center min-w-[80px] sm:min-w-[100px]">
                <p className="text-xl sm:text-2xl font-bold">24</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Workouts
                </p>
              </div>
              <div className="bg-background p-3 rounded-lg text-center min-w-[80px] sm:min-w-[100px]">
                <p className="text-xl sm:text-2xl font-bold">42</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Days Streak
                </p>
              </div>
              <div className="bg-background p-3 rounded-lg text-center min-w-[80px] sm:min-w-[100px]">
                <p className="text-xl sm:text-2xl font-bold">12</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Achievements
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3">About Me</h3>
          <textarea
            className="w-full p-3 rounded border border-muted bg-background min-h-[120px] text-sm sm:text-base"
            defaultValue="Fitness enthusiast who loves running, weight training, and maintaining a healthy lifestyle. Always looking to improve and reach new goals!"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-background p-4 sm:p-5 rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold mb-3">
              Fitness Goals
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base">Run a marathon</span>
              </li>
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base">Lose 10kg</span>
              </li>
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base">Build 20lbs muscle</span>
              </li>
            </ul>
          </div>

          <div className="bg-background p-4 sm:p-5 rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold mb-3">
              Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row justify-between border-b pb-2 border-muted">
                <span className="text-muted-foreground">Total Distance:</span>
                <span className="font-semibold">245 km</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between border-b pb-2 border-muted">
                <span className="text-muted-foreground">Total Calories:</span>
                <span className="font-semibold">12,800 cal</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between border-b pb-2 border-muted">
                <span className="text-muted-foreground">Avg. Heart Rate:</span>
                <span className="font-semibold">145 bpm</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between">
                <span className="text-muted-foreground">Last Workout:</span>
                <span className="font-semibold">Today</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="btn btn-primary px-6 py-2 text-base">
            Save Profile
          </button>
        </div>
      </div>
    </PageContainer>
  );
}
