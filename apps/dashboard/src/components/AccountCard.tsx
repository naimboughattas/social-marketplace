import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, CheckCircle, MapPin, Calculator, Share2 } from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import CityInput from "./CityInput";
import PlatformIcon from "./PlatformIcon";
import ServiceIcon from "./ServiceIcon";
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
        profile_picture_url: data.profile_picture_url,
        followers: data.followers_count,
        category: data.category,
        country: data.country,
        city: data.city,
      };
    case "youtube":
      return {
        username: data.title,
        profile_picture_url: data.thumbnails.high.url,
        followers: data.followers,
        category: data.category,
        country: data.country,
        city: data.city,
      };
    case "x":
      return {
        username: data.username,
        profile_picture_url: data.profile_picture_url,
        followers: data.followers_count,
        category: data.category,
        country: data.country,
        city: data.city,
      };
    case "facebook":
      return {
        username: data.username,
        profile_picture_url: data.profile_picture_url,
        followers: data.followers_count,
        category: data.category,
        country: data.country,
        city: data.city,
      };
    case "linkedin":
      return {
        username: data.username,
        profile_picture_url: data.profile_picture_url,
        followers: data.followers_count,
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
  onUpdate: (updates: Partial<SocialAccount>) => void;
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

  const handleApplyPriceSuggestions = (prices: {
    like: number;
    comment: number;
    repost_story: number;
    follow: number;
  }) => {
    onUpdate({
      prices: {
        ...account.prices,
        like: prices.like,
        comment: prices.comment,
        repost_story: prices.repost_story,
        follow: prices.follow,
      },
    });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/${account.platform}/${account.username.replace("@", "")}`;
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

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={accountData.profile_picture_url}
              alt={accountData.username}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
            />
            <div>
              <div className="flex items-center space-x-2">
                <PlatformIcon platform={account.platform} className="h-4 w-4" />
                <Link
                  to={`/${account.platform}/${account.username.replace("@", "")}`}
                  className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
                >
                  {accountData.username}
                </Link>
                {account.isVerified && (
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <span>{formatFollowers(accountData.followers)} followers</span>
                <span>•</span>
                {isEditingLocation ? (
                  <CityInput
                    value={accountData.city}
                    onSelect={(city, country) => {
                      onUpdate({ city, country });
                      setIsEditingLocation(false);
                    }}
                  />
                ) : (
                  <button
                    onClick={() => setIsEditingLocation(true)}
                    className="flex items-center hover:text-gray-700"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {accountData.city}, {accountData.country}
                    </span>
                  </button>
                )}
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
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Catégorie et Langue */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Catégorie
            </label>
            <select
              value={accountData.category}
              onChange={(e) => onUpdate({ category: e.target.value })}
              className="w-full rounded-md border border-gray-200 p-2 text-sm bg-white"
              disabled={!account.isVerified}
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
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Langue
            </label>
            <select
              value={account.language}
              onChange={(e) => onUpdate({ language: e.target.value })}
              className="w-full rounded-md border border-gray-200 p-2 text-sm bg-white"
              disabled={!account.isVerified}
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

        {/* Services */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-gray-500">
              Services et tarifs
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPriceSuggestions(true)}
              disabled={!account.isVerified}
              className="text-xs"
            >
              <Calculator className="h-3 w-3 mr-1" />
              Suggérer des prix
            </Button>
          </div>
          <div className="space-y-2">
            {["follow", "like", "comment", "repost_story"].map((service) => {
              const isEnabled = account.availableServices?.includes(
                service as Service
              );
              return (
                <div
                  key={service}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isEnabled
                      ? "bg-purple-50 border-purple-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) =>
                        handleServiceToggle(
                          service as Service,
                          e.target.checked
                        )
                      }
                      disabled={!account.isVerified}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex items-center space-x-2">
                      <ServiceIcon service={service as Service} />
                      <span className="text-sm font-medium capitalize">
                        {service}
                      </span>
                    </div>
                  </div>
                  {isEnabled && (
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={account.prices[service as Service] || ""}
                        onChange={(e) =>
                          onUpdate({
                            prices: {
                              ...account.prices,
                              [service]: parseFloat(e.target.value),
                            },
                          })
                        }
                        className="w-20 p-2 text-sm border rounded-l bg-white"
                        placeholder="0"
                        min="0"
                        step="0.5"
                        disabled={!account.isVerified}
                      />
                      <span className="px-3 py-2 text-sm bg-gray-100 border border-l-0 rounded-r">
                        €
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Visibilité */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={!account.hideIdentity}
              onChange={(e) => onUpdate({ hideIdentity: !e.target.checked })}
              disabled={!account.isVerified}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-600">
              {!account.isVerified ? (
                <span className="flex items-center text-yellow-600">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                  En attente de vérification
                </span>
              ) : !account.hideIdentity ? (
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
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
