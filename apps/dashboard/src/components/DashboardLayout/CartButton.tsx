import Button from '../Button';

interface CartButtonProps {
  count: number;
  onClick: () => void;
}

export default function CartButton({ count, onClick }: CartButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
    >
      Panier ({count})
    </Button>
  );
}