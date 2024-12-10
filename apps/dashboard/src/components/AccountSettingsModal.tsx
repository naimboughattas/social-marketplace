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

const getCallbackURL = (userId: string) => ({
  instagram: `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/instagram/auth?userId=${userId}`,
  youtube: `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/youtube/auth?userId=${userId}`,
  tiktok: `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/tiktok/auth?userId=${userId}`,
  x: `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/x/auth?userId=${userId}`,
  linkedin: `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/linkedin/auth?userId=${userId}`,
  facebook: `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/facebook/auth?userId=${userId}`,
});

interface AccountSettingsModalProps {
  account?: SocialAccount;
  onClose: () => void;
  onSave: (account: SocialAccount | Partial<SocialAccount>) => void;
}

type Step = "platform" | "info" | "location" | "services";

const STEP_TITLES = {
  platform: "Choisir une plateforme",
  info: "Informations du compte",
  location: "Localisation",
  services: "Services proposés",
};

export default function AccountSettingsModal({
  account,
  onClose,
  onSave,
}: AccountSettingsModalProps) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [step, setStep] = useState<Step>("platform");
  const [formData, setFormData] = useState<Partial<SocialAccount>>({
    platform: undefined,
    category: "",
    country: "",
    city: "",
    language: "",
    isActive: true,
    hideIdentity: false,
    prices: {},
    availableServices: [],
    avgDeliveryTime: 30,
    completedOrders: 0,
    rating: 5.0,
  });

  const [showPriceSuggestions, setShowPriceSuggestions] = useState(false);

  const steps: Step[] = ["platform", "info", "location", "services"];

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
    if (!formData.platform) {
      addNotification({
        type: "error",
        message: "Veuillez sélectionner une plateforme",
      });
      return;
    }
    if (!formData.availableServices?.length) {
      addNotification({
        type: "error",
        message: "Veuillez sélectionner au moins un service",
      });
      return;
    }
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

    // Redirection vers l'URL correspondant à la plateforme sélectionnée
    window.location.href = getCallbackURL(user.id)[formData.platform];
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
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPriceSuggestions(true)}
                  disabled={!formData.followers}
                  className="text-xs"
                >
                  Suggérer des prix
                </Button> */}
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
                {step === "location" ? (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleNext}>
                      Ignorer
                    </Button>
                    <Button onClick={handleNext}>Continuer</Button>
                  </div>
                ) : (
                  <Button
                    onClick={step === "services" ? handleSubmit : handleNext}
                  >
                    {step === "services" ? "Terminer" : "Continuer"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* {showPriceSuggestions && (
            <PriceSuggestionModal
              isOpen={showPriceSuggestions}
              onClose={() => setShowPriceSuggestions(false)}
              followers={0}
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
          )} */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
