import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  Search,
  UserPlus,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useNotifications } from "../lib/notifications";
import { formatDate } from "../lib/utils";
import Button from "../components/Button";
import Input from "../components/Input";
import ReasonModal from "../components/ReasonModal";
import OrderFilters from "../components/orders/OrderFilters";
import DeliveryProofModal from "../components/orders/DeliveryProofModal";
import * as Tooltip from "@radix-ui/react-tooltip";
import { getTimeLeft } from "../components/TimeRemaining";
import PlatformIcon from "../components/PlatformIcon";
import ServiceIcon from "../components/ServiceIcon";
import { Platform, Service } from "../lib/types";
import { useOrders } from "../lib/hooks/useOrders";

type OrderStatus =
  | "pending"
  | "in_progress"
  | "delivered"
  | "completed"
  | "refused"
  | "cancelled"
  | "expired"
  | "disputed";

interface Order {
  id: string;
  orderNumber: number;
  date: Date;
  platform: Platform;
  influencer: {
    id: string;
    username: string;
    profileImage: string;
  };
  service: Service;
  target: string;
  price: number;
  status: OrderStatus;
  acceptedAt: Date | null;
  deliveredAt: Date | null;
  confirmedAt?: Date | null;
  disputeReason?: string;
  proofUrl?: string;
}

interface OrderFilters {
  startDate: string;
  endDate: string;
  minPrice: string;
  maxPrice: string;
  services: Service[];
  platforms: Platform[];
  influencer: string;
}

const defaultFilters: OrderFilters = {
  startDate: "",
  endDate: "",
  minPrice: "",
  maxPrice: "",
  services: [],
  platforms: [],
  influencer: "",
};

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  delivered: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  refused: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
  expired: "bg-orange-100 text-orange-800",
  disputed: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "En attente",
  in_progress: "En cours",
  delivered: "Livrée",
  completed: "Terminée",
  refused: "Refusée",
  cancelled: "Annulée",
  expired: "Expirée",
  disputed: "Contestée",
};

