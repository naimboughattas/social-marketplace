import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import Button from "../components/Button";
import AccountCard from "../components/AccountCard";
import AccountSettingsModal from "../components/AccountSettingsModal";
import {
  Platform,
  PLATFORMS,
  PLATFORM_LABELS,
  CATEGORIES,
  LANGUAGES,
  COUNTRIES,
} from "../lib/types";
import DashboardLayout from "../components/DashboardLayout";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "../lib/utils";
import { useAccounts } from "../lib/hooks/useAccounts";

type Tab = "all" | "verified" | "pending";

interface Filters {
  platform: Platform | "all";
  category: string;
  language: string;
  country: string;
}

export default function MyAccounts() {
  const {
    accounts,
    loading: isFetching,
    error,
    handleCreateAccount,
    handleUpdateAccount,
    handleDeleteAccount,
  } = useAccounts();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [currentTab, setCurrentTab] = useState<Tab>("all");
  const [filters, setFilters] = useState<Filters>({
    platform: "all",
    category: "",
    language: "",
    country: "",
  });

  const filteredAccounts = accounts.filter((account) => {
    // Filtrer par onglet
    if (currentTab === "verified" && !account.isVerified) return false;
    if (currentTab === "pending" && account.isVerified) return false;

    // Filtrer par recherche
    if (
      search &&
      !account.username.toLowerCase().includes(search.toLowerCase()) &&
      !account.displayName.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    // Filtrer par critères
    if (filters.platform !== "all" && account.platform !== filters.platform)
      return false;
    if (filters.category && account.category !== filters.category) return false;
    if (filters.language && account.language !== filters.language) return false;
    if (filters.country && account.country !== filters.country) return false;

    return true;
  });

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mes comptes</h2>
            <p className="mt-1 text-sm text-gray-500">
              Gérez vos comptes sociaux et leurs paramètres
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un compte..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(true)}>
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un compte
            </Button>
          </div>
        </div>

        <Tabs.Root
          value={currentTab}
          onValueChange={(value) => setCurrentTab(value as Tab)}
        >
          <Tabs.List className="flex space-x-1 border-b">
            <Tabs.Trigger
              value="all"
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px",
                currentTab === "all"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              Tous les comptes
            </Tabs.Trigger>
            <Tabs.Trigger
              value="verified"
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px",
                currentTab === "verified"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              Comptes validés
            </Tabs.Trigger>
            <Tabs.Trigger
              value="pending"
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px",
                currentTab === "pending"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              En attente de validation
            </Tabs.Trigger>
          </Tabs.List>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onUpdate={(updates) => handleUpdateAccount(account.id, updates)}
                onDelete={() => handleDeleteAccount(account.id)}
              />
            ))}

            {filteredAccounts.length === 0 && (
              <div className="col-span-3 py-12 text-center text-gray-500">
                Aucun compte trouvé
              </div>
            )}
          </div>
        </Tabs.Root>

        {showAddModal && (
          <AccountSettingsModal
            onClose={() => setShowAddModal(false)}
            onSave={handleCreateAccount}
          />
        )}

        <Dialog.Root open={showFilters} onOpenChange={setShowFilters}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
            <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
              <Dialog.Title className="text-lg font-medium mb-4">
                Filtres
              </Dialog.Title>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Réseau social
                  </label>
                  <select
                    value={filters.platform}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        platform: e.target.value as Platform | "all",
                      })
                    }
                    className="w-full rounded-md border border-gray-200 p-2"
                  >
                    <option value="all">Tous les réseaux</option>
                    {PLATFORMS.map((platform) => (
                      <option key={platform} value={platform}>
                        {PLATFORM_LABELS[platform]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      setFilters({ ...filters, category: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-200 p-2"
                  >
                    <option value="">Toutes les catégories</option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Langue
                  </label>
                  <select
                    value={filters.language}
                    onChange={(e) =>
                      setFilters({ ...filters, language: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-200 p-2"
                  >
                    <option value="">Toutes les langues</option>
                    {LANGUAGES.map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pays
                  </label>
                  <select
                    value={filters.country}
                    onChange={(e) =>
                      setFilters({ ...filters, country: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-200 p-2"
                  >
                    <option value="">Tous les pays</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({
                        platform: "all",
                        category: "",
                        language: "",
                        country: "",
                      });
                      setShowFilters(false);
                    }}
                  >
                    Réinitialiser
                  </Button>
                  <Button onClick={() => setShowFilters(false)}>
                    Appliquer
                  </Button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </DashboardLayout>
  );
}
