'use server';

import { Chart } from "@/components/chart/tempAndHumidity";
import { createClient } from '@/lib/supabase';

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('weather_view').select('*').order('created_at', { ascending: true });

  if (error) {
    console.error(error);
    return <div>Erro ao carregar dados</div>;
  }

  return (
    <main className="flex flex-col justify-center px-10 pt-10">
      <Chart chartData={data as { created_at: string; temperature: number; humidity: number }[]} />
    </main>
  );
}
