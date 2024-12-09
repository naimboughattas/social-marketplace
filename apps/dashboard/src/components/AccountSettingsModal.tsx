import { useState } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import Button from "./Button";
import Input from "./Input";
import CityInput from "./CityInput";
import PlatformIcon from "./PlatformIcon";
import ServiceIcon from "./ServiceIcon";
import PriceSuggestionModal from "./PriceSuggestionModal";
import { useNotifications } from "../lib/notifications";
import {
  Platform,
  PLATFORMS,
  PLATFORM_LABELS,
  CATEGORIES,
  LANGUAGES,
  COUNTRIES,
  SocialAccount,
  Service,
} from "../lib/types";
import { useAuth } from "../lib/auth";

interface AccountSettingsModalProps {
  account?: SocialAccount;
  onClose: () => void;
  onSave: (account: SocialAccount | Partial<SocialAccount>) => void;
}

type Step = "platform" | "info" | "location" | "services" | "verification";

const STEP_TITLES = {
  platform: "Choisir une plateforme",
  info: "Informations du compte",
  location: "Localisation",
  services: "Services proposés",
  verification: "Vérification du compte",
};

export default function AccountSettingsModal({
  account,
  onClose,
  onSave,
}: AccountSettingsModalProps) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [step, setStep] = useState<Step>("platform");
  const [formData, setFormData] = useState<Partial<SocialAccount>>(
    account || {
      platform: "instagram",
      username: "",
      displayName: "",
      profileImage: "",
      followers: 0,
      category: "",
      country: "",
      city: "",
      language: "",
      isVerified: false,
      isActive: true,
      hideIdentity: false,
      prices: {},
      availableServices: [],
      avgDeliveryTime: 30,
      completedOrders: 0,
      rating: 5.0,
    }
  );

  const [verificationCode] = useState(() => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `VERIFY-${randomStr}-${timestamp}`.toUpperCase();
  });

  const [showPriceSuggestions, setShowPriceSuggestions] = useState(false);

  const steps: Step[] = [
    "platform",
    "info",
    "location",
    "services",
    "verification",
  ];

  const handleNext = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  // const handleSubmit = () => {
  //   if (!formData.username) {
  //     addNotification({
  //       type: "error",
  //       message: "Veuillez entrer un nom d'utilisateur",
  //     });
  //     return;
  //   }

  //   const newAccount = {
  //     ...formData,
  //     id: account?.id || crypto.randomUUID(),
  //     verificationCode,
  //   };

  //   onSave(newAccount);
  //   onClose();
  // };

  const handleServiceToggle = (service: Service, enabled: boolean) => {
    const updatedServices = enabled
      ? [...(formData.availableServices || []), service]
      : (formData.availableServices || []).filter((s) => s !== service);

    setFormData({
      ...formData,
      availableServices: updatedServices,
      prices: {
        ...formData.prices,
        [service]: enabled ? formData.prices?.[service] || 0 : undefined,
      },
    });
  };

  const handleSubmit = async () => {
    // if (!formData.username) {
    //   addNotification({
    //     type: "error",
    //     message: "Veuillez entrer un nom d'utilisateur",
    //   });
    //   return;
    // }

    // if (!formData.availableServices?.length) {
    //   addNotification({
    //     type: "error",
    //     message: "Veuillez sélectionner au moins un service",
    //   });
    //   return;
    // }

    console.log(user);
    if (!user) return;
    await fetch(`${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/cache/set`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: user.id,
        value: formData,
      }),
    });

    if (formData.platform === "instagram") {
      window.location.href = `${
        import.meta.env.VITE_NEXT_PUBLIC_API_URL
      }/instagram/auth?userId=${user.id}`;
    }

    if (formData.platform === "youtube") {
      window.location.href = `${
        import.meta.env.VITE_NEXT_PUBLIC_API_URL
      }/youtube/auth?userId=${user.id}`;
    }

    if (formData.platform === "tiktok") {
      window.location.href = `${
        import.meta.env.VITE_NEXT_PUBLIC_API_URL
      }/tiktok/auth?userId=${user.id}`;
    }

    if (formData.platform === "x") {
      window.location.href = `${
        import.meta.env.VITE_NEXT_PUBLIC_API_URL
      }/x/auth?userId=${user.id}`;
    }

    if (formData.platform === "linkedin") {
      window.location.href = `${
        import.meta.env.VITE_NEXT_PUBLIC_API_URL
      }/linkedin/auth?userId=${user.id}`;
    }

    if (formData.platform === "facebook") {
      window.location.href = `${
        import.meta.env.VITE_NEXT_PUBLIC_API_URL
      }/facebook/auth?userId=${user.id}`;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case "platform":
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">
              Choisissez votre plateforme
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 ${
                    formData.platform === platform
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-200"
                  }`}
                  onClick={() => setFormData({ ...formData, platform })}
                >
                  <PlatformIcon platform={platform} className="h-6 w-6" />
                  <span className="font-medium">
                    {PLATFORM_LABELS[platform]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );

      case "info":
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Informations du compte</h3>
            <div className="space-y-4">
              <Input
                label="Nom d'utilisateur"
                value={formData.username || ""}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Langue
                </label>
                <select
                  value={formData.language}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {LANGUAGES.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case "location":
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Localisation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pays
                </label>
                <select
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                >
                  <option value="">Sélectionner...</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <CityInput
                value={formData.city || ""}
                onSelect={(city) => setFormData({ ...formData, city })}
              />
            </div>
          </div>
        );

      case "services":
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Services proposés</h3>
            <div className="space-y-4">
              <div className="flex justify-between mb-2">
                <h4 className="text-xs font-medium text-gray-500">
                  Services et tarifs
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPriceSuggestions(true)}
                  disabled={!formData.followers}
                  className="text-xs"
                >
                  Suggérer des prix
                </Button>
              </div>
              {(["follow", "like", "comment", "repost_story"] as Service[]).map(
                (service) => {
                  const isEnabled =
                    formData.availableServices?.includes(service);
                  return (
                    <div
                      key={service}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isEnabled
                          ? "bg-purple-50 border-purple-200"
                          : "bg-gray-50 border-gray-200"
                      } border`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={(e) =>
                            handleServiceToggle(service, e.target.checked)
                          }
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <div className="flex items-center space-x-2">
                          <ServiceIcon service={service} />
                          <span className="text-sm font-medium capitalize">
                            {service}
                          </span>
                        </div>
                      </div>
                      {isEnabled && (
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={formData.prices?.[service] || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                prices: {
                                  ...formData.prices,
                                  [service]: parseFloat(e.target.value),
                                },
                              })
                            }
                            className="w-20 p-2 text-sm border rounded bg-white"
                            placeholder="0"
                            min="0"
                            step="0.5"
                          />
                          <div className="px-3 py-2 text-sm bg-gray-100 border border-l-0 rounded-r">
                            €{" "}
                            <span className="text-xs text-gray-500">
                              {service === "follow" ? "/ mois" : "/ post"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        );

      case "verification":
        return (
          <div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-900 mb-2">
                Dernière étape : Vérification de votre compte
              </h3>
              <p className="text-sm text-purple-700">
                Pour finaliser l'ajout de votre compte et commencer à recevoir
                des commandes, nous devons vérifier que vous êtes bien
                propriétaire du compte <strong>{formData.username}</strong>.
              </p>
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Voici votre code de vérification
                  </p>
                  <p className="text-sm text-gray-500">
                    Copiez ce code unique qui prouve que vous êtes propriétaire
                    du compte
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg">
                <code className="text-lg font-mono text-purple-600">
                  {verificationCode}
                </code>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Envoyez-nous le code
                  </p>
                  <p className="text-sm text-gray-500">
                    Envoyez-nous un message direct sur{" "}
                    {PLATFORM_LABELS[formData.platform as Platform]} avec ce
                    code.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Confirmez l'envoi</p>
                  <p className="text-sm text-gray-500">
                    Une fois le code envoyé, cliquez sur le bouton ci-dessous.
                    Nous vérifierons votre message et activerons votre compte
                    dans les plus brefs délais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-30 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-30 bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="sr-only">{STEP_TITLES[step]}</Dialog.Title>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {steps.map((s, index) => (
                  <div
                    key={`step-${s}`}
                    className={`h-2 w-2 rounded-full ${
                      steps.indexOf(step) >= index
                        ? "bg-purple-600"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                Étape {steps.indexOf(step) + 1} sur {steps.length}
              </span>
            </div>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-between pt-4 border-t">
              {step !== "platform" && (
                <Button variant="outline" onClick={handleBack}>
                  Retour
                </Button>
              )}
              <div className="ml-auto">
                {step === "services" ? (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleNext}>
                      Ignorer
                    </Button>
                    <Button onClick={handleNext}>Continuer</Button>
                  </div>
                ) : (
                  <Button
                    onClick={
                      step === "verification" ? handleSubmit : handleNext
                    }
                  >
                    {step === "verification" ? "Terminer" : "Continuer"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {showPriceSuggestions && (
            <PriceSuggestionModal
              isOpen={showPriceSuggestions}
              onClose={() => setShowPriceSuggestions(false)}
              followers={formData.followers || 0}
              onApply={(prices) => {
                setFormData({
                  ...formData,
                  prices: {
                    ...formData.prices,
                    ...prices,
                  },
                });
                setShowPriceSuggestions(false);
              }}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
