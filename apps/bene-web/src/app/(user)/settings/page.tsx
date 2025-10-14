'use client';

import { PageContainer } from '@/components';

export default function SettingsPage() {
  return (
    <PageContainer title="Settings">
      <div className="bg-secondary p-6 rounded-lg shadow-md max-w-3xl">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email updates about your progress</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <p className="font-medium">Workout Reminders</p>
                <p className="text-sm text-muted-foreground">Get reminders to complete your workouts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Privacy Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <p className="font-medium">Profile Visibility</p>
                <p className="text-sm text-muted-foreground">Who can see your profile and activity</p>
              </div>
              <select className="bg-background border border-muted rounded p-2">
                <option>Public</option>
                <option>Friends Only</option>
                <option>Private</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <p className="font-medium">Activity Sharing</p>
                <p className="text-sm text-muted-foreground">Share activities with friends</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Fitness Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-foreground mb-2">Preferred Units</label>
              <select className="w-full p-2 rounded border border-muted bg-background">
                <option>Metric (kg, km)</option>
                <option>Imperial (lbs, miles)</option>
              </select>
            </div>
            <div>
              <label className="block text-foreground mb-2">Goal Focus</label>
              <select className="w-full p-2 rounded border border-muted bg-background">
                <option>Weight Loss</option>
                <option>Muscle Building</option>
                <option>General Fitness</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button className="btn btn-primary">Save Settings</button>
        </div>
      </div>
    </PageContainer>
  );
}