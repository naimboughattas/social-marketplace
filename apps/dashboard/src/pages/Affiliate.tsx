import { useState, useEffect } from 'react';
import { Copy, Share2, ArrowRight } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import { useAuth } from '../lib/auth';
import { useNotifications } from '../lib/notifications';

interface AffiliateStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  monthlyEarnings: {
    month: string;
    earnings: number;
    referrals: number;
  }[];
}

export default function Affiliate() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [stats, setStats] = useState<AffiliateStats>({
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    monthlyEarnings: []
  });

  // Générer un code d'affiliation unique basé sur l'ID utilisateur
  const affiliateCode = `SB${user?.id?.slice(0, 6).toUpperCase()}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(affiliateCode);
    addNotification({
      type: 'success',
      message: 'Code d\'affiliation copié dans le presse-papier'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Programme d'affiliation</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gagnez 5% de commission sur les commandes passées avec votre code
          </p>
        </div>

        {/* Code d'affiliation */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Votre code d'affiliation</h3>
            <div className="flex items-center space-x-4">
              <code className="flex-1 bg-gray-50 p-4 rounded-lg text-lg font-mono text-purple-600">
                {affiliateCode}
              </code>
              <Button onClick={handleCopyCode}>
                <Copy className="h-4 w-4 mr-2" />
                Copier
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Partagez ce code avec les entreprises pour gagner 5% sur leurs commandes
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Share2 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total parrainages
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalReferrals}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArrowRight className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Parrainages actifs
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.activeReferrals}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="rounded-md bg-purple-500 p-3">
                    <Share2 className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Gains totaux
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalEarnings.toFixed(2)} €
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="rounded-md bg-yellow-500 p-3">
                    <Share2 className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Gains en attente
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.pendingEarnings.toFixed(2)} €
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comment ça marche */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Comment ça marche ?</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Partagez votre code</p>
                <p className="text-sm text-gray-500">
                  Partagez votre code d'affiliation avec les entreprises qui pourraient être intéressées par nos services
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Les entreprises s'inscrivent</p>
                <p className="text-sm text-gray-500">
                  Quand une entreprise s'inscrit avec votre code, elle est automatiquement liée à votre compte
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Gagnez des commissions</p>
                <p className="text-sm text-gray-500">
                  Vous gagnez 5% sur toutes les commandes passées par les entreprises que vous avez parrainées
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
                4
              </div>
              <div>
                <p className="font-medium text-gray-900">Retirez vos gains</p>
                <p className="text-sm text-gray-500">
                  Les commissions sont ajoutées à votre solde et peuvent être retirées comme vos autres gains
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}