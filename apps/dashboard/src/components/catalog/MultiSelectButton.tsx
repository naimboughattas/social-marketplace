import Button from '../Button';

interface MultiSelectButtonProps {
  onClick: () => void;
  className?: string;
}

export default function MultiSelectButton({ onClick, className }: MultiSelectButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={className}
    >
      Sélection multiple
    </Button>
  );
}