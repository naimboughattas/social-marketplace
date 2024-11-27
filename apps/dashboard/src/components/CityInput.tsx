import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { searchCities } from '../lib/cities';
import { useDebounce } from '../lib/utils';

interface CityInputProps {
  value: string;
  onSelect: (city: string, country: string) => void;
  className?: string;
}

export default function CityInput({ value, onSelect, className }: CityInputProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Array<{ name: string; country: string }>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length >= 2) {
        const cities = await searchCities(debouncedQuery);
        setSuggestions(cities);
        setIsOpen(true);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: { name: string; country: string }) => {
    setQuery(city.name);
    onSelect(city.name, city.country);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          className={`w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
          placeholder="Entrez une ville..."
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {suggestions.map((city, index) => (
            <li
              key={index}
              className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-purple-50"
              onClick={() => handleSelect(city)}
            >
              <div className="flex items-center">
                <span className="font-normal">{city.name}</span>
                <span className="ml-2 text-xs text-gray-500">{city.country}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}