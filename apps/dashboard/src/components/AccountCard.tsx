import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Calculator,
  Share2,
  Eye,
  EyeOff,
} from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import CityInput from "./CityInput";
import PlatformIcon from "./PlatformIcon";
import ServiceIcon from "./ServiceIcon";
import PriceSuggestionModal from "./PriceSuggestionModal";
import { useNotifications } from "../lib/notifications";
import {
  Platform,
  CATEGORIES,
  LANGUAGES,
  COUNTRIES,
  SocialAccount,
  Service,
} from "../lib/types";
import * as Tooltip from "@radix-ui/react-tooltip";
import Switch from "./Switch";
import { useAccount } from "../lib/hooks/useAccounts";

const formatAccountDataByPlatform = (platform: Platform, data: any) => {
  switch (platform) {
    case "instagram":
      return {
        username: data.username,
        profile_picture_url: data.profile_picture_url,
        followers: data.followers_count,
        category: data.category,
        country: data.country,
        city: data.city,
      };
    case "tiktok":
      return {
        username: data.username,
        profile_picture_url: data.avatar_url,
        followers: data.follower_count,
        category: data.category,
        country: data.country,
        city: data.city,
      };
    case "youtube":
      return {
        username: data.title,
        profile_picture_url: data.thumbnails.default.url,
        followers: data.subscriberCount,
        category: data.category,
        country: data.country,
        city: data.city,
      };
    case "x":
      return {
        username: data.username,
        profile_picture_url: data.profile_image_url,
        followers: data.public_metrics.followers_count,
        category: data.category,
        country: data.country,
        city: data.city,
      };
    case "facebook":
      return {
        username: data.name,
        profile_picture_url: data.picture,
        followers: data.friends,
        category: data.category,
        country: data.country,
        city: data.city,
      };
    case "linkedin":
      return {
        username: data.username,
        profile_picture_url: data.picture,
        followers: data.followers,
        category: data.category,
        country: data.country,
        city: data.city,
      };
    default:
      return {};
  }
};

interface AccountCardProps {
  account: SocialAccount;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
}

export default function AccountCard({
  account,
  onUpdate,
  onDelete,
}: AccountCardProps) {
  const accountData = formatAccountDataByPlatform(account.platform, account);
  const { addNotification } = useNotifications();
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [showPriceSuggestions, setShowPriceSuggestions] = useState(false);

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleServiceToggle = (service: Service, enabled: boolean) => {
    const updatedServices = enabled
      ? [...(account.availableServices || []), service]
      : (account.availableServices || []).filter((s) => s !== service);

    onUpdate({
      availableServices: updatedServices,
      prices: {
        ...account.prices,
        [service]: enabled ? account.prices[service] || 0 : undefined,
      },
    });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/${
      account.platform
    }/${account.username.replace("@", "")}`;
    try {
      await navigator.clipboard.writeText(url);
      addNotification({
        type: "success",
        message: "Lien copié dans le presse-papier",
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: "Erreur lors de la copie du lien",
      });
    }
  };

  const getPriceLabel = (service: Service) => {
    return service === "follow" ? "/ mois" : "/ post";
  };

  if (!account) return <div>Loading...</div>;
  const canBeVisible = account.availableServices.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={accountData.profile_picture_url}
              alt={account.username}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
            />
            <div>
              <div className="flex items-center space-x-2">
                <PlatformIcon platform={account.platform} className="h-4 w-4" />
                <Link
                  to={`/${account.platform}/${account.username}`}
                  className="font-medium text-purple-600 hover:text-purple-700"
                >
                  {account.username}
                </Link>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <span>{formatFollowers(accountData.followers)} followers</span>
                <span>•</span>
                <span>
                  {account.city}, {account.country}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="text-purple-600 hover:text-purple-700 border-purple-200"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-gray-500 hover:text-red-600 border-gray-200"
            >
              Supprimer
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Visibilité */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <Switch
              checked={account.hideIdentity}
              onChange={(checked) => {
                if (checked && !canBeVisible) {
                  addNotification({
                    type: "error",
                    message:
                      "Vous devez avoir au moins un service actif pour être visible dans le catalogue",
                  });
                  return;
                }
                onUpdate({ hideIdentity: checked });
              }}
              label={
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Visible dans le catalogue
                  </span>
                  <span
                    className={`inline-flex h-2 w-2 rounded-full ${
                      !account.hideIdentity ? "bg-green-400" : "bg-gray-400"
                    }`}
                  ></span>
                </div>
              }
            />
          </div>

          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div className="flex items-center justify-between">
                  <Switch
                    checked={account.hideProfileImage}
                    onChange={(checked) =>
                      onUpdate(account.id, {
                        hideProfileImage: checked,
                      })
                    }
                    label={
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                          Masquer mon identité
                        </span>
                        {account.hideProfileImage ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    }
                  />
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-gray-900 text-white px-3 py-2 rounded text-sm max-w-xs"
                  sideOffset={5}
                >
                  Votre compte apparaîtra comme "Compte mystère" dans le
                  catalogue, sans photo de profil ni informations permettant de
                  vous identifier. Seules vos statistiques et tarifs seront
                  visibles.
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>

          {!canBeVisible && (
            <p className="text-sm text-red-600">
              Vous devez avoir au moins un service actif pour être visible dans
              le catalogue
            </p>
          )}
        </div>

        {/* Services */}
        <div>
          <div className="flex justify-between mb-2">
            <h4 className="text-xs font-medium text-gray-500">
              Services et tarifs
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPriceSuggestions(true)}
              className="text-xs"
            >
              <Calculator className="h-3 w-3 mr-1" />
              Suggérer des prix
            </Button>
          </div>
          <div className="space-y-2">
            {(["follow", "like", "comment", "repost_story"] as Service[]).map(
              (service) => {
                const isEnabled = account.availableServices?.includes(service);
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
                          value={account.prices[service] || ""}
                          onChange={(e) =>
                            onUpdate({
                              prices: {
                                ...account.prices,
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
                            {getPriceLabel(service)}
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

        {/* Verification Status */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            {!account.hideIdentity ? (
              <span className="flex items-center text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                Visible dans le catalogue
              </span>
            ) : (
              <span className="flex items-center text-gray-600">
                <span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                Masqué du catalogue
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Modal de suggestion de prix */}
      <PriceSuggestionModal
        isOpen={showPriceSuggestions}
        onClose={() => setShowPriceSuggestions(false)}
        followers={accountData.followers}
        onApply={(prices) => {
          onUpdate({
            prices: {
              ...account.prices,
              ...prices,
            },
          });
        }}
      />
    </div>
  );
}
