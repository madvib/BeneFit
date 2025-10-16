'use client';

import { useState, ReactNode } from 'react';

type Tab = {
  id: string;
  label: string;
};

interface TopTabNavigationProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  children: Record<string, ReactNode>;
  onTabChange?: (tabId: string) => void;
}

export default function TopTabNavigation({ 
  tabs, 
  defaultActiveTab, 
  children, 
  onTabChange 
}: TopTabNavigationProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0].id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-border bg-secondary">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'text-foreground border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {children[activeTab]}
      </div>
    </div>
  );
}