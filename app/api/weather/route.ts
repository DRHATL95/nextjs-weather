import { WeatherResponse } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

const WEATHER_API_BASE = "http://api.weatherapi.com/v1";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const zipCode = searchParams.get("zipCode");

  if (!zipCode) {
    return new NextResponse('Zip code not set', { status: 400 });
  }

  if (!process.env.WEATHER_API_KEY) {
    return new NextResponse('Weather API key not set', { status: 500 });
  }

  const response = await fetch(
    `${WEATHER_API_BASE}/current.json?key=${process.env.WEATHER_API_KEY}&q=${zipCode}`
  );

  if (!response.ok) {
    return new NextResponse('Weather API request failed', { status: 500 });
  }

  const data: WeatherResponse = await response.json();

  return new NextResponse(JSON.stringify(data), { status: 200 });
}