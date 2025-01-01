import type { Meta, StoryObj } from '@storybook/react';

import { ToxicGasesChart } from './airQuality';

const meta = {
  component: ToxicGasesChart,
} satisfies Meta<typeof ToxicGasesChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    chartData: [
      { created_at: "2024-12-31T00:00:00Z", air_quality: 200 },
      { created_at: "2024-12-31T01:00:00Z", air_quality: 450 },
      { created_at: "2024-12-31T02:00:00Z", air_quality: 320 },
      { created_at: "2024-12-31T03:00:00Z", air_quality: 500 },
      { created_at: "2024-12-31T04:00:00Z", air_quality: 700 },
    ],
    dailyData: [
      { created_at: "2024-12-25", air_quality: 300 },
      { created_at: "2024-12-26", air_quality: 400 },
      { created_at: "2024-12-27", air_quality: 500 },
      { created_at: "2024-12-28", air_quality: 350 },
      { created_at: "2024-12-29", air_quality: 450 },
    ],
  }
};