import type { Meta, StoryObj } from '@storybook/react';
import { ChevronRight } from 'lucide-react';
import PageHeader from './page-header';
import SectionHeader from './section-header';
import Typography from './typography';
import Button from '../buttons/button';

const meta: Meta = {
  title: 'Primitives/Typography',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const TypographyVariants: StoryObj<typeof Typography> = {
  render: () => (
    <div className="max-w-4xl space-y-12">
      <section className="space-y-4">
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="h4">Heading 4</Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="lead">
          Lead: This is a prominent introductory text style for capturing attention.
        </Typography>
        <Typography variant="p">
          Paragraph: This is the standard body text style. It has a comfortable line height and
          appropriate margin for readability in longer blocks of text.
        </Typography>
        <Typography variant="large">Large: Slightly larger body text for emphasis.</Typography>
        <Typography variant="small">
          Small: Fine print, captions, or less important details.
        </Typography>
        <Typography variant="muted">
          Muted: De-emphasized text for secondary information.
        </Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="blockquote">
          &quot;This is a blockquote. It&apos;s used to highlight a specific piece of text or a
          quote from another source, often with a visual accent.&quot;
        </Typography>
        <Typography variant="code">const typography = &apos;is awesome&apos;;</Typography>
      </section>

      <section className="space-y-4">
        <Typography variant="h2">Special Variants</Typography>
        <div>
          <Typography variant="gradient" className="text-4xl md:text-6xl">
            Brand Gradient Text
          </Typography>
        </div>
        <p className="mt-4">
          You can use the <Typography variant="code">gradient</Typography> variant for high-impact
          headers that use the brand colors.
        </p>
      </section>
    </div>
  ),
};

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
