"use server";

import { Chart } from "@/components/chart/tempAndHumidity";
import { createClient } from "@/lib/supabase";
import WeatherCard from "@/components/card/latestTempAndHumidity";
import { ToxicGasesChart } from "@/components/chart/airQuality";
import { PressureChart } from "@/components/chart/pressure";

export default async function Home() {
  const supabase = await createClient();

  const [
    { data: allData, error: errorAllData },
    { data: dailyData, error: errorDailyData },
  ] = await Promise.all([
    supabase
      .from("weather")
      .select("*")
      .order("created_at", { ascending: true }),
    supabase
      .from("weather_daily_with_today")
      .select("*")
      .order("created_at", { ascending: true }),
  ]);

  if (errorAllData || errorDailyData) {
    console.error(errorAllData || errorDailyData);
    return <div>Erro ao carregar dados</div>;
  }

  const latestTempAndHumidity = allData[allData.length - 1];
  const meanTempAndHumidity = dailyData[dailyData.length - 1];

  return (
    <main className="flex flex-col justify-center px-10 pt-10">
      <Chart
        chartData={allData}
        dailyData={dailyData}
      />
      <ToxicGasesChart chartData={allData} dailyData={dailyData} />
      <PressureChart chartData={allData} dailyData={dailyData} />
      <div className="flex justify-center mt-10 gap-5 flex-col md:flex-row items-center">
        <WeatherCard
          title="Última Leitura"
          humidity={latestTempAndHumidity.humidity}
          pressure={latestTempAndHumidity.pressure}
          airQuality={latestTempAndHumidity.air_quality}
          temperature={latestTempAndHumidity.temperature}
          lastUpdated={latestTempAndHumidity.created_at}
        />
        <WeatherCard
          title="Leitura média do dia"
          humidity={meanTempAndHumidity.humidity}
          temperature={meanTempAndHumidity.temperature}
          airQuality={meanTempAndHumidity.air_quality}
          pressure={meanTempAndHumidity.pressure}
          lastUpdated={latestTempAndHumidity.created_at}
        />
      </div>
    </main>
  );
}
