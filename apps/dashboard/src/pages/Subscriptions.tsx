import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import {
  Search,
  UserPlus,
  Heart,
  MessageCircle,
  Share2,
  AlertCircle,
  Clock,
  History,
} from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useNotifications } from "../lib/notifications";
import * as Tooltip from "@radix-ui/react-tooltip";
import { getTimeLeft } from "../components/TimeRemaining";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSubscriptions } from "../lib/hooks/useSubscriptions";

type SubscriptionType = "follow" | "like" | "comment" | "repost_story";
type SubscriptionStatus = "active" | "paused" | "cancelled";

interface Subscription {
  id: string;
  type: SubscriptionType;
  influencer: {
    username: string;
    profileImage: string;
  };
  target: string;
  price: number;
  status: SubscriptionStatus;
  nextRenewal?: Date;
  startDate: Date;
  lastExecution?: Date;
  history: {
    total: number;
    url: string;
  };
}

const ServiceIcon = ({ type }: { type: SubscriptionType }) => {
  switch (type) {
    case "follow":
      return <UserPlus className="h-4 w-4" />;
    case "like":
      return <Heart className="h-4 w-4" />;
    case "comment":
      return <MessageCircle className="h-4 w-4" />;
    case "repost_story":
      return <Share2 className="h-4 w-4" />;
  }
};

const StatusBadge = ({ status }: { status: SubscriptionStatus }) => {
  const styles = {
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const labels = {
    active: "Actif",
    paused: "En pause",
    cancelled: "Annulé",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
};

export default function Subscriptions() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [selectedType, setSelectedType] = useState<"all" | SubscriptionType>(
    "all"
  );
  const [search, setSearch] = useState("");
  const [hasAutoRecharge, setHasAutoRecharge] = useState(false);
  const { subscriptions } = useSubscriptions();

  // Vérifier si le rechargement automatique est activé
  useEffect(() => {
    const autoRechargeSettings = JSON.parse(
      localStorage.getItem("autoRechargeSettings") || "{}"
    );
    setHasAutoRecharge(autoRechargeSettings.enabled || false);
  }, []);

  const handleActivateAutoRecharge = () => {
    navigate("/dashboard/topup?tab=auto-recharge");
  };

  const handleCancel = async (id: string) => {
    try {
      // API call to cancel subscription
      await new Promise((resolve) => setTimeout(resolve, 1000));

      addNotification({
        type: "success",
        message: "Abonnement annulé avec succès",
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: "Erreur lors de l'annulation",
      });
    }
  };

  const handlePause = async (id: string) => {
    try {
      // API call to pause subscription
      await new Promise((resolve) => setTimeout(resolve, 1000));

      addNotification({
        type: "success",
        message: "Abonnement mis en pause",
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: "Erreur lors de la mise en pause",
      });
    }
  };

  const handleResume = async (id: string) => {
    try {
      // API call to resume subscription
      await new Promise((resolve) => setTimeout(resolve, 1000));

      addNotification({
        type: "success",
        message: "Abonnement réactivé",
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: "Erreur lors de la réactivation",
      });
    }
  };

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    if (selectedType !== "all" && subscription.type !== selectedType)
      return false;
    if (
      search &&
      !subscription.influencer.username
        .toLowerCase()
        .includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Abonnements</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos abonnements automatiques
          </p>
        </div>

        {!hasAutoRecharge && subscriptions.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Protection de vos abonnements
                </h3>
                <p className="mt-2 text-sm text-yellow-700">
                  Pour éviter toute interruption de vos abonnements en cas de
                  solde insuffisant, nous vous recommandons d'activer le
                  rechargement automatique.
                </p>
                <Button className="mt-3" onClick={handleActivateAutoRecharge}>
                  Activer le rechargement automatique
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant={selectedType === "all" ? "primary" : "outline"}
              onClick={() => setSelectedType("all")}
            >
              Tous
            </Button>
            <Button
              variant={selectedType === "follow" ? "primary" : "outline"}
              onClick={() => setSelectedType("follow")}
            >
              Follow
            </Button>
            <Button
              variant={selectedType === "like" ? "primary" : "outline"}
              onClick={() => setSelectedType("like")}
            >
              Like
            </Button>
            <Button
              variant={selectedType === "comment" ? "primary" : "outline"}
              onClick={() => setSelectedType("comment")}
            >
              Comment
            </Button>
            <Button
              variant={selectedType === "repost_story" ? "primary" : "outline"}
              onClick={() => setSelectedType("repost_story")}
            >
              Repost
            </Button>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Service
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Influenceur
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cible
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Prix
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Statut
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Prochain renouvellement
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Historique
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <ServiceIcon type={subscription.type} />
                      <span className="capitalize">{subscription.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={subscription.influencer.profileImage}
                        alt={subscription.influencer.username}
                        className="h-8 w-8 rounded-full"
                      />
                      <span className="ml-2">
                        {subscription.influencer.username}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subscription.target}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subscription.price.toFixed(2)} €
                    {subscription.type === "follow" ? "/mois" : "/post"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={subscription.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subscription.nextRenewal ? (
                      format(subscription.nextRenewal, "dd/MM/yyyy", {
                        locale: fr,
                      })
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={subscription.history.url}
                      className="flex items-center text-purple-600 hover:text-purple-700"
                    >
                      <History className="h-4 w-4 mr-1" />
                      {subscription.type === "follow"
                        ? `${subscription.history.total} mois`
                        : `${subscription.history.total} posts`}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {subscription.status === "active" ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePause(subscription.id)}
                          >
                            Mettre en pause
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancel(subscription.id)}
                          >
                            Annuler
                          </Button>
                        </>
                      ) : subscription.status === "paused" ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleResume(subscription.id)}
                          >
                            Reprendre
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancel(subscription.id)}
                          >
                            Annuler
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun abonnement trouvé</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
