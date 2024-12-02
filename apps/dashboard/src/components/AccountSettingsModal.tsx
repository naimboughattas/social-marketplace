import { useState } from "react";
import { Info, X } from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import CityInput from "./CityInput";
import PlatformIcon from "./PlatformIcon";
import ServiceIcon from "./ServiceIcon";
import { useNotifications } from "../lib/notifications";
import {
  Platform,
  PLATFORMS,
  PLATFORM_LABELS,
  PLATFORM_SERVICES,
  SERVICE_LABELS,
  CATEGORIES,
  LANGUAGES,
  COUNTRIES,
  SocialAccount,
  SERVICE_DESCRIPTIONS,
} from "../lib/types";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useAuth } from "../lib/auth";
import { platform } from "os";

interface AccountSettingsModalProps {
  account?: SocialAccount;
  onClose: () => void;
  onSave: (account: SocialAccount | Partial<SocialAccount>) => void;
}

type Step = "platform" | "info" | "location" | "services" | "verification";

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

    const newAccount = {
      ...formData,
      id: account?.id || crypto.randomUUID(),
    };
    console.log(user);
    if (!user) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cache/set`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: user.id,
        value: newAccount,
      }),
    });

    if (formData.platform === "instagram") {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/instagram/auth?userId=${user.id}`;
    }

    if (formData.platform === "youtube") {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/youtube/auth?userId=${user.id}`;
    }

    if (formData.platform === "tiktok") {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/tiktok/auth?userId=${user.id}`;
    }

    if (formData.platform === "x") {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/x/auth?userId=${user.id}`;
    }

    if (formData.platform === "linkedin") {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/linkedin/auth?userId=${user.id}`;
    }

    if (formData.platform === "facebook") {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/facebook/auth?userId=${user.id}`;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case "platform":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Choisissez votre plateforme</h3>
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
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations du compte</h3>
            <Input
              label="Nom d'utilisateur"
              value={formData.username || ""}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full rounded-md border border-gray-200 p-2"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Langue
              </label>
              <select
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                className="w-full rounded-md border border-gray-200 p-2"
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
        );

      case "location":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Localisation</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <select
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="w-full rounded-md border border-gray-200 p-2"
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
        );

      case "services":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Services proposés</h3>
            <p className="text-sm text-gray-500">
              Sélectionnez les services que vous souhaitez proposer et
              définissez vos tarifs
            </p>
            <div className="space-y-3">
              {PLATFORM_SERVICES[formData.platform as Platform].map(
                (service) => (
                  <div
                    key={service}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.availableServices?.includes(service)}
                        onChange={(e) => {
                          const services = formData.availableServices || [];
                          setFormData({
                            ...formData,
                            availableServices: e.target.checked
                              ? [...services, service]
                              : services.filter((s) => s !== service),
                            prices: {
                              ...formData.prices,
                              [service]: e.target.checked
                                ? formData.prices?.[service] || 2
                                : undefined,
                            },
                          });
                        }}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <div className="flex items-center space-x-2">
                        <ServiceIcon service={service} />
                        <span className="font-medium">
                          {SERVICE_LABELS[service]}
                        </span>
                        <Tooltip.Provider>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <button className="text-gray-400 hover:text-gray-600">
                                <Info className="h-4 w-4" />
                              </button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                className="z-50 bg-gray-900 text-white px-3 py-2 rounded text-sm max-w-xs"
                                sideOffset={5}
                              >
                                {SERVICE_DESCRIPTIONS[service]}
                                <Tooltip.Arrow className="fill-gray-900" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </Tooltip.Provider>
                      </div>
                    </div>
                    {formData.availableServices?.includes(service) && (
                      <div className="flex items-center space-x-2">
                        <Input
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
                          className="w-24"
                          min="0"
                          step="0.1"
                          required
                        />
                        <span className="text-gray-500">€</span>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        );

      case "verification":
        return (
          <div className="space-y-4">
            {/* <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-900 mb-2">
                Dernière étape : Vérification de votre compte
              </h3>
              <p className="text-sm text-purple-700">
                Pour finaliser l'ajout de votre compte et commencer à recevoir
                des commandes, nous devons vérifier que vous êtes bien
                propriétaire du compte <strong>{formData.username}</strong>.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Voici votre code de vérification
                    </p>
                    <p className="text-sm text-gray-500">
                      Copiez ce code unique qui prouve que vous êtes
                      propriétaire du compte
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(verificationCode);
                    addNotification({
                      type: "success",
                      message: "Code copié dans le presse-papier",
                    });
                  }}
                >
                  Copier
                </Button>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg">
                <code className="text-lg font-mono text-purple-600 select-all">
                  {verificationCode}
                </code>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Envoyez-nous le code
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Envoyez-nous un message direct sur{" "}
                    {PLATFORM_LABELS[formData.platform as Platform]} avec ce
                    code.
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
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
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === steps[0]}
            >
              Retour
            </Button>
            {step === steps[steps.length - 1] ? (
              <Button onClick={handleSubmit}>
                Synchroniser mon compte {formData.platform}
              </Button>
            ) : (
              <Button onClick={handleNext}>Continuer</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
