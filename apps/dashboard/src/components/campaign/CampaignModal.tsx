import { useState } from "react";
import { X, Megaphone } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import Button from "../Button";
import { Service, Platform } from "../../lib/types";
import { useNotifications } from "../../lib/notifications";
import { useCart } from "../../lib/cart";
import IntroStep from "./IntroStep";
import ServiceStep from "./ServiceStep";
import InteractionTypeStep from "./InteractionTypeStep";
import TargetStep from "./TargetStep";
import PostSelectionStep from "./PostSelectionStep";
import CommentOptionsStep from "./CommentOptionsStep";
import SettingsStep from "./SettingsStep";
import ConfirmationStep from "./ConfirmationStep";

type Step =
  | "intro"
  | "service"
  | "type"
  | "target"
  | "posts"
  | "comment"
  | "settings"
  | "confirmation";
type InteractionType =
  | "specific"
  | "monthly"
  | "specific-future"
  | "future"
  | "one-month";
type CommentType = "custom" | "delegated";
type CommentLength = "emoji" | "short" | "medium" | "long";

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: Platform;
}

export default function CampaignModal({
  isOpen,
  onClose,
  platform,
}: CampaignModalProps) {
  const { addNotification } = useNotifications();
  const { addItem } = useCart();
  const [step, setStep] = useState<Step>("intro");
  const [selectedService, setSelectedService] = useState<Service>("like");
  const [interactionType, setInteractionType] =
    useState<InteractionType>("specific");
  const [target, setTarget] = useState("");
  const [showPostSelection, setShowPostSelection] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [postUrl, setPostUrl] = useState("");
  const [commentType, setCommentType] = useState<CommentType>("custom");
  const [commentText, setCommentText] = useState("");
  const [commentLength, setCommentLength] = useState<CommentLength>("short");
  const [commentExample, setCommentExample] = useState("");
  const [settings, setSettings] = useState({
    category: "",
    country: "",
    city: "",
    language: "",
    quantity: 5,
    maxCostPerInteraction: 0,
    budget: 100,
  });

  const resetForm = () => {
    setStep("intro");
    setSelectedService("like");
    setInteractionType("specific");
    setTarget("");
    setShowPostSelection(true);
    setSelectedPosts([]);
    setPostUrl("");
    setCommentType("custom");
    setCommentText("");
    setCommentLength("short");
    setCommentExample("");
    setSettings({
      category: "",
      country: "",
      city: "",
      language: "",
      quantity: 5,
      maxCostPerInteraction: 0,
      budget: 100,
    });
  };

  const handleNext = () => {
    if (step === "intro") {
      setStep("service");
    } else if (step === "service") {
      setStep("type");
    } else if (step === "type") {
      setStep("target");
    } else if (step === "target") {
      if (!target) {
        addNotification({
          type: "error",
          message: "Veuillez entrer une cible",
        });
        return;
      }
      if (selectedService === "follow") {
        setStep("settings");
      } else if (interactionType === "future") {
        setStep("settings");
      } else {
        setStep("posts");
      }
    } else if (step === "posts") {
      if (!showPostSelection && !postUrl) {
        addNotification({
          type: "error",
          message: "Veuillez entrer une URL",
        });
        return;
      }
      if (showPostSelection && selectedPosts.length === 0) {
        addNotification({
          type: "error",
          message: "Veuillez sélectionner au moins un post",
        });
        return;
      }
      if (selectedService === "comment") {
        setStep("comment");
      } else {
        setStep("settings");
      }
    } else if (step === "comment") {
      if (commentType === "custom" && !commentText) {
        addNotification({
          type: "error",
          message: "Veuillez entrer un commentaire",
        });
        return;
      }
      setStep("settings");
    } else if (step === "settings") {
      if (
        settings.quantity <= 0 ||
        settings.budget <= 0 ||
        settings.maxCostPerInteraction <= 0
      ) {
        addNotification({
          type: "error",
          message: "Veuillez entrer des valeurs valides",
        });
        return;
      }
      setStep("confirmation");
    } else if (step === "confirmation") {
      handleSubmit();
    }
  };

  const handleBack = () => {
    const prevSteps: Record<Step, Step> = {
      service: "intro",
      type: "service",
      target: "type",
      posts: "target",
      comment: "posts",
      settings:
        selectedService === "comment"
          ? "comment"
          : selectedService === "follow" || interactionType === "future"
            ? "target"
            : "posts",
      confirmation: "settings",
      intro: "intro",
    };
    setStep(prevSteps[step]);
  };

  const handleSubmit = () => {
    try {
      let finalTarget = target;
      let finalCommentText = undefined;

      if (selectedService !== "follow" && interactionType !== "future") {
        const posts = showPostSelection ? selectedPosts : [postUrl];
        finalTarget = posts.join("|");
      }

      if (selectedService === "comment") {
        finalCommentText =
          commentType === "custom"
            ? commentText
            : `[${commentLength}]${
                commentExample ? ` Exemple: ${commentExample}` : ""
              }`;
      }

      // Créer la campagne
      addItem({
        influencerUsername: "CAMPAIGN",
        service: selectedService,
        price: settings.maxCostPerInteraction,
        targetHandle: finalTarget,
        postUrl: finalTarget,
        commentText: finalCommentText,
        isFuturePosts:
          interactionType === "future" || interactionType === "specific-future",
        isRecurring:
          selectedService === "follow" && interactionType === "monthly",
        isCampaign: true,
        campaignSettings: settings,
      });

      addNotification({
        type: "success",
        message: "Campagne créée avec succès",
      });

      resetForm();
      onClose();
    } catch (error) {
      addNotification({
        type: "error",
        message: "Erreur lors de la création de la campagne",
      });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed z-50 top-32 left-1/2 -translate-x-1/2 bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Megaphone className="h-5 w-5 text-purple-600" />
              <Dialog.Title className="text-lg font-medium">
                Publier une annonce
              </Dialog.Title>
            </div>
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-6">
            {step === "intro" && <IntroStep />}
            {step === "service" && (
              <ServiceStep
                selectedService={selectedService}
                onServiceSelect={setSelectedService}
              />
            )}
            {step === "type" && (
              <InteractionTypeStep
                service={selectedService}
                interactionType={interactionType}
                onInteractionTypeSelect={setInteractionType}
              />
            )}
            {step === "target" && (
              <TargetStep
                service={selectedService}
                target={target}
                onTargetChange={setTarget}
              />
            )}
            {step === "posts" && (
              <PostSelectionStep
                target={target}
                showPostSelection={showPostSelection}
                selectedPosts={selectedPosts}
                postUrl={postUrl}
                onShowPostSelectionChange={setShowPostSelection}
                onSelectedPostsChange={setSelectedPosts}
                onPostUrlChange={setPostUrl}
              />
            )}
            {step === "comment" && (
              <CommentOptionsStep
                commentType={commentType}
                onCommentTypeChange={setCommentType}
                commentText={commentText}
                onCommentTextChange={setCommentText}
                commentLength={commentLength}
                onCommentLengthChange={setCommentLength}
                commentExample={commentExample}
                onCommentExampleChange={setCommentExample}
              />
            )}
            {step === "settings" && (
              <SettingsStep
                settings={settings}
                onSettingsChange={setSettings}
                service={selectedService}
              />
            )}
            {step === "confirmation" && (
              <ConfirmationStep
                service={selectedService}
                target={target}
                settings={settings}
                interactionType={interactionType}
                isCampaign={true}
              />
            )}

            <div className="flex justify-between pt-4 border-t">
              {step !== "intro" && (
                <Button variant="outline" onClick={handleBack}>
                  Retour
                </Button>
              )}
              <div className="ml-auto">
                <Button variant="outline" onClick={onClose} className="mr-2">
                  Annuler
                </Button>
                <Button onClick={handleNext}>
                  {step === "confirmation"
                    ? "Publier la campagne"
                    : "Continuer"}
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
