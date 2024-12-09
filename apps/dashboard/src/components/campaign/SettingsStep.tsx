import Input from '../Input';
import { CATEGORIES, LANGUAGES, COUNTRIES, Service } from '../../lib/types';

interface Settings {
  category: string;
  country: string;
  city: string;
  language: string;
  quantity: number;
  maxCostPerInteraction: number;
  budget: number;
}

interface SettingsStepProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  service: Service;
}

const COST_LABELS = {
  follow: 'follow',
  like: 'like',
  comment: 'commentaire',
  repost_story: 'repost'
};

export default function SettingsStep({
  settings,
  onSettingsChange,
  service
}: SettingsStepProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Paramètres de recherche</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Catégorie
          </label>
          <select
            value={settings.category}
            onChange={(e) => onSettingsChange({ ...settings, category: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pays
          </label>
          <select
            value={settings.country}
            onChange={(e) => onSettingsChange({ ...settings, country: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">Tous les pays</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ville
          </label>
          <select
            value={settings.city}
            onChange={(e) => onSettingsChange({ ...settings, city: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">Toutes les villes</option>
            <option value="Paris">Paris</option>
            <option value="Lyon">Lyon</option>
            <option value="Marseille">Marseille</option>
            <option value="Bordeaux">Bordeaux</option>
            <option value="Lille">Lille</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Langue
          </label>
          <select
            value={settings.language}
            onChange={(e) => onSettingsChange({ ...settings, language: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">Toutes les langues</option>
            {LANGUAGES.map((language) => (
              <option key={language} value={language}>{language}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre d'influenceurs
          </label>
          <Input
            type="number"
            value={settings.quantity.toString()}
            onChange={(e) => onSettingsChange({
              ...settings,
              quantity: Math.max(1, parseInt(e.target.value) || 1)
            })}
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Coût maximum par {COST_LABELS[service]} (€)
          </label>
          <Input
            type="number"
            value={settings.maxCostPerInteraction.toString()}
            onChange={(e) => onSettingsChange({
              ...settings,
              maxCostPerInteraction: Math.max(0, parseFloat(e.target.value) || 0)
            })}
            min="0"
            step="0.1"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Seuls les influenceurs proposant ce service à un prix inférieur ou égal seront contactés
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Budget maximum total (€)
          </label>
          <Input
            type="number"
            value={settings.budget.toString()}
            onChange={(e) => onSettingsChange({
              ...settings,
              budget: Math.max(1, parseInt(e.target.value) || 1)
            })}
            min="1"
            required
          />
        </div>
      </div>
    </div>
  );
}