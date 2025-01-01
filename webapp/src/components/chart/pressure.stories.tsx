import type { Meta, StoryObj } from '@storybook/react';

import { PressureChart } from './pressure';

const meta = {
  component: PressureChart,
} satisfies Meta<typeof PressureChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {args: {  chartData: [
  { created_at: "2024-12-31T00:00:00Z", pressure: 1013 },
  { created_at: "2024-12-31T01:00:00Z", pressure: 1012 },
  { created_at: "2024-12-31T02:00:00Z", pressure: 1011 },
  { created_at: "2024-12-31T03:00:00Z", pressure: 1013 },
  { created_at: "2024-12-31T04:00:00Z", pressure: 1014 },
],
dailyData: [
  { created_at: "2024-12-25", pressure: 1012 },
  { created_at: "2024-12-26", pressure: 1011 },
  { created_at: "2024-12-27", pressure: 1013 },
  { created_at: "2024-12-28", pressure: 1014 },
  { created_at: "2024-12-29", pressure: 1013 },
],}};