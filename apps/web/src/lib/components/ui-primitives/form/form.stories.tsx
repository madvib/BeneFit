import type { Meta, StoryObj } from '@storybook/react';
import Input from './input';
import Select from './select';
import Checkbox from './checkbox';
import Label from './label';
import { FormSuccessMessage } from './form-success-message';

const meta: Meta = {
  title: 'Primitives/Form',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Inputs: StoryObj<typeof Input> = {
  render: () => (
    <div className="w-80 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email-default">Default Input</Label>
        <Input id="email-default" placeholder="name@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-disabled">Disabled Input</Label>
        <Input id="email-disabled" placeholder="name@example.com" disabled />
      </div>
    </div>
  ),
};

export const Selects: StoryObj<typeof Select> = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="role">Role Select</Label>
      <Select id="role">
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="guest">Guest</option>
      </Select>
    </div>
  ),
};

export const Checkboxes: StoryObj<typeof Checkbox> = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter" defaultChecked />
        <Label htmlFor="newsletter">Subscribe to newsletter</Label>
      </div>
    </div>
  ),
};

export const Labels: StoryObj<typeof Label> = {
  render: () => (
    <div className="space-y-2">
      <Label>Standard Label</Label>
      <Label className="text-primary font-bold italic">Custom Styled Label</Label>
    </div>
  ),
};

export const SuccessMessages: StoryObj<typeof FormSuccessMessage> = {
  render: () => (
    <div className="w-80">
      <FormSuccessMessage message="Everything looks good! Your changes have been saved." />
    </div>
  ),
};
