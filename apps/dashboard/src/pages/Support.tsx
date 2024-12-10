import { useMemo, useState } from "react";
import { Tab } from "@headlessui/react";
import {
  Search,
  MessageSquare,
  Plus,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Button from "../components/Button";
import Input from "../components/Input";
import { formatDate } from "../lib/utils";
import { useNotifications } from "../lib/notifications";
import { cn } from "../lib/utils";
import { useTickets } from "../lib/hooks/useTickets";
import { useDisputes } from "../lib/hooks/useDisputes";
import { Timestamp } from "firebase/firestore";

// Types et données mockées importées des anciennes pages...
// FAQ Data
interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: "Général",
    question: "Comment fonctionne la plateforme ?",
    answer:
      "Notre plateforme met en relation les entreprises avec des influenceurs vérifiés. Les entreprises peuvent commander des services d'engagement (follows, likes, commentaires, etc.) directement depuis notre catalogue.",
  },
  {
    category: "Général",
    question: "Comment sont vérifiés les influenceurs ?",
    answer:
      "Chaque influenceur doit passer par un processus de vérification qui inclut la validation de son identité et de la propriété de ses comptes sociaux.",
  },
  {
    category: "Paiements",
    question: "Quels sont les moyens de paiement acceptés ?",
    answer:
      "Nous acceptons les cartes bancaires, PayPal et les virements bancaires.",
  },
  {
    category: "Paiements",
    question: "Comment fonctionne le système de solde ?",
    answer:
      "Vous rechargez votre solde à l'avance et les montants sont déduits au fur et à mesure de vos commandes.",
  },
  {
    category: "Commandes",
    question: "Quel est le délai de livraison moyen ?",
    answer:
      "Le délai moyen est de 24 à 48h, mais il peut varier selon les influenceurs et les services.",
  },
  {
    category: "Commandes",
    question: "Que faire si je ne suis pas satisfait ?",
    answer:
      "Vous pouvez contester une livraison dans les 24h. Notre équipe examinera votre demande et pourra procéder à un remboursement si nécessaire.",
  },
];

// Messages Data
interface Ticket {
  id: string;
  subject: string;
  status: "open" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  lastUpdate: Date;
  messages: {
    id: string;
    sender: "user" | "support";
    content: string;
    timestamp: Date;
  }[];
}

// Disputes Data
interface Dispute {
  id: string;
  orderId: string;
  date: Date;
  service: "follow" | "like" | "comment" | "repost_story";
  influencer: {
    username: string;
    avatar: string;
  };
  reason: string;
  status: "pending" | "in_progress" | "resolved" | "rejected";
  messages: {
    id: string;
    sender: string;
    content: string;
    timestamp: Date;
  }[];
}

const priorityStyles = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const priorityLabels = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
};

