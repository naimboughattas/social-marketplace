import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import Button from '../Button';
import { Service, Platform } from '../../lib/types';
import { useNotifications } from '../../lib/notifications';
import { useCart } from '../../lib/cart';
import IntroStep from './IntroStep';
import ServiceStep from './ServiceStep';
import InteractionTypeStep from './InteractionTypeStep';
import TargetStep from './TargetStep';
import SettingsStep from './SettingsStep';
import ConfirmationStep from './ConfirmationStep';
import AIResultsModal from './AIResultsModal';
import { mockInfluencers } from '../../lib/mock-data';

type Step = 'intro' | 'service' | 'type' | 'target' | 'settings' | 'confirmation';
type InteractionType = 'specific' | 'monthly' | 'specific-future' | 'future' | 'one-month';

interface AIPilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: Platform;
}

export default function AIPilotModal({
  isOpen,
  onClose,
  platform
}: AIPilotModalProps) {
  const { addNotification } = useNotifications();
  const [step, setStep] = useState<Step>('intro');
  const [selectedService, setSelectedService] = useState<Service>('like');
  const [interactionType, setInteractionType] = useState<InteractionType>('specific');
  const [target, setTarget] = useState('');
  const [settings, setSettings] = useState({
    category: '',
    country: '',
    city: '',
    language: '',
    quantity: 5,
    budget: 100
  });
  const [showResults, setShowResults] = useState(false);

  // Filtrer les influenceurs par plateforme
  const platformInfluencers = mockInfluencers.filter(inf => inf.platform === platform);

  const handleNext = () => {
    if (step === 'intro') {
      setStep('service');
    } else if (step === 'service') {
      setStep('type');
    } else if (step === 'type') {
      setStep('target');
    } else if (step === 'target') {
      if (!target) {
        addNotification({
          type: 'error',
          message: 'Veuillez entrer une cible'
        });
        return;
      }
      setStep('settings');
    } else if (step === 'settings') {
      if (settings.quantity <= 0 || settings.budget <= 0) {
        addNotification({
          type: 'error',
          message: 'Veuillez entrer des valeurs valides'
        });
        return;
      }
      setStep('confirmation');
    } else if (step === 'confirmation') {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
      return;
    }

    const prevSteps: Record<Step, Step> = {
      service: 'intro',
      type: 'service',
      target: 'type',
      settings: 'target',
      confirmation: 'settings',
      intro: 'intro'
    };
    setStep(prevSteps[step]);
  };

  if (showResults) {
    return (
      <AIResultsModal
        isOpen={isOpen}
        onClose={onClose}
        onBack={handleBack}
        service={selectedService}
        target={target}
        maxBudget={settings.budget}
        interactionType={interactionType}
        requestedQuantity={settings.quantity}
        settings={settings}
        platform={platform}
        influencers={platformInfluencers}
      />
    );
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-[5%] left-1/2 -translate-x-1/2 bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <Dialog.Title className="text-lg font-medium">
                IA Pilot
              </Dialog.Title>
            </div>
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-6">
            {step === 'intro' && <IntroStep />}

            {step === 'service' && (
              <ServiceStep
                selectedService={selectedService}
                onServiceSelect={setSelectedService}
              />
            )}

            {step === 'type' && (
              <InteractionTypeStep
                service={selectedService}
                interactionType={interactionType}
                onInteractionTypeSelect={setInteractionType}
              />
            )}

            {step === 'target' && (
              <TargetStep
                service={selectedService}
                target={target}
                onTargetChange={setTarget}
              />
            )}

            {step === 'settings' && (
              <SettingsStep
                settings={settings}
                onSettingsChange={setSettings}
              />
            )}

            {step === 'confirmation' && (
              <ConfirmationStep
                service={selectedService}
                target={target}
                settings={settings}
                interactionType={interactionType}
              />
            )}

            <div className="flex justify-between pt-4 border-t">
              {step !== 'intro' && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                >
                  Retour
                </Button>
              )}
              <div className="ml-auto">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="mr-2"
                >
                  Annuler
                </Button>
                <Button onClick={handleNext}>
                  {step === 'confirmation' ? 'Lancer la recherche IA' : 'Continuer'}
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}