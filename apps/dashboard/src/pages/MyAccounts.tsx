import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import Button from "../components/Button";
import AccountCard from "../components/AccountCard";
import AccountSettingsModal from "../components/AccountSettingsModal";
import { SocialAccount, Platform } from "../lib/types";
import DashboardLayout from "../components/DashboardLayout";
import { useAccounts } from "../hooks/useAccounts";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "../lib/utils";

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
    handleStartVerification,
  } = useAccounts();
  // get the code callback from instagram redirection
  const token = new URLSearchParams(window.location.search).get("token");
  const user_id = new URLSearchParams(window.location.search).get("user_id");
  const [isCreating, setIsCreating] = useState(false);
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
    // Filter by tab
    if (currentTab === "verified" && !account.isVerified) return false;
    if (currentTab === "pending" && account.isVerified) return false;

    // Filter by search
    if (
      search &&
      !account.username.toLowerCase().includes(search.toLowerCase()) &&
      !account.displayName.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    // Filter by criteria
    if (filters.platform !== "all" && account.platform !== filters.platform)
      return false;
    if (filters.category && account.category !== filters.category) return false;
    if (filters.language && account.language !== filters.language) return false;
    if (filters.country && account.country !== filters.country) return false;

    return true;
  });

  useEffect(() => {
    if (token && user_id) {
      const createAccount = async () => {
        try {
          // Récupérer les données du formulaire sauvegardées dans le localStorage
          const savedFormData = localStorage.getItem("formData");
          console.log("savedFormData", savedFormData);
          const parsedFormData = savedFormData ? JSON.parse(savedFormData) : {};

          // Construire un objet SocialAccount à partir des données
          const newAccount: SocialAccount = {
            pageId: user_id,
            token, // Inclure le token
            ...parsedFormData,
          };
          console.log("newAccount", newAccount);

          // Appeler handleCreateAccount avec le nouvel objet
          await handleCreateAccount(newAccount);

          // Nettoyer le localStorage après la création
          localStorage.removeItem("formData");
        } catch (error) {
          console.error("Erreur lors de la création du compte :", error);
        }
      };

      createAccount();
    }
  }, [token, user_id, handleCreateAccount]);

  if (isFetching || isCreating) {
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
                onStartVerification={() => handleStartVerification(account.id)}
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
      </div>
    </DashboardLayout>
  );
}
