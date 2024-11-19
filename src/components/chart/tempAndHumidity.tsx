"use client";

import * as React from "react";
import {
  Area,
  CartesianGrid,
  XAxis,
  ComposedChart,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  temperature: {
    label: "Temperatura (°C)",
    color: "hsl(var(--chart-2))",
  },
  humidity: {
    label: "Umidade (%)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Chart({
  chartData,
}: {
  chartData: {
    created_at: string;
    humidity: number;
    temperature: number;
  }[];
}) {
  const [timeRange, setTimeRange] = React.useState("today");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.created_at);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (timeRange === "today") {
      return diff < 24 * 60 * 60 * 1000;
    } else if (timeRange === "7d") {
      return diff < 7 * 24 * 60 * 60 * 1000;
    } else if (timeRange === "all") {
      return true;
    }
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle> Temperatura e Umidade | Curitiba - PR</CardTitle>
          <CardDescription> Projeto do ramo estudantil IEEE </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Hoje" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="today" className="rounded-lg">
              Hoje
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Últimos 7 dias
            </SelectItem>
            <SelectItem value="all" className="rounded-lg">
              Todos
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ComposedChart data={filteredData}>
            <defs>
              <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-temperature)"
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-temperature)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillHumidity" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-humidity)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-humidity)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="created_at"
              tickLine={true}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                // just show the time
                return new Date(value).toLocaleTimeString("pt-BR");
              }}
            />
            <YAxis
              tickLine={false}
              yAxisId="left"
              axisLine={{ stroke: "#f5f5f5" }}
              unit="%"
              domain={[0, 100]}
              tickCount={5}
            />
            <YAxis
              tickLine={false}
              yAxisId="right"
              orientation="right"
              stroke="#3B7AD9"
              axisLine={{ stroke: "#f5f5f5" }}
              unit="°C"
              domain={[0, 40]}
              tickCount={5}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="humidity"
              type="natural"
              fill="url(#fillHumidity)"
              stroke="var(--color-humidity)"
              yAxisId="left"
            />
            <Area
              dataKey="temperature"
              type="natural"
              fill="url(#fillTemperature)"
              stroke="var(--color-temperature)"
              yAxisId="right"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
