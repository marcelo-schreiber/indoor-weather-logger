import type { Meta, StoryObj } from "@storybook/react";

import LatestTempAndHumidity from "./latestTempAndHumidity";

const meta = {
  component: LatestTempAndHumidity,
} satisfies Meta<typeof LatestTempAndHumidity>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    airQuality: 120,
    temperature: 22.5,
    title: "Latest Temperature or Mean Temperature of the Day",
    humidity: 60,
    lastUpdated: "2024-12-31T00:00:00Z",
    pressure: 1013,
  },
};
