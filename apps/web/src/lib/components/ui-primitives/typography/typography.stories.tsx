import type { Meta, StoryObj } from '@storybook/react';
import { ChevronRight } from 'lucide-react';
import PageHeader from './page-header';
import SectionHeader from './section-header';
import Button from '../buttons/button';
import { typography, getTypography } from '@/lib/components/theme/typography';

const meta: Meta = {
  title: 'Primitives/Typography',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

/**
 * Comprehensive showcase of all typography variants and usage patterns.
 * Typography constants provide consistent, themeable text styles across the app.
 */
export const Showcase: StoryObj = {
  render: () => (
    <div className="max-w-4xl space-y-16">
      {/* Semantic Headings */}
      <section className="space-y-4">
        <h2 className={typography.h2}>Semantic Headings</h2>
        <p className={typography.muted}>
          Use semantic HTML elements with typography constants for proper document structure.
        </p>
        <div className="space-y-3">
          <h1 className={typography.h1}>Heading 1 - Main Page Title</h1>
          <h2 className={typography.h2}>Heading 2 - Section Title</h2>
          <h3 className={typography.h3}>Heading 3 - Subsection Title</h3>
          <h4 className={typography.h4}>Heading 4 - Minor Heading</h4>
        </div>
      </section>

      {/* Body Text */}
      <section className="space-y-4">
        <h2 className={typography.h2}>Body Text Styles</h2>
        <div className="space-y-3">
          <p className={typography.lead}>
            Lead: Prominent introductory text for capturing attention and setting context.
          </p>
          <p className={typography.p}>
            Paragraph: Standard body text with comfortable line height for readability in longer
            blocks of content.
          </p>
          <p className={typography.large}>Large: Slightly larger body text for emphasis.</p>
          <p className={typography.pBold}>
            Bold paragraph for strong emphasis within body content.
          </p>
          <p className={typography.small}>
            Small: Fine print, captions, or less important details.
          </p>
          <p className={typography.muted}>Muted: De-emphasized text for secondary information.</p>
          <p className={typography.xs}>Extra small: Metadata, labels, or tertiary information.</p>
        </div>
      </section>

      {/* Special Styles */}
      <section className="space-y-4">
        <h2 className={typography.h2}>Special Text Styles</h2>
        <div className="space-y-4">
          <blockquote className={typography.blockquote}>
            &quot;This is a blockquote. It&apos;s used to highlight quotes or callouts with a
            visual accent.&quot;
          </blockquote>
          <div>
            Inline code:{' '}
            <code className={typography.code}>const typography = &apos;awesome&apos;;</code>
          </div>
          <ul className={typography.list}>
            <li>List item one</li>
            <li>List item two</li>
            <li>List item three</li>
          </ul>
        </div>
      </section>

      {/* Branded Display */}
      <section className="space-y-4">
        <h2 className={typography.h2}>Branded Display Styles</h2>
        <p className={typography.muted}>
          High-impact, italicized display text for hero sections and feature highlights.
        </p>
        <div className="space-y-4">
          <div className={typography.displayXl}>Display XL - Hero Text</div>
          <div className={typography.displayLg}>Display Large - Feature Heading</div>
          <div className={typography.displayMd}>Display Medium - Card Title</div>
          <div className={typography.displaySm}>Display Small - Label</div>
        </div>
      </section>

      {/* Composition */}
      <section className="space-y-4">
        <h2 className={typography.h2}>Composition with Utilities</h2>
        <p className={typography.muted}>
          Combine typography constants with layout utilities using template literals or the helper
          function.
        </p>
        <div className="space-y-6">
          <div>
            <h3 className={typography.h3}>Template Literal Composition</h3>
            <h1 className={`${typography.h1} mt-4 text-center`}>Centered Heading</h1>
            <p className={`${typography.p} mx-auto max-w-prose text-center`}>
              Centered paragraph with max width and auto margins.
            </p>
          </div>
          <div>
            <h3 className={typography.h3}>Helper Function</h3>
            <h1 className={getTypography('h1', 'mt-4 text-center')}>Using getTypography()</h1>
            <p className={getTypography('p', 'mx-auto max-w-prose text-center')}>
              The getTypography helper makes composition cleaner and more readable.
            </p>
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="space-y-4">
        <h2 className={typography.h2}>Typography Components</h2>
        <p className={typography.muted}>
          PageHeader and SectionHeader components use typography constants internally.
        </p>
        <div className="space-y-8">
          <PageHeader
            title="Page Title"
            description="This is a description that provides context about the page content."
          />
          <div className="bg-border h-px" />
          <SectionHeader
            title="Section with Action"
            description="A section header can also have a description."
            action={
              <Button variant="link" className={`p-0 ${typography.small}`}>
                View All <ChevronRight size={16} />
              </Button>
            }
          />
        </div>
      </section>
    </div>
  ),
};
