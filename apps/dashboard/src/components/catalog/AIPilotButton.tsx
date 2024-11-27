import { Sparkles } from 'lucide-react';
import Button from '../Button';

interface AIPilotButtonProps {
  onClick: () => void;
  className?: string;
}

export default function AIPilotButton({ onClick, className }: AIPilotButtonProps) {
  return (
    <Button
      variant="primary"
      onClick={onClick}
      className={`bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg ${className}`}
    >
      <Sparkles className="h-4 w-4 mr-2" />
      IA Pilot
    </Button>
  );
}