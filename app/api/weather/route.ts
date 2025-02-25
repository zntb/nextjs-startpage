import { NextResponse } from 'next/server';
import { API_CONFIG } from './config';

const openWeatherBaseUrl = API_CONFIG.OPENWEATHER.BASE_URL;
const aqiBaseUrl = API_CONFIG.AIR_QUALITY.BASE_URL;
const weatherApiKey = API_CONFIG.OPENWEATHER.API_KEY;
const airApiKey = API_CONFIG.AIR_QUALITY.API_KEY;
const defaultLatitude = API_CONFIG.OPENWEATHER.DEFAULT_PARAMS.lat;
const defaultLongitude = API_CONFIG.OPENWEATHER.DEFAULT_PARAMS.long;
const defaultLanguage = API_CONFIG.OPENWEATHER.DEFAULT_PARAMS.lang;

console.log(
  `Weather API URL: ${openWeatherBaseUrl}/weather?lat=${defaultLatitude}&lon=${defaultLongitude}&lang=${defaultLanguage}&appid=${weatherApiKey}`,
);

export async function GET(request: Request) {
  if (!weatherApiKey || !airApiKey) {
    return NextResponse.json(
      { error: 'API keys are missing' },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get('latitude') || defaultLatitude;
  const longitude = searchParams.get('longitude') || defaultLongitude;
  const language = searchParams.get('language') || defaultLanguage;

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: 'Location data is missing' },
      { status: 400 },
    );
  }

  try {
    const weatherResponse = await fetch(
      `${openWeatherBaseUrl}/weather?lat=${latitude}&lon=${longitude}&lang=${language}&units=metric&appid=${weatherApiKey}`,
    );
    const weatherData = await weatherResponse.json();

    // console.log('weather data: ', weatherData);

    const airQualityResponse = await fetch(
      `${aqiBaseUrl}/feed/geo:${latitude};${longitude}/?token=${airApiKey}`,
    );
    const airQualityData = await airQualityResponse.json();

    // console.log('aqi data: ', airQualityData);

    return NextResponse.json({
      weather: weatherData,
      airQuality: airQualityData,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 },
    );
  }
}
