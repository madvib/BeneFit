import type { Meta, StoryObj } from '@storybook/react';
import CheckInModal from './check-in-modal';

const meta: Meta<typeof CheckInModal> = {
  title: 'Pages/Coach/CheckInModal',
  component: CheckInModal,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof CheckInModal>;

// --- Mock Data ---

const ROUTINE_CHECK_IN = {
  id: 'checkin-1',
  question: 'How are you feeling about your progress this week?',
};

const TRIGGERED_CHECK_IN = {
  id: 'checkin-2',
  question: 'I noticed you skipped your last two workouts. Is everything okay?',
  triggeredBy: 'Missed Workouts',
};

const ENERGY_CHECK_IN = {
  id: 'checkin-3',
  question: 'On a scale of 1-10, how would you rate your energy levels today?',
  triggeredBy: 'Daily Check-In',
};

// --- Stories ---

import { CheckInContent } from './check-in-modal';

// ... (Imports and mock data remain)

export const Gallery: Story = {
  name: 'All Variants (Gallery)',
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="bg-card rounded-lg border shadow-sm">
        <CheckInContent
          checkIn={ROUTINE_CHECK_IN}
          isOpen={true}
          onRespond={() => {}}
          onDismiss={() => {}}
          isLoading={false}
          response=""
          setResponse={() => {}}
        />
      </div>
      <div className="bg-card rounded-lg border shadow-sm">
        <CheckInContent
          checkIn={TRIGGERED_CHECK_IN}
          isOpen={true}
          onRespond={() => {}}
          onDismiss={() => {}}
          isLoading={false}
          response="I've been feeling a bit under the weather."
          setResponse={() => {}}
        />
      </div>
      <div className="bg-card rounded-lg border shadow-sm">
        <CheckInContent
          checkIn={ENERGY_CHECK_IN}
          isOpen={true}
          onRespond={() => {}}
          onDismiss={() => {}}
          isLoading={true}
          response="8"
          setResponse={() => {}}
        />
      </div>
    </div>
  ),
};

export const Default: Story = {
  name: 'Interactive Modal',
  args: {
    checkIn: ROUTINE_CHECK_IN,
    isOpen: true,
    onRespond: async (checkInId: string, response: string) => {
      console.log('Response submitted:', { checkInId, response });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onDismiss: (checkInId: string) => console.log('Dismissed:', checkInId),
    isLoading: false,
  },
};
