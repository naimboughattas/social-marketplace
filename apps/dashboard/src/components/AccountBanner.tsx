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
        username: data.name,
        profile_picture_url: data.picture,
        followers: 0,
        category: data.category,
        country: data.country,
        city: data.city,
      };
    default:
      return {};
  }
};

interface AccountBannerProps {
  accountId: string;
  onSelect: () => void;
}

export default function AccountBanner({
  accountId,
  onSelect,
}: AccountBannerProps) {
  const {
    account,
    loading: isFetching,
    handleUpdateAccount,
  } = useAccount(accountId);
  console.log(account);
  const accountData =
    !isFetching && formatAccountDataByPlatform(account.platform, account);
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

    handleUpdateAccount(accountId, {
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

  if (isFetching) return <div>Loading...</div>;
  const canBeVisible = account.availableServices.length > 0;

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
                  to={`/${account.platform}/${account.username}`}
                  className="font-medium text-purple-600 hover:text-purple-700"
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
                <span>
                  {accountData.city}, {accountData.country}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {/* <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="text-purple-600 hover:text-purple-700 border-purple-200"
            >
              <Share2 className="h-4 w-4" />
            </Button> */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect()}
              className="text-gray-500 hover:text-red-600 border-gray-200"
            >
              Sélectionner
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
