export const API_CONFIG = {
  OPENWEATHER: {
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    API_KEY: process.env.WEATHER_API_KEY,
    DEFAULT_PARAMS: {
      lang: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE,
      units: 'metric',
      appid: process.env.WEATHER_API_KEY,
      long: process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE,
      lat: process.env.NEXT_PUBLIC_DEFAULT_LATITUDE,
    },
  },
  AIR_QUALITY: {
    BASE_URL: 'https://api.waqi.info',
    API_KEY: process.env.AQI_API_KEY,
  },
};
