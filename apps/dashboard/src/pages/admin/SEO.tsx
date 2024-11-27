import { useState } from 'react';
import { Tab } from '@headlessui/react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, Title, TextInput, Select, SelectItem } from '@tremor/react';
import { Search, Globe, Link as LinkIcon, Edit2 } from 'lucide-react';
import Button from '../../components/Button';
import { cn } from '../../lib/utils';

interface SEOPage {
  id: string;
  path: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  lastModified: Date;
}

interface Redirect {
  id: string;
  from: string;
  to: string;
  type: 301 | 302;
  enabled: boolean;
  createdAt: Date;
}

const mockPages: SEOPage[] = [
  {
    id: '1',
    path: '/',
    title: 'SocialBoost - Plateforme de Marketing d\'Influence',
    description: 'Connectez-vous avec des influenceurs vérifiés et boostez votre présence sur les réseaux sociaux.',
    keywords: ['marketing influence', 'influenceurs', 'réseaux sociaux'],
    lastModified: new Date()
  }
];

const mockRedirects: Redirect[] = [
  {
    id: '1',
    from: '/old-path',
    to: '/new-path',
    type: 301,
    enabled: true,
    createdAt: new Date()
  }
];

export default function AdminSEO() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [pages] = useState(mockPages);
  const [redirects] = useState(mockRedirects);
  const [search, setSearch] = useState('');
  const [editingPage, setEditingPage] = useState<SEOPage | null>(null);

  const handleSavePage = (page: SEOPage) => {
    // Save page logic here
    setEditingPage(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Title>SEO</Title>
          <div className="flex space-x-4">
            <TextInput
              icon={Search}
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-purple-100 p-1">
            <Tab
              className={({ selected }) =>
                cn(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-purple-700 shadow'
                    : 'text-purple-600 hover:bg-white/[0.12] hover:text-purple-800'
                )
              }
            >
              Pages
            </Tab>
            <Tab
              className={({ selected }) =>
                cn(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-purple-700 shadow'
                    : 'text-purple-600 hover:bg-white/[0.12] hover:text-purple-800'
                )
              }
            >
              Redirections
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-4">
            {/* Pages */}
            <Tab.Panel>
              <Card>
                <div className="space-y-4">
                  {pages.map((page) => (
                    <div
                      key={page.id}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <h3 className="font-medium text-gray-900">
                              {page.path}
                            </h3>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {page.title}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPage(page)}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Description</p>
                          <p className="mt-1">{page.description}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Mots-clés</p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {page.keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Tab.Panel>

            {/* Redirections */}
            <Tab.Panel>
              <Card>
                <div className="space-y-4">
                  {redirects.map((redirect) => (
                    <div
                      key={redirect.id}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                          <LinkIcon className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {redirect.from}
                            </p>
                            <p className="text-sm text-gray-500">
                              → {redirect.to}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            redirect.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          )}>
                            {redirect.type}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            Modifier
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {/* Modal d'édition de page */}
        {editingPage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items- center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Modifier la page {editingPage.path}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Titre
                  </label>
                  <TextInput
                    value={editingPage.title}
                    onChange={() => {}}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <TextInput
                    value={editingPage.description}
                    onChange={() => {}}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mots-clés
                  </label>
                  <div className="space-y-2">
                    {editingPage.keywords.map((keyword, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <TextInput
                          value={keyword}
                          onChange={() => {}}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {}}
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {}}
                    >
                      Ajouter un mot-clé
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image OG
                  </label>
                  <TextInput
                    value={editingPage.ogImage || ''}
                    onChange={() => {}}
                    placeholder="URL de l'image"
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setEditingPage(null)}
                  >
                    Annuler
                  </Button>
                  <Button onClick={() => handleSavePage(editingPage)}>
                    Enregistrer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}