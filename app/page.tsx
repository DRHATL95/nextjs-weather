"use client";

import { useState } from "react";
import Image from "next/image";
import { WeatherResponse } from "@/utils/types";

async function getWeatherForZipCode(
  zipCode: string,
  setWeather: (weather: WeatherResponse | null) => void
) {
  if (zipCode === "") {
    console.error("Zip code not set");
    return;
  }

  if (zipCode.length !== 5) {
    console.error("Zip code must be 5 digits");
    return;
  }

  if (isNaN(parseInt(zipCode))) {
    console.error("Zip code must be a number");
    return;
  }

  const request = await fetch("/api/weather?zipCode=" + zipCode);

  if (!request.ok) {
    console.error("Weather API request failed");
    setWeather(null);
    return;
  }

  try {
    const response: WeatherResponse = await request.json();
    setWeather(response);
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    setWeather(null);
  }
}

function convertCelciusToFahrenheit(celcius: number | undefined): number {
  if (celcius === undefined) {
    return 0;
  }

  return Math.round((celcius * 9) / 5 + 32);
}

export default function Home() {
  const [zipCode, setZipCode] = useState("");
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [isCelcius, setIsCelcius] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Weather App</h1>
          <p>Enter a zip code to get the weather</p>
        </div>
        <div className="flex flex-col gap-4 items-center w-full">
          <div className="flex gap-4 items-center w-full">
            <input
              className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Enter Zip Code"
              onChange={(e) => setZipCode(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
              onClick={() => getWeatherForZipCode(zipCode, setWeather)}
            >
              Get Weather
            </button>
          </div>
          {weather && (
            <div className="flex flex-col gap-4 items-center border border-gray-300 p-4 rounded w-full">
              <p>
                {weather.location.name}, {weather.location.region}
              </p>
              {weather.current.condition && (
                <div className="flex flex-col items-center">
                  <Image
                    src={`https:${weather.current.condition.icon}`}
                    alt={weather.current.condition.text}
                    width={50}
                    height={50}
                  />
                  <p>{weather.current.condition.text}</p>
                </div>
              )}
              <p
                className="cursor-pointer"
                onClick={() => setIsCelcius(!isCelcius)}
              >
                {isCelcius
                  ? weather.current.temp_c + " °C"
                  : convertCelciusToFahrenheit(weather.current.temp_c) + " °F"}
              </p>
              <p>Wind: {weather.current.wind_kph} kph</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}