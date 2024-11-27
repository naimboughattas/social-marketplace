import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: 'Général',
    question: 'Comment fonctionne la plateforme ?',
    answer: 'Notre plateforme met en relation les entreprises avec des influenceurs vérifiés. Les entreprises peuvent commander des services d\'engagement (follows, likes, commentaires, etc.) directement depuis notre catalogue.'
  },
  {
    category: 'Général',
    question: 'Comment sont vérifiés les influenceurs ?',
    answer: 'Chaque influenceur doit passer par un processus de vérification qui inclut la validation de son identité et de la propriété de ses comptes sociaux.'
  },
  {
    category: 'Paiements',
    question: 'Quels sont les moyens de paiement acceptés ?',
    answer: 'Nous acceptons les cartes bancaires, PayPal et les virements bancaires.'
  },
  {
    category: 'Paiements',
    question: 'Comment fonctionne le système de solde ?',
    answer: 'Vous rechargez votre solde à l\'avance et les montants sont déduits au fur et à mesure de vos commandes.'
  },
  {
    category: 'Commandes',
    question: 'Quel est le délai de livraison moyen ?',
    answer: 'Le délai moyen est de 24 à 48h, mais il peut varier selon les influenceurs et les services.'
  },
  {
    category: 'Commandes',
    question: 'Que faire si je ne suis pas satisfait ?',
    answer: 'Vous pouvez contester une livraison dans les 24h. Notre équipe examinera votre demande et pourra procéder à un remboursement si nécessaire.'
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(faqData.map(item => item.category))];

  const toggleItem = (question: string) => {
    setOpenItems(prev => 
      prev.includes(question)
        ? prev.filter(q => q !== question)
        : [...prev, question]
    );
  };

  const filteredFAQ = faqData.filter(item =>
    selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">FAQ</h2>
          <p className="mt-1 text-sm text-gray-500">
            Trouvez rapidement des réponses à vos questions
          </p>
        </div>

        {/* Catégories */}
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category === 'all' ? 'Toutes les catégories' : category}
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
                <span className="font-medium text-gray-900">{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    openItems.includes(item.question) ? 'rotate-180' : ''
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
    </DashboardLayout>
  );
}