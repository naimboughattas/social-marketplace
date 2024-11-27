import { debounce } from './utils';

interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export async function searchCities(query: string): Promise<City[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&featuretype=city`,
      {
        headers: {
          'Accept-Language': 'fr',
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch cities');

    const data = await response.json();
    
    return data.map((item: any) => ({
      name: item.display_name.split(',')[0],
      country: item.display_name.split(',').slice(-1)[0].trim(),
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}