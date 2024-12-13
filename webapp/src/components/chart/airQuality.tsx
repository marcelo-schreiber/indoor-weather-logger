"use client";

import * as React from "react";
import { Area, CartesianGrid, XAxis, ComposedChart, YAxis } from "recharts";

import {
  Card,
  CardContent,
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
  air_quality: {
    label: "Gases toxicos (ppm)",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function ToxicGasesChart({
  chartData,
  dailyData,
}: {
  chartData: {
    created_at: string;
    air_quality: number;
  }[];
  dailyData: {
    created_at: string;
    air_quality: number;
  }[];
}) {
  const [timeRange, setTimeRange] = React.useState("today");

  const filteredData = React.useMemo(() => {
    switch (timeRange) {
      case "today":
        return chartData;
      case "daily":
        return dailyData;
    }
  }, [timeRange, chartData, dailyData]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Gases tóxicos | Curitiba - PR</CardTitle>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Today" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="today" className="rounded-lg">
              Hoje
            </SelectItem>
            <SelectItem value="daily" className="rounded-lg">
              Média diária
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-4 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ComposedChart data={filteredData}>
            <defs>
              <linearGradient id="fillToxicGases" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-air_quality)"
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-air_quality)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="created_at"
              tickLine={true}
              axisLine={false}
              tickMargin={5}
              minTickGap={25}
              tickFormatter={(value) => {
                if (timeRange === "today") {
                  return new Date(value).toLocaleTimeString("pt-BR", {
                    hour: "numeric",
                    minute: "numeric",
                  });
                }

                return new Date(value).toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: "#f5f5f5" }}
              unit="ppm"
              domain={[0, 1000]}
              tickCount={5}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    });
                  }}
                  formatter={(value, name) => {
                    return (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                          style={
                            {
                              "--color-bg": `var(--color-${name})`,
                            } as React.CSSProperties
                          }
                        />
                        {chartConfig[name as keyof typeof chartConfig]?.label ||
                          name}
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          {Number(value).toFixed(2)}
                        </div>
                      </>
                    );
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="air_quality"
              type="natural"
              fill="url(#fillToxicGases)"
              stroke="var(--color-air_quality)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

