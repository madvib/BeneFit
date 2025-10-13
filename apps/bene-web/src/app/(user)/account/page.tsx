'use client';

import Link from 'next/link';
import { PageContainer } from '@/components';

export default function AccountPage() {
  return (
    <PageContainer title="Account Settings">
      <div className="bg-secondary p-6 rounded-lg shadow-md max-w-3xl">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-foreground mb-2">First Name</label>
              <input 
                type="text" 
                className="w-full p-2 rounded border border-muted bg-background" 
                defaultValue="John" 
              />
            </div>
            <div>
              <label className="block text-foreground mb-2">Last Name</label>
              <input 
                type="text" 
                className="w-full p-2 rounded border border-muted bg-background" 
                defaultValue="Doe" 
              />
            </div>
            <div>
              <label className="block text-foreground mb-2">Email</label>
              <input 
                type="email" 
                className="w-full p-2 rounded border border-muted bg-background" 
                defaultValue="john.doe@example.com" 
              />
            </div>
            <div>
              <label className="block text-foreground mb-2">Phone</label>
              <input 
                type="tel" 
                className="w-full p-2 rounded border border-muted bg-background" 
                defaultValue="+1 (555) 123-4567" 
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4">Security</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-foreground mb-2">Current Password</label>
              <input 
                type="password" 
                className="w-full p-2 rounded border border-muted bg-background" 
              />
            </div>
            <div>
              <label className="block text-foreground mb-2">New Password</label>
              <input 
                type="password" 
                className="w-full p-2 rounded border border-muted bg-background" 
              />
            </div>
            <div>
              <label className="block text-foreground mb-2">Confirm New Password</label>
              <input 
                type="password" 
                className="w-full p-2 rounded border border-muted bg-background" 
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </PageContainer>
  );
}