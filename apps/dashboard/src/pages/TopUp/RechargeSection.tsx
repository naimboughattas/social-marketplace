import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../lib/notifications";
import { useAuth } from "../../lib/auth";
import PackSelection from "./PackSelection";
import PaymentSection from "./PaymentSection";
import BillingSection from "./BillingSection";
import SummarySection from "./SummarySection";
import CustomAmount from "../../components/topup/CustomAmount";
import { useOrders } from "../../lib/hooks/useOrders";

export const PACKS = [
  { id: 1, amount: 50, bonus: 0 },
  { id: 2, amount: 100, bonus: 5, popular: true },
  { id: 3, amount: 200, bonus: 15 },
  { id: 4, amount: 500, bonus: 50 },
];

interface RechargeSectionProps {
  onChangeTab: (index: number) => void;
}

export default function RechargeSection({ onChangeTab }: RechargeSectionProps) {
  const navigate = useNavigate();
  const { user, updateBalance, updatePendingBalance } = useAuth();
  const { addNotification } = useNotifications();
  const [selectedPack, setSelectedPack] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [selectedBillingProfile, setSelectedBillingProfile] = useState<
    string | null
  >(null);
  const [useEarnings, setUseEarnings] = useState(false);
  const { handleCreateOrder } = useOrders();

  // Charger et sélectionner automatiquement les méthodes par défaut
  useEffect(() => {
    const methods = JSON.parse(localStorage.getItem("payment_methods") || "[]");
    const profiles = JSON.parse(
      localStorage.getItem("billing_profiles") || "[]"
    );

    // Sélectionner la méthode de paiement par défaut ou la première disponible
    const defaultMethod = methods.find((m: any) => m.isDefault) || methods[0];
    if (defaultMethod) {
      setSelectedPaymentMethod(defaultMethod.id);
    }

    // Sélectionner le profil de facturation par défaut ou le premier disponible
    const defaultProfile =
      profiles.find((p: any) => p.isDefault) || profiles[0];
    if (defaultProfile) {
      setSelectedBillingProfile(defaultProfile.id);
    }
  }, []);

  const handlePayment = async () => {
    if (!selectedPaymentMethod || !selectedBillingProfile) {
      await handleCreateOrder({
        amount: selectedAmount,
        paymentMethodId: selectedPaymentMethod,
        billingProfileId: selectedBillingProfile,
      });
      addNotification({
        type: "error",
        message: "Veuillez compléter tous les champs",
      });
      return;
    }

    const totalAmount = customAmount
      ? parseFloat(customAmount)
      : PACKS.find((p) => p.id === selectedPack)?.amount || 0;
    const earningsToUse = useEarnings
      ? Math.min(totalAmount, user?.pendingBalance || 0)
      : 0;
    const remainingAmount = totalAmount - earningsToUse;

    const methods = JSON.parse(localStorage.getItem("payment_methods") || "[]");
    const selectedMethod = methods.find(
      (m: any) => m.id === selectedPaymentMethod
    );

    try {
      if (earningsToUse > 0) {
        // Mettre à jour le solde avec les gains
        updateBalance(earningsToUse);
        // Mettre à jour les gains en attente
        updatePendingBalance(-earningsToUse);
      }

      if (remainingAmount > 0) {
        if (selectedMethod?.type === "bank") {
          addNotification({
            type: "success",
            message:
              "Votre demande a été enregistrée. Nous traiterons votre paiement dès réception du virement.",
          });
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          updateBalance(remainingAmount);
          addNotification({
            type: "success",
            message: "Paiement effectué avec succès",
          });
        }
      } else {
        addNotification({
          type: "success",
          message: "Transfert effectué avec succès",
        });
      }

      navigate("/dashboard/buy");
    } catch (error) {
      addNotification({
        type: "error",
        message: "Erreur lors du paiement",
      });
    }
  };

  const selectedAmount = customAmount
    ? parseFloat(customAmount)
    : PACKS.find((p) => p.id === selectedPack)?.amount || 0;

  return (
    <div className="space-y-6">
      <PackSelection
        packs={PACKS}
        selectedPack={selectedPack}
        onPackSelect={(packId) => {
          setSelectedPack(packId);
          setCustomAmount("");
        }}
      />

      <CustomAmount
        amount={customAmount}
        onAmountChange={(value) => {
          setCustomAmount(value);
          setSelectedPack(null);
        }}
        onReset={() => {
          setCustomAmount("");
          setSelectedPack(null);
        }}
      />

      {(selectedPack || customAmount) && (
        <>
          <PaymentSection
            selectedMethodId={selectedPaymentMethod}
            onMethodSelect={setSelectedPaymentMethod}
            onAddMethod={() => onChangeTab(1)}
          />

          {selectedPaymentMethod && (
            <BillingSection
              selectedProfileId={selectedBillingProfile}
              onProfileSelect={setSelectedBillingProfile}
              onAddProfile={() => onChangeTab(2)}
            />
          )}

          {selectedPaymentMethod && selectedBillingProfile && (
            <SummarySection
              amount={selectedAmount}
              paymentMethodId={selectedPaymentMethod}
              onConfirm={handlePayment}
              useEarnings={useEarnings}
              onUseEarningsChange={setUseEarnings}
            />
          )}
        </>
      )}
    </div>
  );
}
