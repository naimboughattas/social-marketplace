import { useState } from "react";
import { Plus, Building2, X } from "lucide-react";
import Button from "../Button";
import Input from "../Input";
import AddressAutocomplete from "../AddressAutocomplete";
import { useNotifications } from "../../lib/notifications";
import { useBillingProfiles } from "../../lib/hooks/useBillingProfiles";

interface BillingProfile {
  id: string;
  companyName: string;
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  taxId?: string;
  isDefault: boolean;
}

export default function BillingProfileList() {
  const { addNotification } = useNotifications();
  const {
    billingProfiles: profiles,
    handleCreateBillingProfile,
    handleUpdateBillingProfile,
    handleDeleteBillingProfile,
  } = useBillingProfiles();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProfile, setNewProfile] = useState<Partial<BillingProfile>>({
    country: "France",
  });

  const handleAddProfile = async () => {
    if (
      !newProfile.companyName ||
      !newProfile.fullName ||
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
      zipCode: newProfile.zipCode!,
      country: newProfile.country!,
      taxId: newProfile.taxId,
      isDefault: profiles.length === 0,
    };

    await handleCreateBillingProfile(profile);

    const updatedProfiles = [...profiles, profile];
    // setProfiles(updatedProfiles);
    localStorage.setItem("billing_profiles", JSON.stringify(updatedProfiles));

    setNewProfile({ country: "France" });
    setShowAddForm(false);

    addNotification({
      type: "success",
      message: "Profil de facturation ajouté avec succès",
    });
  };

  const handleDelete = async (id: string) => {
    await handleDeleteBillingProfile(id);
    // const updatedProfiles = profiles.filter((p) => p.id !== id);
    // setProfiles(updatedProfiles);
    // localStorage.setItem("billing_profiles", JSON.stringify(updatedProfiles));

    addNotification({
      type: "success",
      message: "Profil de facturation supprimé",
    });
  };

  const handleSetDefault = async (id: string) => {
    await handleUpdateBillingProfile(id, { isDefault: true });
    // const updatedProfiles = profiles.map((p) => ({
    //   ...p,
    //   isDefault: p.id === id,
    // }));
    // setProfiles(updatedProfiles);
    // localStorage.setItem("billing_profiles", JSON.stringify(updatedProfiles));

    addNotification({
      type: "success",
      message: "Profil de facturation par défaut mis à jour",
    });
  };

  return (
    <div className="space-y-4">
      {profiles.map((profile) => (
        <div
          key={profile.id}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex justify-between">
            <div>
              <h4 className="font-medium">{profile.companyName}</h4>
              <div className="text-sm text-gray-500">
                <p>{profile.fullName}</p>
                <p>{profile.address}</p>
                <p>
                  {profile.zipCode} {profile.city}
                </p>
                <p>{profile.country}</p>
                {profile.taxId && <p>N° TVA : {profile.taxId}</p>}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              {!profile.isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetDefault(profile.id)}
                >
                  Définir par défaut
                </Button>
              )}
              {profile.isDefault && (
                <span className="text-sm text-purple-600 font-medium">
                  Par défaut
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(profile.id)}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      ))}

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full p-4 border-2 border-dashed border-gray-200 rounded-lg text-center hover:border-purple-200 hover:bg-purple-50"
        >
          <Plus className="h-6 w-6 mx-auto text-gray-400" />
          <span className="mt-2 block text-sm text-gray-600">
            Ajouter un profil de facturation
          </span>
        </button>
      ) : (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">
              Nouveau profil de facturation
            </h3>
            <button onClick={() => setShowAddForm(false)}>
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
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
                setNewProfile({
                  ...newProfile,
                  fullName: e.target.value,
                })
              }
              required
            />

            <AddressAutocomplete
              onSelect={(address) => {
                setNewProfile({
                  ...newProfile,
                  address: address.street,
                  city: address.city,
                  zipCode: address.zipCode,
                  country: address.country,
                });
              }}
            />

            <Input
              label="Numéro de TVA (optionnel)"
              value={newProfile.taxId || ""}
              onChange={(e) =>
                setNewProfile({
                  ...newProfile,
                  taxId: e.target.value,
                })
              }
            />

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddProfile}>Ajouter</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
