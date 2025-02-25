export const CONFIG: StartmenuWeatherConfig = {
  weatherIcons: '3d', // 'Onedark', 'Nord', 'Dark', 'White', '3d'
  weatherUnit: 'C', // 'F', 'C'
  trackLocation: true, // If false or an error occurs, the app will use the lat/lon below
};

export const weatherInitialData: WeatherData = {
  temperature: '-',
  icon: 'undefined',
  humidity: '-',
  wind: '-',
  aqi: '-',
  feels: '-',
  pressure: '-',
  location: 'Loading...',
  description: '-',
};
