import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// * CRON job that runs daily
export async function GET(req: NextRequest) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ ok: false });
  }

  // Create a Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Check if weather has at least one record
  const { data: weather, error } = await supabase.from("weather").select("*");

  if (error || !weather) {
    console.log("Error fetching weather data", error);
    return NextResponse.json({ ok: false });
  }

  // Calculate average temperature and humidity from view
  const { data: meanMeadian, error: meanMedianError } = await supabase
    .from("mean_median")
    .select("*");

  if (meanMedianError) {
    console.log("Error fetching mean median data", meanMedianError);
    return NextResponse.json({ ok: false });
  }

  const {
    mean_temperature,
    median_temperature,
    mean_humidity,
    median_humidity,
    mean_pressure,
    median_pressure,
    mean_air_quality,
    median_air_quality,
  } = meanMeadian[0];

  // Insert the calculated values into the database
  const { error: insertError } = await supabase.from("weather_daily").insert([
    {
      mean_temperature,
      median_temperature,
      mean_humidity,
      median_humidity,
      mean_pressure,
      median_pressure,
      mean_air_quality,
      median_air_quality,
    },
  ]);

  if (insertError) {
    console.log("Error inserting daily weather data", insertError);
    return NextResponse.json({ ok: false });
  }

  // Delete all records from the weather table
  const { error: deleteError } = await supabase
    .from("weather")
    .delete()
    .neq("temperature", "-999");

  if (deleteError) {
    console.log("Error deleting weather data", deleteError);
    return NextResponse.json({ ok: false });
  }

  return NextResponse.json({ ok: true });
}