export default function Orders() {
  const { addNotification } = useNotifications();
  const [selectedTab, setSelectedTab] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderFilters>(defaultFilters);

  const { orders, handleDispute, handleAcceptDelivery, handleArchive } =
    useOrders();

  // const handleDispute = (orderId: string, reason: string) => {
  //   setOrders(
  //     orders.map((o) =>
  //       o.id === orderId
  //         ? {
  //             ...o,
  //             status: "disputed" as OrderStatus,
  //             disputeReason: reason,
  //           }
  //         : o
  //     )
  //   );

  //   addNotification({
  //     type: "success",
  //     message: "Livraison contestée",
  //   });
  // };

  // const handleAcceptDelivery = (orderId: string) => {
  //   setOrders(
  //     orders.map((o) =>
  //       o.id === orderId
  //         ? {
  //             ...o,
  //             status: "completed",
  //             confirmedAt: new Date(),
  //           }
  //         : o
  //     )
  //   );

  //   addNotification({
  //     type: "success",
  //     message: "Livraison acceptée",
  //   });
  // };

  const handleViewProof = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowProofModal(true);
  };

  const handleConfirmDelivery = () => {
    if (selectedOrderId) {
      handleAcceptDelivery(selectedOrderId);
    }
  };

  const handleDisputeDelivery = () => {
    setShowProofModal(false);
    setShowDisputeModal(true);
  };

  const handleCloseProofModal = () => {
    setShowProofModal(false);
    setSelectedOrderId(null);
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedTab !== "all" && order.status !== selectedTab) return false;
    if (
      search &&
      !order.influencer.username.toLowerCase().includes(search.toLowerCase())
    )
      return false;

    // Date filters
    if (filters.startDate && new Date(filters.startDate) > order.date)
      return false;
    if (filters.endDate && new Date(filters.endDate) < order.date) return false;

    // Price filters
    if (filters.minPrice && order.price < parseFloat(filters.minPrice))
      return false;
    if (filters.maxPrice && order.price > parseFloat(filters.maxPrice))
      return false;

    // Service filter
    if (
      filters.services.length > 0 &&
      !filters.services.includes(order.service)
    )
      return false;

    // Platform filter
    if (
      filters.platforms.length > 0 &&
      !filters.platforms.includes(order.platform)
    )
      return false;

    return true;
  });

  const selectedOrder = selectedOrderId
    ? orders.find((o) => o.id === selectedOrderId)
    : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Commandes</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez et suivez vos commandes d'engagement
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant={selectedTab === "all" ? "primary" : "outline"}
              onClick={() => setSelectedTab("all")}
            >
              Toutes
            </Button>
            <Button
              variant={selectedTab === "pending" ? "primary" : "outline"}
              onClick={() => setSelectedTab("pending")}
            >
              En attente
            </Button>
            <Button
              variant={selectedTab === "in_progress" ? "primary" : "outline"}
              onClick={() => setSelectedTab("in_progress")}
            >
              En cours
            </Button>
            <Button
              variant={selectedTab === "delivered" ? "primary" : "outline"}
              onClick={() => setSelectedTab("delivered")}
            >
              Livrée
            </Button>
            <Button
              variant={selectedTab === "completed" ? "primary" : "outline"}
              onClick={() => setSelectedTab("completed")}
            >
              Terminée
            </Button>
            <Button
              variant={selectedTab === "disputed" ? "primary" : "outline"}
              onClick={() => setSelectedTab("disputed")}
            >
              Contestée
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <OrderFilters
              filters={filters}
              onFiltersChange={setFilters}
              onReset={() => setFilters(defaultFilters)}
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
                  N°
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
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
                  Plateforme
                </th>
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Tooltip.Provider>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <div className="flex items-center">
                            <img
                              src={order.influencer.profileImage}
                              alt={order.influencer.username}
                              className="h-8 w-8 rounded-full"
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
                            sideOffset={5}
                          >
                            {order.influencer.username}
                            <Tooltip.Arrow className="fill-gray-900" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PlatformIcon platform={order.platform} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ServiceIcon service={order.service} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.service === "follow" ? (
                      order.target
                    ) : (
                      <a
                        href={order.target}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-purple-600 hover:text-purple-700"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Voir le post
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.price.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusStyles[order.status]
                        }`}
                      >
                        {statusLabels[order.status]}
                      </span>
                      {(order.status === "in_progress" ||
                        order.status === "delivered") &&
                        order.acceptedAt && (
                          <Tooltip.Provider>
                            <Tooltip.Root>
                              <Tooltip.Trigger asChild>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <Clock className="h-4 w-4" />
                                </button>
                              </Tooltip.Trigger>
                              <Tooltip.Portal>
                                <Tooltip.Content
                                  className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
                                  sideOffset={5}
                                >
                                  {getTimeLeft(
                                    order.acceptedAt,
                                    order.status === "in_progress"
                                      ? "delivery"
                                      : "validation"
                                  )}
                                  <Tooltip.Arrow className="fill-gray-900" />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            </Tooltip.Root>
                          </Tooltip.Provider>
                        )}
                      {order.disputeReason && (
                        <Tooltip.Provider>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <button className="text-red-500 hover:text-red-600">
                                <AlertCircle className="h-4 w-4" />
                              </button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
                                sideOffset={5}
                              >
                                {order.disputeReason}
                                <Tooltip.Arrow className="fill-gray-900" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </Tooltip.Provider>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {(order.status === "delivered" ||
                        order.status === "completed") &&
                        order.proofUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProof(order.id)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Voir preuve
                          </Button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <DeliveryProofModal
          isOpen={showProofModal}
          proofUrl={selectedOrder.proofUrl || ""}
          onConfirm={handleConfirmDelivery}
          onDispute={handleDisputeDelivery}
          onClose={
            selectedOrder.confirmedAt ? handleCloseProofModal : undefined
          }
          confirmedAt={selectedOrder.confirmedAt}
        />
      )}

      <ReasonModal
        isOpen={showDisputeModal}
        onClose={() => {
          setShowDisputeModal(false);
          setSelectedOrderId(null);
        }}
        onSubmit={(reason) => {
          if (selectedOrderId) {
            handleDispute(selectedOrderId, reason);
          }
        }}
        title="Contester la livraison"
        description="Veuillez indiquer le motif de votre contestation"
      />
    </DashboardLayout>
  );
}
