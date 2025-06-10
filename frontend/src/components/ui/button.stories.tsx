// src/components/ui/button.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button'; // Import YOUR button

// This is the metadata for your component
const meta: Meta<typeof Button> = {
  title: 'UI/Button',         // How it will be organized in the Storybook sidebar
  component: Button,          // The component itself
  parameters: {
    layout: 'centered',     // Centers the component in the Storybook canvas
  },
  tags: ['autodocs'],         // Enables automatic documentation generation
  argTypes: {                 // This section describes the component's props (args)
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'The visual style of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'The size of the button',
    },
    children: {
      control: 'text',
      description: 'The content inside the button (e.g., text)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// This is the "Default" story or variant of your button
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: "Click Me!",
  },
};

// You can create more stories for different states
export const Destructive: Story = {
  args: {
    ...Default.args, // Copy args from the Default story
    variant: 'destructive',
    children: 'Delete Item',
  },
};

export const Outline: Story = {
  args: {
    ...Default.args,
    variant: 'outline',
    children: 'Learn More',
  },
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: 'lg',
    children: 'Get Started',
  },
};