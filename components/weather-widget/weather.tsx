'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Air, Aqi, Humidity, Pressure, RealFeel } from './weather-icons';
import classes from './weather.module.css';
import { CONFIG, weatherInitialData } from '@/lib/weather-config';

function WeatherClient() {
  const [weather, setWeather] = useState<WeatherData>(weatherInitialData);

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          coords: { latitude, longitude },
        } = await getPosition();
        const lat =
          latitude?.toFixed(3) || process.env.NEXT_PUBLIC_DEFAULT_LATITUDE;
        const lon =
          longitude?.toFixed(3) || process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE;
        const language = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en';

        const response = await fetch(
          `/api/weather?latitude=${lat}&longitude=${lon}&language=${language}`,
        );
        const data = await response.json();

        if (data?.weather?.main && data?.airQuality?.data) {
          const { temp, feels_like, humidity, pressure } = data.weather.main;
          const { speed: wind } = data.weather.wind;
          const { description, icon } = data.weather.weather[0];
          const { name: location } = data.weather;
          const { aqi } = data.airQuality.data;

          setWeather({
            temperature: `${Math.floor(temp)}`,
            icon,
            feels: `${Math.floor(feels_like)}`,
            humidity: `${humidity}`,
            pressure: `${pressure}`,
            wind: `${wind}`,
            description,
            location,
            aqi,
          });
        } else {
          console.error('Error: Incomplete data received');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  async function getPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!CONFIG.trackLocation || !navigator.geolocation) {
        reject('Geolocation not available');
      }
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  return (
    <div className={classes.weatherWidget}>
      <Link href='https://nextjs-tanstack-weather-app.vercel.app/'>
        <div className={classes.cardm}>
          <div className={classes.card}>
            <div className={classes.weatherIcon}>
              <Image
                src={`/icons/3d/${weather.icon}.png`}
                alt=''
                width={72}
                height={72}
                priority
              />
            </div>
            <div className={classes.temperature}>
              <p>
                <span className={classes.darkfg}>{weather.temperature}°C</span>
              </p>
            </div>
            <div className={classes.location}>{weather.location}</div>
          </div>

          <div className={classes.card2}>
            <div className={classes.upper}>
              <div className={classes.humidity}>
                <div className={classes.humidityText}>
                  Humidity
                  <br />
                  <span className={classes.humidityId}>
                    {weather.humidity}%
                  </span>
                </div>
                <Humidity />
              </div>

              <div className={classes.air}>
                <div className={classes.airText}>
                  Wind
                  <br />
                  <span className={classes.windId}>{weather.wind} Km/h</span>
                </div>
                <Air />
              </div>
            </div>

            <div className={classes.lower}>
              <div className={classes.aqi}>
                <Aqi />
                <div className={classes.aqiText}>
                  AQI
                  <br />
                  <span className={classes.aqiInfo}>{weather.aqi}</span>
                </div>
              </div>

              <div className={classes.realFeel}>
                <RealFeel />
                <div className={classes.realFeelText}>
                  Feels Like
                  <br />
                  <span className={classes.feels}>{weather.feels}°C</span>
                </div>
              </div>

              <div className={classes.pressure}>
                <Pressure />
                <div className={classes.pressureText}>
                  Pressure
                  <br />
                  <span className={classes.pressure}>
                    {weather.pressure} mBar
                  </span>
                </div>
              </div>
              <div className={classes.description}>
                <p>{weather.description}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default WeatherClient;
