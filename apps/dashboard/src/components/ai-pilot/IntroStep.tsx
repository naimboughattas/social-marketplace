import { Sparkles } from 'lucide-react';

export default function IntroStep() {
  return (
    <div className="space-y-4">
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-purple-900 mb-2">
          Qu'est-ce que l'IA Pilot ?
        </h3>
        <p className="text-sm text-purple-700">
          L'IA Pilot est votre assistant intelligent qui optimise vos campagnes d'influence en :
        </p>
        <ul className="mt-2 space-y-2 text-sm text-purple-700">
          <li>• Analysant des millions de données pour trouver les influenceurs les plus pertinents</li>
          <li>• Optimisant votre budget pour maximiser l'impact et le ROI</li>
          <li>• Équilibrant la distribution géographique et démographique</li>
          <li>• Suggérant les meilleures combinaisons d'influenceurs selon vos objectifs</li>
        </ul>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Comment ça marche ?</h4>
        <p className="text-sm text-blue-700">
          1. Choisissez le type d'interaction souhaité<br />
          2. Définissez votre cible<br />
          3. Configurez vos préférences (budget, quantité, localisation)<br />
          4. Notre IA vous propose deux suggestions optimisées :<br />
          &nbsp;&nbsp;&nbsp;- La meilleure sélection selon vos critères<br />
          &nbsp;&nbsp;&nbsp;- La sélection maximisant le nombre d'influenceurs
        </p>
      </div>
    </div>
  );
}