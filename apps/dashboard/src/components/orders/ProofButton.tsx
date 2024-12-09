import { ExternalLink } from 'lucide-react';
import Button from '../Button';
import * as Tooltip from '@radix-ui/react-tooltip';

interface ProofButtonProps {
  proofUrl?: string;
}

export default function ProofButton({ proofUrl }: ProofButtonProps) {
  if (!proofUrl) return null;

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(proofUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Voir preuve
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
            sideOffset={5}
          >
            Voir la preuve de livraison
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}