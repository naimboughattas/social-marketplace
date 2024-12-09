import { Megaphone } from 'lucide-react';

export default function IntroStep() {
  return (
    <div className="space-y-4">
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-purple-900 mb-2">
          Qu'est-ce qu'une campagne ?
        </h3>
        <p className="text-sm text-purple-700">
          Une campagne est une fonctionnalité permettant de publier une demande pour un service 
          (follow, likes, commentaires, reposts) selon des critères spécifiques. Une fois la campagne publiée, 
          la plateforme envoie automatiquement les commandes à un ensemble d'influenceurs qui correspondent 
          à vos paramètres de recherche.
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Comment ça marche ?</h4>
        <div className="space-y-3 text-sm text-blue-700">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
              1
            </div>
            <p>Définissez votre besoin (service, cible, posts)</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
              2
            </div>
            <p>Configurez vos critères de recherche (localisation, langue, etc.)</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
              3
            </div>
            <p>Indiquez le nombre d'influenceurs souhaité</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
              4
            </div>
            <p>Les influenceurs correspondant à vos critères reçoivent la proposition</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
              5
            </div>
            <p>Premier arrivé, premier servi : les influenceurs peuvent accepter jusqu'à ce que le nombre souhaité soit atteint</p>
          </div>
        </div>
      </div>
    </div>
  );
}