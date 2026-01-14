'use client';

import { useState, ReactNode } from 'react';

type Tab = {
  id: string;
  label: string;
};

interface TopTabNavigationProperties {
  tabs: Tab[];
  defaultActiveTab?: string;
  children: Record<string, ReactNode>;
  onTabChange?: (_tabId: string) => void;
}

export function TopTabNavigation({
  tabs,
  children,
  defaultActiveTab,
  onTabChange,
}: TopTabNavigationProperties) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]!.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 flex space-x-1 rounded-lg p-1">
        {tabs.map((tab: Tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab in children
          ? children[activeTab as keyof typeof children]
          : undefined}
      </div>
    </div>
  );
}
