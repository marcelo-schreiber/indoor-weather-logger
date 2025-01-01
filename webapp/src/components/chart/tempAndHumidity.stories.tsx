import type { Meta, StoryObj } from "@storybook/react";

import { Chart } from "./tempAndHumidity";

const meta = {
  component: Chart,
} satisfies Meta<typeof Chart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    chartData: [
      { created_at: "2024-12-31T00:00:00Z", temperature: 22.5, humidity: 60 },
      { created_at: "2024-12-31T01:00:00Z", temperature: 22.7, humidity: 58 },
      { created_at: "2024-12-31T02:00:00Z", temperature: 22.3, humidity: 59 },
      { created_at: "2024-12-31T03:00:00Z", temperature: 22.8, humidity: 57 },
      { created_at: "2024-12-31T04:00:00Z", temperature: 23.0, humidity: 56 },
    ],
    dailyData: [
      { created_at: "2024-12-25", temperature: 21.5, humidity: 65 },
      { created_at: "2024-12-26", temperature: 22.0, humidity: 63 },
      { created_at: "2024-12-27", temperature: 22.2, humidity: 64 },
      { created_at: "2024-12-28", temperature: 22.8, humidity: 62 },
      { created_at: "2024-12-29", temperature: 23.1, humidity: 61 },
    ],
  },
};
