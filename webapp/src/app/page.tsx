"use server";

import { Chart } from "@/components/chart/tempAndHumidity";
import { createClient } from "@/lib/supabase";
import WeatherCard from "@/components/card/latestTempAndHumidity";
import { ToxicGasesChart } from "@/components/chart/airQuality";
import { PressureChart } from "@/components/chart/pressure";
import { Button } from "@/components/ui/button";

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
    <main className="flex flex-col justify-center p-10 space-y-5 relative">
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
      <Button className="sticky bottom-12 right-auto mr-auto w-12 h-12 rounded-full border-2 bg-white dark:bg-black" variant="link" asChild> 
        <a href="https://github.com/marcelo-schreiber/indoor-weather-logger" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white">
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        </a>
      </Button>
    </main>
  );
}
