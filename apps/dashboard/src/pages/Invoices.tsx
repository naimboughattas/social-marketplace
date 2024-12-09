import { useState } from "react";
import { Tab } from "@headlessui/react";
import { Download, Plus, X } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Button from "../components/Button";
import Input from "../components/Input";
import AddressAutocomplete from "../components/AddressAutocomplete";
import { useNotifications } from "../lib/notifications";
import { generateInvoicePDF } from "../lib/invoice-generator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "../lib/utils";
import { useInvoices } from "../lib/hooks/useInvoices";

interface BillingProfile {
  id: string;
  companyName: string;
  fullName: string;
  address: string;
  city: string;
  region: string;
  zipCode: string;
  country: string;
  taxId?: string;
  isDefault?: boolean;
}

interface Invoice {
  id: string;
  date: Date;
  amount: number;
  tva: number;
  description: string;
  paymentMethod: "card" | "bank" | "paypal" | "gains";
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: "Carte bancaire",
  bank: "Virement bancaire",
  paypal: "PayPal",
  gains: "Transfert des gains",
};

export default function Invoices() {
  const { addNotification } = useNotifications();
  const [selectedTab, setSelectedTab] = useState(0);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );
  const [newProfile, setNewProfile] = useState<Partial<BillingProfile>>({
    country: "France",
  });

  // Charger les profils et factures depuis le localStorage
  const [billingProfiles, setBillingProfiles] = useState<BillingProfile[]>(
    () => {
      const saved = localStorage.getItem("billing_profiles");
      return saved ? JSON.parse(saved) : [];
    }
  );

  const { invoices } = useInvoices();

  const handleAddProfile = () => {
    if (
      !newProfile.companyName ||
      !newProfile.address ||
      !newProfile.city ||
      !newProfile.zipCode
    ) {
      addNotification({
        type: "error",
        message: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    const profile: BillingProfile = {
      id: crypto.randomUUID(),
      companyName: newProfile.companyName!,
      fullName: newProfile.fullName!,
      address: newProfile.address!,
      city: newProfile.city!,
      region: newProfile.region!,
      zipCode: newProfile.zipCode!,
      country: newProfile.country!,
      taxId: newProfile.taxId,
      isDefault: billingProfiles.length === 0,
    };

    const updatedProfiles = [...billingProfiles, profile];
    setBillingProfiles(updatedProfiles);
    localStorage.setItem("billing_profiles", JSON.stringify(updatedProfiles));

    setNewProfile({
      country: "France",
    });
    setShowAddProfile(false);

    addNotification({
      type: "success",
      message: "Profil de facturation ajouté avec succès",
    });
  };

  const handleDeleteProfile = (id: string) => {
    if (
      confirm("Êtes-vous sûr de vouloir supprimer ce profil de facturation ?")
    ) {
      const updatedProfiles = billingProfiles.filter(
        (profile) => profile.id !== id
      );
      setBillingProfiles(updatedProfiles);
      localStorage.setItem("billing_profiles", JSON.stringify(updatedProfiles));

      addNotification({
        type: "success",
        message: "Profil de facturation supprimé",
      });
    }
  };

  const handleSetDefaultProfile = (id: string) => {
    const updatedProfiles = billingProfiles.map((profile) => ({
      ...profile,
      isDefault: profile.id === id,
    }));
    setBillingProfiles(updatedProfiles);
    localStorage.setItem("billing_profiles", JSON.stringify(updatedProfiles));

    addNotification({
      type: "success",
      message: "Profil de facturation par défaut mis à jour",
    });
  };

  const handleAddressSelect = (address: any) => {
    setNewProfile({
      ...newProfile,
      address: address.street,
      city: address.city,
      region: address.region,
      zipCode: address.zipCode,
      country: address.country,
    });
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    if (billingProfiles.length === 0) {
      addNotification({
        type: "error",
        message: "Veuillez créer un profil de facturation",
      });
      return;
    }

    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) return;

    let profile: BillingProfile;

    if (billingProfiles.length === 1) {
      profile = billingProfiles[0];
    } else {
      setSelectedInvoiceId(invoiceId);
      setShowProfileSelector(true);
      return;
    }

    try {
      const blob = await generateInvoicePDF({
        invoiceNumber: invoice.id,
        date: invoice.date,
        amount: invoice.amount,
        tva: invoice.tva,
        description: invoice.description,
        paymentMethod: PAYMENT_METHOD_LABELS[invoice.paymentMethod],
        client: {
          name: profile.companyName,
          address: profile.address,
          city: profile.city,
          zipCode: profile.zipCode,
          country: profile.country,
          vatNumber: profile.taxId,
        },
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `facture_${invoice.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addNotification({
        type: "success",
        message: "Facture téléchargée avec succès",
      });
    } catch (error) {
      console.error("Error generating invoice:", error);
      addNotification({
        type: "error",
        message: "Erreur lors de la génération de la facture",
      });
    }
  };

  const handleSelectProfileForInvoice = async (profileId: string) => {
    if (!selectedInvoiceId) return;

    const invoice = invoices.find((inv) => inv.id === selectedInvoiceId);
    const profile = billingProfiles.find((p) => p.id === profileId);

    if (!invoice || !profile) return;

    try {
      const blob = await generateInvoicePDF({
        invoiceNumber: invoice.id,
        date: invoice.date,
        amount: invoice.amount,
        tva: invoice.tva,
        description: invoice.description,
        paymentMethod: PAYMENT_METHOD_LABELS[invoice.paymentMethod],
        client: {
          name: profile.companyName,
          address: profile.address,
          city: profile.city,
          zipCode: profile.zipCode,
          country: profile.country,
          vatNumber: profile.taxId,
        },
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `facture_${invoice.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setShowProfileSelector(false);
      setSelectedInvoiceId(null);

      addNotification({
        type: "success",
        message: "Facture téléchargée avec succès",
      });
    } catch (error) {
      console.error("Error generating invoice:", error);
      addNotification({
        type: "error",
        message: "Erreur lors de la génération de la facture",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Factures</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos factures et informations de facturation
          </p>
        </div>

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-purple-100 p-1">
            <Tab
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-purple-700 shadow"
                    : "text-purple-600 hover:bg-white/[0.12] hover:text-purple-800"
                )
              }
            >
              Historique
            </Tab>
            <Tab
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-purple-700 shadow"
                    : "text-purple-600 hover:bg-white/[0.12] hover:text-purple-800"
                )
              }
            >
              Profils de facturation
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-4">
            {/* Historique des factures */}
            <Tab.Panel>
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Numéro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Moyen de paiement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant HT
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        TVA
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total TTC
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(invoice.date, "dd/MM/yyyy", { locale: fr })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {PAYMENT_METHOD_LABELS[invoice.paymentMethod]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.amount.toFixed(2)} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.tva.toFixed(2)} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(invoice.amount + invoice.tva).toFixed(2)} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice.id)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tab.Panel>

            {/* Profils de facturation */}
            <Tab.Panel>
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button onClick={() => setShowAddProfile(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un profil
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {billingProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="bg-white shadow rounded-lg p-6 relative"
                    >
                      {profile.isDefault && (
                        <span className="absolute top-2 right-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Par défaut
                        </span>
                      )}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {profile.companyName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {profile.fullName}
                          </p>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{profile.address}</p>
                          <p>
                            {profile.zipCode} {profile.city}
                          </p>
                          <p>{profile.region}</p>
                          <p>{profile.country}</p>
                          {profile.taxId && (
                            <p className="text-sm text-gray-500">
                              N° TVA : {profile.taxId}
                            </p>
                          )}
                        </div>
                        <div className="flex justify-end space-x-2">
                          {!profile.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleSetDefaultProfile(profile.id)
                              }
                            >
                              Définir par défaut
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProfile(profile.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Modal d'ajout de profil */}
      {showAddProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Ajouter un profil de facturation
              </h3>
              <button onClick={() => setShowAddProfile(false)}>
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Nom de l'entreprise"
                  value={newProfile.companyName || ""}
                  onChange={(e) =>
                    setNewProfile({
                      ...newProfile,
                      companyName: e.target.value,
                    })
                  }
                  required
                />
                <Input
                  label="Nom complet"
                  value={newProfile.fullName || ""}
                  onChange={(e) =>
                    setNewProfile({ ...newProfile, fullName: e.target.value })
                  }
                  required
                />
              </div>

              <AddressAutocomplete onSelect={handleAddressSelect} />

              <Input
                label="Numéro de TVA (optionnel)"
                value={newProfile.taxId || ""}
                onChange={(e) =>
                  setNewProfile({ ...newProfile, taxId: e.target.value })
                }
              />

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddProfile(false)}
                >
                  Annuler
                </Button>
                <Button onClick={handleAddProfile}>Ajouter</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de sélection de profil pour la facture */}
      {showProfileSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Sélectionner un profil de facturation
              </h3>
              <button
                onClick={() => {
                  setShowProfileSelector(false);
                  setSelectedInvoiceId(null);
                }}
              >
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {billingProfiles.map((profile) => (
                <button
                  key={profile.id}
                  className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"
                  onClick={() => handleSelectProfileForInvoice(profile.id)}
                >
                  <div className="font-medium">{profile.companyName}</div>
                  <div className="text-sm text-gray-500">
                    {profile.address}, {profile.zipCode} {profile.city}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
