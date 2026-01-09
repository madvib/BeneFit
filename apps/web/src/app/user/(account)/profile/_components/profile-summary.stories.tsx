import type { Meta, StoryObj } from '@storybook/react';
import ProfileSummary from './profile-summary';

const meta: Meta<typeof ProfileSummary> = {
  title: 'Pages/Account/Profile/ProfileSummary',
  component: ProfileSummary,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-2xl p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProfileSummary>;

export const HeaderStates: Story = {
  name: 'Profile Header Examples',
  render: () => (
    <div className="space-y-12">
      {/* Default User */}
      <div className="border-b pb-8">
        <ProfileSummary
          name="Alex Johnson"
          bio="Fitness enthusiast | Marathon runner | Strength training advocate"
          totalWorkouts={127}
          currentStreak={12}
          totalAchievements={8}
          onEditPicture={() => console.log('Edit picture')}
        />
        <p className="text-muted-foreground mt-4 text-center text-sm">Standard User</p>
      </div>

      {/* New User */}
      <div className="border-b pb-8">
        <ProfileSummary
          name="Jamie Smith"
          bio="Just started my fitness journey!"
          totalWorkouts={3}
          currentStreak={2}
          totalAchievements={0}
          onEditPicture={() => console.log('Edit picture')}
        />
        <p className="text-muted-foreground mt-4 text-center text-sm">New User (Low Stats)</p>
      </div>

      {/* Pro User */}
      <div>
        <ProfileSummary
          name="Morgan Taylor"
          bio="Certified personal trainer | Nutrition coach | Helping others achieve their goals"
          totalWorkouts={1247}
          currentStreak={365}
          totalAchievements={42}
          onEditPicture={() => console.log('Edit picture')}
        />
        <p className="text-muted-foreground mt-4 text-center text-sm">Pro User (High Stats)</p>
      </div>
    </div>
  ),
};
