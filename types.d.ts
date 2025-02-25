declare type DropdownContent = {
  category: string;
  links: {
    id: string;
    url: string;
    title: string;
  }[];
}[];

declare type WeatherConfig = {
  weatherIcons: string;
  weatherUnit: string;
  trackLocation: boolean;
};

declare type FooterItems = {
  url: string;
  title: string;
};

declare type WeatherData = {
  temperature: string;
  icon: string;
  feels: string;
  humidity: string;
  pressure: string;
  wind: string;
  aqi: string;
  location: string;
  description: string;
};

declare namespace JSX {
  interface IntrinsicElements {
    fegaussianblur: React.SVGProps<SVGFEDropShadowElement>;
    femerge: React.SVGProps<SVGFEDropShadowElement>;
    femergenode: React.SVGProps<SVGFEDropShadowElement>;
  }
}
