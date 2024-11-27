import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Input from './Input';
import { useNotifications } from '../lib/notifications';

interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
  region: string;
}

interface AddressAutocompleteProps {
  onSelect: (address: Address) => void;
}

export default function AddressAutocomplete({ onSelect }: AddressAutocompleteProps) {
  const { addNotification } = useNotifications();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchAddress = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&type=housenumber&limit=5`,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la recherche d\'adresse');
        }

        const data = await response.json();
        
        if (!data.features || !Array.isArray(data.features)) {
          throw new Error('Format de réponse invalide');
        }

        const addresses: Address[] = data.features
          .filter((feature: any) => 
            feature.properties &&
            feature.properties.name &&
            feature.properties.city &&
            feature.properties.postcode &&
            feature.properties.context
          )
          .map((feature: any) => ({
            street: feature.properties.name,
            city: feature.properties.city,
            zipCode: feature.properties.postcode,
            country: 'France',
            region: feature.properties.context.split(',')[1]?.trim() || 'France',
          }));

        setSuggestions(addresses);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        addNotification({
          type: 'error',
          message: 'Impossible de récupérer les suggestions d\'adresses'
        });
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchAddress, 300);
    return () => clearTimeout(timeoutId);
  }, [query, addNotification]);

  const handleSelect = (address: Address) => {
    setQuery(`${address.street}, ${address.zipCode} ${address.city}`);
    setShowSuggestions(false);
    onSelect(address);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Input
          label="Rechercher une adresse"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Commencez à taper une adresse..."
          className="pl-10"
        />
        <div className="absolute left-3 top-9">
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {suggestions.map((address, index) => (
            <li
              key={index}
              className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-purple-50"
              onClick={() => handleSelect(address)}
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">
                  {address.street}
                </span>
                <span className="text-sm text-gray-500">
                  {address.zipCode} {address.city}, {address.region}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}