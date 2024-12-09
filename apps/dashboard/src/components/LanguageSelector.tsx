import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Globe } from 'lucide-react';
import { cn } from '../lib/utils';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' }
];

export default function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>{currentLanguage?.flag}</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-1 w-48"
          sideOffset={5}
        >
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                className={cn(
                  'flex items-center space-x-2 w-full px-4 py-2 text-sm text-left rounded-lg',
                  selectedLanguage === language.code
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
                onClick={() => setSelectedLanguage(language.code)}
              >
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </button>
            ))}
          </div>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}