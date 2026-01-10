import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './page-header';
import { SectionHeader } from './section-header';
import { Button } from '../buttons/button';
import { ChevronRight } from 'lucide-react';

const meta: Meta = {
  title: 'Primitives/Typography',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const PageHeaderDisplay: StoryObj<typeof PageHeader> = {
  render: () => (
    <div className="space-y-8">
      <PageHeader title="Page Title" />
      <div className="bg-border h-px" />
      <PageHeader
        title="Page Title with Description"
        description="This is a description that provides context about the page content."
      />
    </div>
  ),
};

export const SectionHeaderDisplay: StoryObj<typeof SectionHeader> = {
  render: () => (
    <div className="max-w-2xl space-y-8 rounded-xl border p-6">
      <SectionHeader title="Section Title" />

      <div className="bg-border my-4 h-px" />

      <SectionHeader
        title="Section with Action"
        action={
          <Button variant="link" className="p-0 text-sm">
            View All <ChevronRight size={16} />
          </Button>
        }
      />

      <div className="bg-border my-4 h-px" />

      <SectionHeader
        title="Complex Header"
        description="A section header can also have a description."
        action={
          <Button size="sm" variant="outline">
            Settings
          </Button>
        }
      />
    </div>
  ),
};
