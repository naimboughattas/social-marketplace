import { useState } from "react";
import { Tab } from "@headlessui/react";
import { Building2, Wallet, Plus, X, Coins } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAuth } from "../lib/auth";
import { useNotifications } from "../lib/notifications";
import AddressAutocomplete from "../components/AddressAutocomplete";
import { cn } from "../lib/utils";
import { useBillingProfiles } from "../lib/hooks/useBillingProfiles";
import { useWithdraws } from "../lib/hooks/useWithdraws";

interface WithdrawMethod {
  id: string;
  type: "bank" | "paypal";
  name: string;
  details: {
    iban?: string;
    bic?: string;
    accountName?: string;
    paypalEmail?: string;
  };
  isDefault: boolean;
}

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
  isDefault: boolean;
}

export default function Withdraw() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [selectedTab, setSelectedTab] = useState(0);
  const [amount, setAmount] = useState("");
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState<
    string | null
  >(null);
  const [selectedBillingProfile, setSelectedBillingProfile] = useState<
    string | null
  >(null);

  // États pour les modales
  const [showAddWithdrawMethod, setShowAddWithdrawMethod] = useState(false);
  const [showAddBillingProfile, setShowAddBillingProfile] = useState(false);

  // États pour les formulaires
  const [newWithdrawMethod, setNewWithdrawMethod] = useState<
    Partial<WithdrawMethod>
  >({});
  const [newBillingProfile, setNewBillingProfile] = useState<
    Partial<BillingProfile>
  >({
    country: "France",
  });

  // Charger les méthodes et profils depuis le localStorage
  const {
    withdraws: withdrawMethods,
    handleCreateWithdraw,
    handleUpdateWithdraw,
  } = useWithdraws();

  const {
    billingProfiles,
    handleCreateBillingProfile,
    handleDeleteBillingProfile,
    handleUpdateBillingProfile,
  } = useBillingProfiles();

  const handleWithdraw = async () => {
    if (!selectedWithdrawMethod || !selectedBillingProfile) {
      addNotification({
        type: "error",
        message:
          "Veuillez sélectionner une méthode de retrait et un profil de facturation",
      });
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      addNotification({
        type: "error",
        message: "Montant invalide",
      });
      return;
    }

    if (withdrawAmount > (user?.pendingBalance || 0)) {
      addNotification({
        type: "error",
        message: "Montant supérieur à vos gains disponibles",
      });
      return;
    }

    try {
      // Simuler l'appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      addNotification({
        type: "success",
        message: "Demande de retrait envoyée avec succès",
      });

      setAmount("");
      setSelectedWithdrawMethod(null);
      setSelectedBillingProfile(null);
    } catch (error) {
      addNotification({
        type: "error",
        message: "Erreur lors de la demande de retrait",
      });
    }
  };

  const handleAddWithdrawMethod = async () => {
    if (!newWithdrawMethod.type || !newWithdrawMethod.details) {
      addNotification({
        type: "error",
        message: "Veuillez remplir tous les champs requis",
      });
      return;
    }

    const method: WithdrawMethod = {
      type: newWithdrawMethod.type,
      name: newWithdrawMethod.name!,
      details: newWithdrawMethod.details,
      isDefault: withdrawMethods.length === 0,
    };
    await handleCreateWithdraw(method);

    setNewWithdrawMethod({});
    setShowAddWithdrawMethod(false);

    addNotification({
      type: "success",
      message: "Méthode de retrait ajoutée avec succès",
    });
  };

  const handleAddBillingProfile = async () => {
    if (
      !newBillingProfile.companyName ||
      !newBillingProfile.address ||
      !newBillingProfile.city ||
      !newBillingProfile.zipCode
    ) {
      addNotification({
        type: "error",
        message: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    const profile: BillingProfile = {
      companyName: newBillingProfile.companyName!,
      fullName: newBillingProfile.fullName!,
      address: newBillingProfile.address!,
      city: newBillingProfile.city!,
      region: newBillingProfile.region!,
      zipCode: newBillingProfile.zipCode!,
      country: newBillingProfile.country!,
      taxId: newBillingProfile.taxId,
      isDefault: billingProfiles.length === 0,
    };

    await handleCreateBillingProfile(profile);
    setNewBillingProfile({
      country: "France",
    });
    setShowAddBillingProfile(false);

    addNotification({
      type: "success",
      message: "Profil de facturation ajouté avec succès",
    });
  };

  const handleDeleteWithdrawMethod = async (id: string) => {
    if (
      confirm("Êtes-vous sûr de vouloir supprimer cette méthode de retrait ?")
    ) {
      await handleDeleteWithdrawMethod(id);

      addNotification({
        type: "success",
        message: "Méthode de retrait supprimée",
      });
    }
  };

  // const handleDeleteBillingProfile = (id: string) => {
  //   if (
  //     confirm("Êtes-vous sûr de vouloir supprimer ce profil de facturation ?")
  //   ) {
  //     const updatedProfiles = billingProfiles.filter(
  //       (profile) => profile.id !== id
  //     );
  //     setBillingProfiles(updatedProfiles);
  //     localStorage.setItem("billing_profiles", JSON.stringify(updatedProfiles));

  //     addNotification({
  //       type: "success",
  //       message: "Profil de facturation supprimé",
  //     });
  //   }
  // };

  const handleSetDefaultWithdrawMethod = async (id: string) => {
    await handleUpdateWithdraw(id, { isDefault: true });

    addNotification({
      type: "success",
      message: "Méthode de retrait par défaut mise à jour",
    });
  };

  const handleSetDefaultBillingProfile = async (id: string) => {
    await handleUpdateBillingProfile(id, { isDefault: true });
    addNotification({
      type: "success",
      message: "Profil de facturation par défaut mis à jour",
    });
  };

  const handleAddressSelect = (address: any) => {
    setNewBillingProfile({
      ...newBillingProfile,
      address: address.street,
      city: address.city,
      region: address.region,
      zipCode: address.zipCode,
      country: address.country,
    });
  };

  // Calculer les montants
  const calculateAmounts = (amount: number) => {
    const commission = amount * 0.15; // 15% commission
    const netAmount = amount - commission;
    const tva = netAmount * 0.2; // 20% TVA
    return {
      commission,
      netAmount,
      tva,
      total: amount,
    };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Retirer mes gains
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos retraits et informations de paiement
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
              Retirer mes gains
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
              Méthodes de retrait
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
            {/* Retirer mes gains */}
            <Tab.Panel>
              <div className="bg-white shadow rounded-lg p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Montant à retirer
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">€</span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Gains disponibles: {user?.pendingBalance?.toFixed(2)} €
                    </p>
                  </div>

                  {amount && parseFloat(amount) > 0 && (
                    <div className="mt-4 space-y-2 border-t pt-4">
                      {(() => {
                        const amounts = calculateAmounts(parseFloat(amount));
                        return (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">
                                Montant brut
                              </span>
                              <span>{parseFloat(amount).toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">
                                Commission (15%)
                              </span>
                              <span className="text-red-600">
                                -{amounts.commission.toFixed(2)} €
                              </span>
                            </div>
                            <div className="flex justify-between text-base font-medium border-t pt-2">
                              <span>Montant net</span>
                              <span>
                                {amounts.netAmount.toFixed(2)} €{" "}
                                <span className="text-sm font-normal text-gray-500">
                                  (dont TVA {amounts.tva.toFixed(2)} €)
                                </span>
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Méthode de retrait
                    </label>
                    {withdrawMethods.length === 0 ? (
                      <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                        <Wallet className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          Aucune méthode de retrait
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Commencez par ajouter une méthode de retrait pour
                          recevoir vos gains
                        </p>
                        <Button
                          className="mt-4"
                          onClick={() => setSelectedTab(1)}
                        >
                          Ajouter une méthode
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {withdrawMethods.map((method) => (
                          <div
                            key={method.id}
                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                              selectedWithdrawMethod === method.id
                                ? "border-purple-600 bg-purple-50"
                                : "border-gray-200"
                            }`}
                            onClick={() => setSelectedWithdrawMethod(method.id)}
                          >
                            <div className="flex items-center">
                              {method.type === "bank" && (
                                <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                              )}
                              {method.type === "paypal" && (
                                <Wallet className="h-5 w-5 text-gray-400 mr-3" />
                              )}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {method.name}
                                </p>
                                {method.type === "bank" && (
                                  <p className="text-sm text-gray-500">
                                    IBAN: •••• {method.details.iban?.slice(-4)}
                                  </p>
                                )}
                                {method.type === "paypal" && (
                                  <p className="text-sm text-gray-500">
                                    {method.details.paypalEmail}
                                  </p>
                                )}
                              </div>
                            </div>
                            <input
                              type="radio"
                              checked={selectedWithdrawMethod === method.id}
                              onChange={() =>
                                setSelectedWithdrawMethod(method.id)
                              }
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profil de facturation
                    </label>
                    {billingProfiles.length === 0 ? (
                      <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          Aucun profil de facturation
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Ajoutez un profil de facturation pour pouvoir retirer
                          vos gains
                        </p>
                        <Button
                          className="mt-4"
                          onClick={() => setSelectedTab(2)}
                        >
                          Ajouter un profil
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {billingProfiles.map((profile) => (
                          <div
                            key={profile.id}
                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                              selectedBillingProfile === profile.id
                                ? "border-purple-600 bg-purple-50"
                                : "border-gray-200"
                            }`}
                            onClick={() =>
                              setSelectedBillingProfile(profile.id)
                            }
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {profile.companyName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {profile.address}, {profile.zipCode}{" "}
                                {profile.city}
                              </p>
                            </div>
                            <input
                              type="radio"
                              checked={selectedBillingProfile === profile.id}
                              onChange={() =>
                                setSelectedBillingProfile(profile.id)
                              }
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleWithdraw}
                    disabled={
                      !amount ||
                      parseFloat(amount) <= 0 ||
                      !selectedWithdrawMethod ||
                      !selectedBillingProfile
                    }
                  >
                    Demander le retrait
                  </Button>
                </div>
              </div>
            </Tab.Panel>

            {/* Méthodes de retrait */}
            <Tab.Panel>
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button onClick={() => setShowAddWithdrawMethod(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une méthode
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {withdrawMethods.map((method) => (
                    <div
                      key={method.id}
                      className="bg-white shadow rounded-lg p-6 relative"
                    >
                      {method.isDefault && (
                        <span className="absolute top-2 right-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Par défaut
                        </span>
                      )}
                      <div className="flex items-center space-x-4">
                        {method.type === "bank" && (
                          <Building2 className="h-8 w-8 text-gray-400" />
                        )}
                        {method.type === "paypal" && (
                          <Wallet className="h-8 w-8 text-gray-400" />
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {method.name}
                          </h3>
                          {method.type === "bank" && (
                            <p className="text-sm text-gray-500">
                              IBAN: •••• {method.details.iban?.slice(-4)}
                            </p>
                          )}
                          {method.type === "paypal" && (
                            <p className="text-sm text-gray-500">
                              {method.details.paypalEmail}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        {!method.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleSetDefaultWithdrawMethod(method.id)
                            }
                          >
                            Définir par défaut
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteWithdrawMethod(method.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tab.Panel>

            {/* Profils de facturation */}
            <Tab.Panel>
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button onClick={() => setShowAddBillingProfile(true)}>
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
                                handleSetDefaultBillingProfile(profile.id)
                              }
                            >
                              Définir par défaut
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDeleteBillingProfile(profile.id)
                            }
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

      {/* Modal d'ajout de méthode de retrait */}
      {showAddWithdrawMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Ajouter une méthode de retrait
              </h3>
              <button onClick={() => setShowAddWithdrawMethod(false)}>
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type de méthode
                </label>
                <select
                  value={newWithdrawMethod.type || ""}
                  onChange={(e) =>
                    setNewWithdrawMethod({
                      ...newWithdrawMethod,
                      type: e.target.value as "bank" | "paypal",
                    })
                  }
                  className="w-full rounded-md border border-gray-200 p-2"
                  required
                >
                  <option value="">Sélectionner...</option>
                  <option value="bank">Virement bancaire</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              {newWithdrawMethod.type === "bank" && (
                <>
                  <Input
                    label="Titulaire du compte"
                    value={newWithdrawMethod.name || ""}
                    onChange={(e) =>
                      setNewWithdrawMethod({
                        ...newWithdrawMethod,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                  <Input
                    label="IBAN"
                    value={newWithdrawMethod.details?.iban || ""}
                    onChange={(e) =>
                      setNewWithdrawMethod({
                        ...newWithdrawMethod,
                        details: {
                          ...newWithdrawMethod.details,
                          iban: e.target.value,
                        },
                      })
                    }
                    required
                  />
                  <Input
                    label="BIC"
                    value={newWithdrawMethod.details?.bic || ""}
                    onChange={(e) =>
                      setNewWithdrawMethod({
                        ...newWithdrawMethod,
                        details: {
                          ...newWithdrawMethod.details,
                          bic: e.target.value,
                        },
                      })
                    }
                    required
                  />
                </>
              )}

              {newWithdrawMethod.type === "paypal" && (
                <>
                  <Input
                    label="Nom du compte"
                    value={newWithdrawMethod.name || ""}
                    onChange={(e) =>
                      setNewWithdrawMethod({
                        ...newWithdrawMethod,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                  <Input
                    label="Email PayPal"
                    type="email"
                    value={newWithdrawMethod.details?.paypalEmail || ""}
                    onChange={(e) =>
                      setNewWithdrawMethod({
                        ...newWithdrawMethod,
                        details: {
                          ...newWithdrawMethod.details,
                          paypalEmail: e.target.value,
                        },
                      })
                    }
                    required
                  />
                </>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddWithdrawMethod(false)}
                >
                  Annuler
                </Button>
                <Button onClick={handleAddWithdrawMethod}>Ajouter</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout de profil de facturation */}
      {showAddBillingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Ajouter un profil de facturation
              </h3>
              <button onClick={() => setShowAddBillingProfile(false)}>
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Nom de l'entreprise"
                  value={newBillingProfile.companyName || ""}
                  onChange={(e) =>
                    setNewBillingProfile({
                      ...newBillingProfile,
                      companyName: e.target.value,
                    })
                  }
                  required
                />
                <Input
                  label="Nom complet"
                  value={newBillingProfile.fullName || ""}
                  onChange={(e) =>
                    setNewBillingProfile({
                      ...newBillingProfile,
                      fullName: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <AddressAutocomplete onSelect={handleAddressSelect} />

              <Input
                label="Numéro de TVA (optionnel)"
                value={newBillingProfile.taxId || ""}
                onChange={(e) =>
                  setNewBillingProfile({
                    ...newBillingProfile,
                    taxId: e.target.value,
                  })
                }
              />

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddBillingProfile(false)}
                >
                  Annuler
                </Button>
                <Button onClick={handleAddBillingProfile}>Ajouter</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
