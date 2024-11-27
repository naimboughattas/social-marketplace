import { Search } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ 
  message = "Aucun influenceur trouvé" 
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Search className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        {message}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Essayez de modifier vos critères de recherche
      </p>
    </div>
  );
}