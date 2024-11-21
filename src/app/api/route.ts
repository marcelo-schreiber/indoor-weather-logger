import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (request.headers.get("content-type") !== "application/json") {
    return new Response("Invalid content type", { status: 400 });
  }

  if (!request.body) {
    return new Response("Invalid request", { status: 400 });
  }

  const body = await request.json();

  const { temperature, humidity, apiKey } = body;

  if (apiKey !== process.env.API_KEY) {
    return new Response("Invalid API key", { status: 401 });
  }

  if (!temperature || !humidity) {
    return new Response("Invalid request", { status: 400 });
  }

  if (typeof temperature !== "number" || typeof humidity !== "number") {
    return new Response("Invalid request", { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error } = await supabase.from("weather").insert([
    {
      temperature,
      humidity,
    },
  ]);

  if (error) {
    return new Response("An error occurred", { status: 500 });
  }

  return new Response("Success", { status: 200 });
}