const statusStyles = {
  open: "bg-purple-100 text-purple-800",
  closed: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels = {
  open: "Ouvert",
  closed: "Fermé",
  pending: "En attente",
  in_progress: "En cours",
  resolved: "Résolu",
  rejected: "Rejeté",
};

export default function Support() {
  const { addNotification } = useNotifications();

  // FAQ State
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const categories = ["all", ...new Set(faqData.map((item) => item.category))];

  // Messages State
  const { tickets, handleCreateTicket, handleUpdateTicket } = useTickets();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) || null,
    [tickets, selectedTicketId]
  );
  const [ticketSearch, setTicketSearch] = useState("");
  const [message, setMessage] = useState("");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState("");

  // Disputes State
  const { disputes, handleUpdateDispute } = useDisputes();
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(
    null
  );
  const selectedDispute = useMemo(
    () => disputes.find((dispute) => dispute.id === selectedDisputeId) || null,
    [disputes, selectedDisputeId]
  );
  console.log("selectedDisputeId", selectedDisputeId);
  const [disputeSearch, setDisputeSearch] = useState("");

  // FAQ Functions
  const toggleItem = (question: string) => {
    setOpenItems((prev) =>
      prev.includes(question)
        ? prev.filter((q) => q !== question)
        : [...prev, question]
    );
  };

  const filteredFAQ = faqData.filter(
    (item) => selectedCategory === "all" || item.category === selectedCategory
  );

  // Messages Functions
  const filteredTickets = tickets.filter((ticket) =>
    ticket.subject.toLowerCase().includes(ticketSearch.toLowerCase())
  );

  const handleSendTicketMessage = async () => {
    if (!message.trim() || !selectedTicket) return;

    const newMessage = {
      id: crypto.randomUUID(),
      sender: "user" as const,
      content: message,
      timestamp: new Date(),
    };
    await handleUpdateTicket(selectedTicket.id, {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage],
      lastUpdate: new Date(),
    });

    const updatedTickets = tickets.map((ticket) => {
      if (ticket.id === selectedTicket.id) {
        return {
          ...ticket,
          messages: [...ticket.messages, newMessage],
          lastUpdate: new Date(),
        };
      }
      return ticket;
    });
    setMessage("");
    addNotification({
      type: "success",
      message: "Message envoyé",
    });
  };

  const handleSendDisputeMessage = async () => {
    if (!message.trim() || !selectedDispute) return;

    const newMessage = {
      id: crypto.randomUUID(),
      sender: "user" as const,
      content: message,
      timestamp: new Date(),
    };
    await handleUpdateDispute(selectedDispute.id, {
      ...selectedDispute,
      messages: [...selectedDispute.messages, newMessage],
      lastUpdate: new Date(),
    });

    setMessage("");
    addNotification({
      type: "success",
      message: "Message envoyé",
    });
  };

  // Disputes Functions
  const filteredDisputes = disputes.filter(
    (dispute) =>
      dispute.orderId.includes(disputeSearch) ||
      dispute.influencer.username
        .toLowerCase()
        .includes(disputeSearch.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Support</h2>
          <p className="mt-1 text-sm text-gray-500">
            Consultez la FAQ, contactez le support ou gérez vos litiges
          </p>
        </div>

        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-purple-100 p-1">
            <Tab
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-purple-700 shadow"
                    : "text-purple-600 hover:bg-white/[0.12] hover:text-purple-800"
                )
              }
            >
              FAQ
            </Tab>
            <Tab
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-purple-700 shadow"
                    : "text-purple-600 hover:bg-white/[0.12] hover:text-purple-800"
                )
              }
            >
              Messages
            </Tab>
            <Tab
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-purple-700 shadow"
                    : "text-purple-600 hover:bg-white/[0.12] hover:text-purple-800"
                )
              }
            >
              Litiges
            </Tab>
          </Tab.List>

          <Tab.Panels>
            {/* FAQ Panel */}
            <Tab.Panel>
              <div className="space-y-6">
                {/* Catégories */}
                <div className="flex space-x-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {category === "all" ? "Toutes les catégories" : category}
                    </button>
                  ))}
                </div>

                {/* Questions/Réponses */}
                <div className="bg-white shadow rounded-lg divide-y">
                  {filteredFAQ.map((item) => (
                    <div key={item.question} className="p-4">
                      <button
                        onClick={() => toggleItem(item.question)}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <span className="font-medium text-gray-900">
                          {item.question}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-500 transition-transform ${
                            openItems.includes(item.question)
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                      {openItems.includes(item.question) && (
                        <p className="mt-2 text-gray-600">{item.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Tab.Panel>

            {/* Messages Panel */}
            <Tab.Panel>
              <div className="h-[calc(100vh-16rem)] flex bg-white shadow rounded-lg">
                {/* Tickets list */}
                <div className="w-96 border-r">
                  <div className="p-4 border-b space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Tickets</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowNewTicket(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau ticket
                      </Button>
                    </div>
                    <Input
                      placeholder="Rechercher un ticket..."
                      value={ticketSearch}
                      onChange={(e) => setTicketSearch(e.target.value)}
                      icon={Search}
                    />
                  </div>

                  <div className="overflow-y-auto h-[calc(100%-7rem)]">
                    {filteredTickets.map((ticket) => (
                      <button
                        key={ticket.id}
                        onClick={() => setSelectedTicketId(ticket.id)}
                        className={`w-full p-4 text-left hover:bg-gray-50 ${
                          selectedTicket?.id === ticket.id ? "bg-purple-50" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 line-clamp-1">
                              {ticket.subject}
                            </p>
                            <div className="mt-1 flex items-center space-x-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  statusStyles[ticket.status]
                                }`}
                              >
                                {statusLabels[ticket.status]}
                              </span>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  priorityStyles[ticket.priority]
                                }`}
                              >
                                {priorityLabels[ticket.priority]}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 ml-4">
                            {formatDate(ticket.lastUpdate)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat area */}
                {selectedTicket ? (
                  <div className="flex-1 flex flex-col">
                    {/* Ticket header */}
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="font-medium text-gray-900">
                            {selectedTicket.subject}
                          </h2>
                          <div className="mt-1 flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                statusStyles[selectedTicket.status]
                              }`}
                            >
                              {statusLabels[selectedTicket.status]}
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                priorityStyles[selectedTicket.priority]
                              }`}
                            >
                              {priorityLabels[selectedTicket.priority]}
                            </span>
                            <span className="text-xs text-gray-500">
                              Créé le {formatDate(selectedTicket.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {selectedTicket.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.sender === "user"
                                ? "bg-purple-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.sender === "user"
                                  ? "text-purple-200"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatDate(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    {selectedTicket.status === "open" && (
                      <div className="p-4 border-t">
                        <div className="flex space-x-4">
                          <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Votre message..."
                            className="flex-1"
                          />
                          <Button onClick={() => handleSendTicketMessage()}>
                            Envoyer
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Aucun ticket sélectionné
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Sélectionnez un ticket pour voir la conversation
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Tab.Panel>

            {/* Disputes Panel */}
            <Tab.Panel>
              <div className="h-[calc(100vh-16rem)] flex bg-white shadow rounded-lg">
                {/* Disputes list */}
                <div className="w-96 border-r">
                  <div className="p-4 border-b">
                    <Input
                      placeholder="Rechercher un litige..."
                      value={disputeSearch}
                      onChange={(e) => setDisputeSearch(e.target.value)}
                      icon={Search}
                    />
                  </div>

                  <div className="overflow-y-auto h-[calc(100%-5rem)]">
                    {filteredDisputes.map((dispute) => (
                      <button
                        key={dispute.id}
                        onClick={() => setSelectedDisputeId(dispute.id)}
                        className={`w-full p-4 text-left hover:bg-gray-50 ${
                          selectedDisputeId === dispute.id ? "bg-purple-50" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <img
                              src={dispute.influencer.avatar}
                              alt={dispute.influencer.username}
                              className="h-10 w-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                Commande #{dispute.orderId}
                              </p>
                              <p className="text-sm text-gray-500">
                                {dispute.influencer.username}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              statusStyles[dispute.status]
                            }`}
                          >
                            {statusLabels[dispute.status]}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {dispute.reason}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatDate(dispute.date)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dispute details */}
                {selectedDispute ? (
                  <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-lg font-medium text-gray-900">
                            Litige #{selectedDispute.orderId}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {selectedDispute.influencer.username} •{" "}
                            {formatDate(selectedDispute.date)}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusStyles[selectedDispute.status]
                          }`}
                        >
                          {statusLabels[selectedDispute.status]}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        {selectedDispute.reason}
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {selectedDispute.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.sender === "user"
                                ? "bg-purple-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.sender === "user"
                                  ? "text-purple-200"
                                  : "text-gray-500"
                              }`}
                            >
                              {new Timestamp(
                                msg.timestamp.seconds,
                                msg.timestamp.nanoseconds
                              )
                                .toDate()
                                .toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    {selectedDispute.status !== "resolved" && (
                      <div className="p-4 border-t">
                        <div className="flex space-x-4">
                          <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Votre message..."
                            className="flex-1"
                          />
                          <Button onClick={() => handleSendDisputeMessage()}>
                            Envoyer
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Aucun litige sélectionné
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Sélectionnez un litige pour voir les détails
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* New ticket modal */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Nouveau ticket
            </h3>
            <div className="space-y-4">
              <Input
                label="Sujet"
                value={newTicketSubject}
                onChange={(e) => setNewTicketSubject(e.target.value)}
                placeholder="Décrivez brièvement votre problème"
                required
              />
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowNewTicket(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={() => {
                    // Handle create ticket
                    handleCreateTicket({
                      subject: newTicketSubject,
                      status: "open",
                      priority: "medium",
                      createdAt: new Date(),
                      lastUpdate: new Date(),
                      messages: [
                        {
                          id: crypto.randomUUID(),
                          sender: "user",
                          content: newTicketSubject,
                          timestamp: new Date(),
                        },
                      ],
                    });
                  }}
                >
                  Créer le ticket
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
