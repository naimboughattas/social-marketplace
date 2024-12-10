import { useState } from "react";
import { Plus, CreditCard, Building2, Wallet, X } from "lucide-react";
import Button from "../Button";
import Input from "../Input";
import { useNotifications } from "../../lib/notifications";
import { usePaymentMethods } from "../../lib/hooks/usePaymentMethods";

interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "paypal";
  name: string;
  details: {
    cardLast4?: string;
    cardExpiry?: string;
    cardCVC?: string;
    iban?: string;
    bic?: string;
    accountName?: string;
    email?: string;
  };
  isDefault: boolean;
}

export default function PaymentMethodList() {
  const { addNotification } = useNotifications();
  const { paymentMethods: methods } = usePaymentMethods();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMethod, setNewMethod] = useState<Partial<PaymentMethod>>({
    type: "card",
  });

  const handleAddMethod = () => {
    if (!newMethod.type) {
      addNotification({
        type: "error",
        message: "Veuillez sélectionner un type de paiement",
      });
      return;
    }

    if (newMethod.type === "card") {
      if (
        !newMethod.details?.cardLast4 ||
        !newMethod.details?.cardExpiry ||
        !newMethod.details?.cardCVC
      ) {
        addNotification({
          type: "error",
          message: "Veuillez remplir tous les champs",
        });
        return;
      }
    } else if (newMethod.type === "bank") {
      if (
        !newMethod.details?.iban ||
        !newMethod.details?.bic ||
        !newMethod.details?.accountName
      ) {
        addNotification({
          type: "error",
          message: "Veuillez remplir tous les champs",
        });
        return;
      }
    } else if (newMethod.type === "paypal") {
      if (!newMethod.details?.email) {
        addNotification({
          type: "error",
          message: "Veuillez entrer votre email PayPal",
        });
        return;
      }
    }

    const method: PaymentMethod = {
      id: crypto.randomUUID(),
      type: newMethod.type,
      name:
        newMethod.type === "card"
          ? "Carte bancaire"
          : newMethod.type === "bank"
            ? "Virement bancaire"
            : "PayPal",
      details: newMethod.details || {},
      isDefault: methods.length === 0,
    };

    const updatedMethods = [...methods, method];
    // setMethods(updatedMethods);
    localStorage.setItem("payment_methods", JSON.stringify(updatedMethods));

    setNewMethod({ type: "card" });
    setShowAddForm(false);

    addNotification({
      type: "success",
      message: "Moyen de paiement ajouté avec succès",
    });
  };

  const handleDelete = (id: string) => {
    const updatedMethods = methods.filter((m) => m.id !== id);
    // setMethods(updatedMethods);
    localStorage.setItem("payment_methods", JSON.stringify(updatedMethods));

    addNotification({
      type: "success",
      message: "Moyen de paiement supprimé",
    });
  };

  const handleSetDefault = (id: string) => {
    const updatedMethods = methods.map((m) => ({
      ...m,
      isDefault: m.id === id,
    }));
    // setMethods(updatedMethods);
    localStorage.setItem("payment_methods", JSON.stringify(updatedMethods));

    addNotification({
      type: "success",
      message: "Moyen de paiement par défaut mis à jour",
    });
  };

  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <div
          key={method.id}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {method.type === "card" && (
                <CreditCard className="h-5 w-5 text-gray-400" />
              )}
              {method.type === "bank" && (
                <Building2 className="h-5 w-5 text-gray-400" />
              )}
              {method.type === "paypal" && (
                <Wallet className="h-5 w-5 text-gray-400" />
              )}
              <div>
                <div className="font-medium">{method.name}</div>
                <div className="text-sm text-gray-500">
                  {method.type === "card" && `•••• ${method.details.cardLast4}`}
                  {method.type === "paypal" && method.details.email}
                  {method.type === "bank" &&
                    `IBAN: •••• ${method.details.iban?.slice(-4)}`}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!method.isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetDefault(method.id)}
                >
                  Définir par défaut
                </Button>
              )}
              {method.isDefault && (
                <span className="text-sm text-purple-600 font-medium">
                  Par défaut
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(method.id)}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      ))}

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full p-4 border-2 border-dashed border-gray-200 rounded-lg text-center hover:border-purple-200 hover:bg-purple-50"
        >
          <Plus className="h-6 w-6 mx-auto text-gray-400" />
          <span className="mt-2 block text-sm text-gray-600">
            Ajouter un moyen de paiement
          </span>
        </button>
      ) : (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">Nouveau moyen de paiement</h3>
            <button onClick={() => setShowAddForm(false)}>
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de paiement
              </label>
              <select
                value={newMethod.type}
                onChange={(e) =>
                  setNewMethod({
                    ...newMethod,
                    type: e.target.value as "card" | "bank" | "paypal",
                  })
                }
                className="w-full rounded-md border border-gray-200 p-2"
              >
                <option value="card">Carte bancaire</option>
                <option value="bank">Virement bancaire</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            {newMethod.type === "card" && (
              <>
                <Input
                  label="Numéro de carte"
                  value={newMethod.details?.cardLast4 || ""}
                  onChange={(e) =>
                    setNewMethod({
                      ...newMethod,
                      details: {
                        ...newMethod.details,
                        cardLast4: e.target.value,
                      },
                    })
                  }
                  placeholder="1234 5678 9012 3456"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Date d'expiration"
                    value={newMethod.details?.cardExpiry || ""}
                    onChange={(e) =>
                      setNewMethod({
                        ...newMethod,
                        details: {
                          ...newMethod.details,
                          cardExpiry: e.target.value,
                        },
                      })
                    }
                    placeholder="MM/YY"
                  />
                  <Input
                    label="CVC"
                    value={newMethod.details?.cardCVC || ""}
                    onChange={(e) =>
                      setNewMethod({
                        ...newMethod,
                        details: {
                          ...newMethod.details,
                          cardCVC: e.target.value,
                        },
                      })
                    }
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </>
            )}

            {newMethod.type === "bank" && (
              <>
                <Input
                  label="Titulaire du compte"
                  value={newMethod.details?.accountName || ""}
                  onChange={(e) =>
                    setNewMethod({
                      ...newMethod,
                      details: {
                        ...newMethod.details,
                        accountName: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  label="IBAN"
                  value={newMethod.details?.iban || ""}
                  onChange={(e) =>
                    setNewMethod({
                      ...newMethod,
                      details: {
                        ...newMethod.details,
                        iban: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  label="BIC"
                  value={newMethod.details?.bic || ""}
                  onChange={(e) =>
                    setNewMethod({
                      ...newMethod,
                      details: {
                        ...newMethod.details,
                        bic: e.target.value,
                      },
                    })
                  }
                />
              </>
            )}

            {newMethod.type === "paypal" && (
              <Input
                label="Email PayPal"
                type="email"
                value={newMethod.details?.email || ""}
                onChange={(e) =>
                  setNewMethod({
                    ...newMethod,
                    details: {
                      ...newMethod.details,
                      email: e.target.value,
                    },
                  })
                }
              />
            )}

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddMethod}>Ajouter</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
