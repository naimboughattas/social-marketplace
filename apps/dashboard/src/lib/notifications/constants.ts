import { NotificationType } from '../types/notifications';

export const NOTIFICATION_TITLES: Record<NotificationType, string> = {
  order_status: 'Mise à jour de commande',
  new_order: 'Nouvelle commande',
  new_proposal: 'Nouvelle proposition',
  funds_added: 'Fonds ajoutés',
  earnings_received: 'Gains reçus',
  withdrawal_status: 'Statut du retrait',
  support_reply: 'Réponse du support',
  account_verified: 'Compte vérifié',
  subscription_renewal: 'Renouvellement d\'abonnement',
  subscription_failed: 'Échec d\'abonnement',
  level_up: 'Niveau supérieur',
  achievement_unlocked: 'Succès débloqué'
};

export const NOTIFICATION_MESSAGES: Record<NotificationType, (data?: any) => string> = {
  order_status: (data) => `La commande #${data.orderNumber} est maintenant ${data.status}`,
  new_order: (data) => `Nouvelle commande #${data.orderNumber} reçue`,
  new_proposal: () => 'Vous avez reçu une nouvelle proposition',
  funds_added: (data) => `${data.amount.toFixed(2)} € ont été ajoutés à votre solde`,
  earnings_received: (data) => `${data.amount.toFixed(2)} € de gains ont été ajoutés`,
  withdrawal_status: (data) => `Votre demande de retrait est ${data.status}`,
  support_reply: () => 'Une réponse à votre ticket a été publiée',
  account_verified: () => 'Votre compte a été vérifié avec succès',
  subscription_renewal: (data) => `L'abonnement #${data.orderNumber} a été renouvelé`,
  subscription_failed: (data) => `Le renouvellement de l'abonnement #${data.orderNumber} a échoué`,
  level_up: (data) => `Félicitations ! Vous avez atteint le niveau ${data.levelName}`,
  achievement_unlocked: (data) => `Nouveau succès débloqué : ${data.title}`
};