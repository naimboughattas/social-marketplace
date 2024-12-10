import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
} from "lucide-react";
import Button from "../../components/Button";
import { SocialAccount, Service } from "../../lib/types";
import SortableHeader from "./SortableHeader";
import { useFavorites } from "../../lib/favorites";
import InfluencerProfileModal from "./InfluencerProfileModal";

interface InfluencerTableProps {
  influencers: SocialAccount[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  onServiceSelect: (influencer: SocialAccount, service: Service) => void;
  multiSelectMode?: boolean;
  selectedInfluencers?: string[];
}

export default function InfluencerTable({
  influencers,
  sortField,
  sortDirection,
  onSort,
  onServiceSelect,
  multiSelectMode = false,
  selectedInfluencers = [],
}: InfluencerTableProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<SocialAccount | null>(null);

  const handleFavoriteClick = (
    e: React.MouseEvent,
    influencer: SocialAccount
  ) => {
    e.stopPropagation(); // Prevent triggering multiselect
    if (isFavorite(influencer.id)) {
      removeFavorite(influencer.id);
    } else {
      addFavorite(influencer);
    }
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {multiSelectMode && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sélection
                </th>
              )}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Influenceur
              </th>
              <SortableHeader
                field="followers"
                label="Followers"
                currentField={sortField}
                direction={sortDirection}
                onSort={onSort}
              />
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Localisation
              </th>
              {!multiSelectMode ? (
                <>
                  <SortableHeader
                    field="follow"
                    label="Follow"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={onSort}
                  />
                  <SortableHeader
                    field="like"
                    label="Like"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={onSort}
                  />
                  <SortableHeader
                    field="comment"
                    label="Comment"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={onSort}
                  />
                  <SortableHeader
                    field="repost"
                    label="Repost"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={onSort}
                  />
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Favoris
                  </th>
                </>
              ) : (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Prix
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {influencers.map((influencer) => (
              <tr
                key={influencer.id}
                className={
                  multiSelectMode ? "cursor-pointer hover:bg-gray-50" : ""
                }
                onClick={() => {
                  if (multiSelectMode) {
                    onServiceSelect(influencer, "follow");
                  }
                }}
              >
                {multiSelectMode && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedInfluencers.includes(influencer.id)}
                      onChange={() => onServiceSelect(influencer, "follow")}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={influencer.profile_picture_url}
                      alt={influencer.displayName}
                      className="h-10 w-10 rounded-full cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInfluencer(influencer);
                      }}
                    />
                    <div className="ml-4">
                      <div
                        className="text-sm font-medium text-gray-900 cursor-pointer hover:text-purple-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInfluencer(influencer);
                        }}
                      >
                        {influencer.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        {influencer.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {influencer.followers_count.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {influencer.city}, {influencer.country}
                </td>
                {multiSelectMode ? (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-baseline space-x-1">
                      <span className="font-medium">
                        {influencer.prices.follow?.toFixed(2)}€
                      </span>
                      <span className="text-xs text-gray-500">/ mois</span>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {influencer.prices.follow && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onServiceSelect(influencer, "follow")}
                          className="flex items-center space-x-2"
                        >
                          <UserPlus className="h-4 w-4" />
                          <span>{influencer.prices.follow.toFixed(2)} €</span>
                        </Button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {influencer.prices.like && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onServiceSelect(influencer, "like")}
                          className="flex items-center space-x-2"
                        >
                          <Heart className="h-4 w-4" />
                          <span>{influencer.prices.like.toFixed(2)} €</span>
                        </Button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {influencer.prices.comment && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onServiceSelect(influencer, "comment")}
                          className="flex items-center space-x-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{influencer.prices.comment.toFixed(2)} €</span>
                        </Button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {influencer.prices.repost_story && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onServiceSelect(influencer, "repost_story")
                          }
                          className="flex items-center space-x-2"
                        >
                          <Share2 className="h-4 w-4" />
                          <span>
                            {influencer.prices.repost_story.toFixed(2)} €
                          </span>
                        </Button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => handleFavoriteClick(e, influencer)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isFavorite(influencer.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedInfluencer && (
        <InfluencerProfileModal
          isOpen={!!selectedInfluencer}
          onClose={() => setSelectedInfluencer(null)}
          influencer={selectedInfluencer}
        />
      )}
    </>
  );
}
