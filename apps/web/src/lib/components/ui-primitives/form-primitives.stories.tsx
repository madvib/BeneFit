import type { Meta, StoryObj } from '@storybook/react';
import Input from './form/input';
import Select from './form/select';
import Checkbox from './form/checkbox';
import Label from './form/label';
import FormSection from './form/form-section';
import { FormSuccessMessage } from './form/form-success-message';

const meta: Meta = {
  title: 'Components/Primitives/Form',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const TextInput: StoryObj<typeof Input> = {
  render: () => (
    <div className="w-64 space-y-2">
      <Label htmlFor="email">Email Address</Label>
      <Input id="email" placeholder="name@example.com" />
    </div>
  ),
};

export const SelectInput: StoryObj<typeof Select> = {
  render: () => (
    <div className="w-64 space-y-2">
      <Label htmlFor="role">Role</Label>
      <Select id="role">
        <option value="admin">Admin</option>
        <option value="user">User</option>
        <option value="guest">Guest</option>
      </Select>
    </div>
  ),
};

export const CheckboxInput: StoryObj<typeof Checkbox> = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const Section: StoryObj<typeof FormSection> = {
  render: () => (
    <div className="w-96 rounded-lg border p-4">
      <FormSection title="Personal Information" description="Please enter your details below.">
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input placeholder="John Doe" />
          </div>
        </div>
      </FormSection>
    </div>
  ),
};

export const SuccessMessage: StoryObj<typeof FormSuccessMessage> = {
  render: () => <FormSuccessMessage message="Profile updated successfully!" />,
};
