"use server";

import { Chart } from "@/components/chart/tempAndHumidity";
import { createClient } from "@/lib/supabase";
import WeatherCard from "@/components/card/latestTempAndHumidity";
export default async function Home() {
  const supabase = await createClient();

  const { data: allData, error: errorAllData } = await supabase
    .from("weather_view")
    .select("*")
    .order("created_at", { ascending: true });

  const { data: dailyData, error: errorDailyData } = await supabase
    .from("weather_daily_with_today")
    .select("*")
    .order("created_at", { ascending: true });

  if (errorAllData || errorDailyData) {
    console.error(errorAllData || errorDailyData);
    return <div>Erro ao carregar dados</div>;
  }

  const latestTempAndHumidity = allData[allData.length - 1];
  const meanTempAndHumidity = dailyData[dailyData.length - 1];

  return (
    <main className="flex flex-col justify-center px-10 pt-10">
      <Chart
        chartData={
          allData as {
            created_at: string;
            temperature: number;
            humidity: number;
          }[]
        }
        dailyData={
          dailyData as {
            created_at: string;
            temperature: number;
            humidity: number;
          }[]
        }
      />
      <div className="flex justify-center mt-10 gap-5">
        <WeatherCard
          title="Última Leitura"
          humidity={latestTempAndHumidity.humidity}
          temperature={latestTempAndHumidity.temperature}
          lastUpdated={latestTempAndHumidity.created_at}
        />
        <WeatherCard
          title="Leitura média"
          humidity={meanTempAndHumidity.humidity}
          temperature={meanTempAndHumidity.temperature}
          lastUpdated={latestTempAndHumidity.created_at}
        />
      </div>
    </main>
  );
}
