// src/components/MultiSelectServiceModal.tsx
import { useState } from 'react';
import { X, Info } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Tooltip from '@radix-ui/react-tooltip';
import Button from './Button';
import Input from './Input';
import { Service } from '../lib/types';
import { useNotifications } from '../lib/notifications';
import { useCart } from '../lib/cart';
import CommentOptions from './comment/CommentOptions';
import PostSelection from './post/PostSelection';

interface MultiSelectServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (service: Service, target: string, commentText?: string) => void;
}

type Step = 'service' | 'type' | 'username' | 'comment' | 'posts';
type InteractionType = 'one-month' | 'monthly';
type CommentType = 'custom' | 'delegated';
type CommentLength = 'emoji' | 'short' | 'medium' | 'long';

const FOLLOW_INTERACTION_TYPES = [
  {
    id: 'one-month',
    title: 'Suivi pendant 1 mois',
    description: 'L\'influenceur suivra le compte pendant 1 mois puis se désabonnera automatiquement',
    priceLabel: 'pour 1 mois'
  },
  {
    id: 'monthly',
    title: 'Renouveler le suivi tous les mois',
    description: 'L\'influenceur restera abonné et le montant sera automatiquement débité chaque mois',
    priceLabel: '/ mois'
  }
];

const POST_INTERACTION_TYPES = [
  {
    id: 'specific',
    title: 'Posts spécifiques',
    description: 'Sélectionnez un ou plusieurs posts existants',
    priceLabel: '/ post'
  },
  {
    id: 'specific-future',
    title: 'Posts spécifiques + Futurs posts',
    description: 'Sélectionnez des posts existants et recevez automatiquement des interactions sur vos futurs posts',
    priceLabel: '/ posts & futurs posts'
  },
  {
    id: 'future',
    title: 'Tous les futurs posts',
    description: 'Recevez automatiquement des interactions sur tous vos nouveaux posts',
    priceLabel: '/ futurs posts'
  }
];

export default function MultiSelectServiceModal({
  isOpen,
  onClose,
  onConfirm
}: MultiSelectServiceModalProps) {
  const { addNotification } = useNotifications();
  const { addItem } = useCart();
  const [step, setStep] = useState<Step>('service');
  const [selectedService, setSelectedService] = useState<Service>('follow');
  const [interactionType, setInteractionType] = useState<InteractionType>('one-month');
  const [targetHandle, setTargetHandle] = useState('');
  const [showPostSelection, setShowPostSelection] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [postUrl, setPostUrl] = useState('');
  const [commentType, setCommentType] = useState<CommentType>('custom');
  const [commentText, setCommentText] = useState('');
  const [commentLength, setCommentLength] = useState<CommentLength>('short');
  const [commentExample, setCommentExample] = useState('');

  const resetForm = () => {
    setStep('service');
    setSelectedService('follow');
    setInteractionType('one-month');
    setTargetHandle('');
    setShowPostSelection(true);
    setSelectedPosts([]);
    setPostUrl('');
    setCommentType('custom');
    setCommentText('');
    setCommentLength('short');
    setCommentExample('');
  };

  const handleNext = () => {
    if (step === 'service') {
      setStep('type');
    } else if (step === 'type') {
      if (!interactionType) {
        addNotification({
          type: 'error',
          message: 'Veuillez sélectionner un type d\'interaction'
        });
        return;
      }
      setStep('username');
    } else if (step === 'username') {
      if (!targetHandle) {
        addNotification({
          type: 'error',
          message: 'Veuillez entrer un nom d\'utilisateur'
        });
        return;
      }
      if (selectedService === 'follow') {
        handleSubmit();
      } else if (selectedService === 'comment') {
        setStep('comment');
      } else {
        setStep('posts');
      }
    } else if (step === 'comment') {
      if (commentType === 'custom' && !commentText) {
        addNotification({
          type: 'error',
          message: 'Veuillez entrer un commentaire'
        });
        return;
      }
      handleSubmit();
    } else if (step === 'posts') {
      if (!showPostSelection && !postUrl) {
        addNotification({
          type: 'error',
          message: 'Veuillez entrer une URL'
        });
        return;
      }
      if (showPostSelection && selectedPosts.length === 0) {
        addNotification({
          type: 'error',
          message: 'Veuillez sélectionner au moins un post'
        });
        return;
      }
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    let finalTarget = targetHandle;
    let finalCommentText = undefined;

    if (selectedService !== 'follow') {
      const posts = showPostSelection ? selectedPosts : [postUrl];
      finalTarget = posts.join('|');
    }

    if (selectedService === 'comment') {
      finalCommentText = commentType === 'custom' 
        ? commentText 
        : `[${commentLength}]${commentExample ? ` Exemple: ${commentExample}` : ''}`;
    }

    onConfirm(
      selectedService,
      finalTarget,
      finalCommentText
    );

    resetForm();
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-medium">
              Sélection multiple
            </Dialog.Title>
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-6">
            {step === 'service' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Choisissez un service</h3>
                <div className="grid grid-cols-2 gap-4">
                  {(['follow', 'like', 'comment', 'repost_story'] as Service[]).map((service) => (
                    <button
                      key={service}
                      onClick={() => setSelectedService(service)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        selectedService === service
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200'
                      }`}
                    >
                      <div className="font-medium capitalize">{service}</div>
                      <p className="text-sm text-gray-500 mt-1">
                        {service === 'follow' ? 'Suivre un compte' :
                         service === 'like' ? 'Liker des posts' :
                         service === 'comment' ? 'Commenter des posts' :
                         'Partager en story'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'type' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Type d'interaction</h3>
                <RadioGroup.Root
                  value={interactionType}
                  onValueChange={(value) => setInteractionType(value as InteractionType)}
                  className="space-y-3"
                >
                  {(selectedService === 'follow' ? FOLLOW_INTERACTION_TYPES : POST_INTERACTION_TYPES).map((type) => (
                    <RadioGroup.Item key={type.id} value={type.id} asChild>
                      <div className={`relative flex items-start p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                        interactionType === type.id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200'
                      }`}>
                        <div className="flex h-5 items-center">
                          <RadioGroup.Indicator className="h-5 w-5 rounded-full border-2 border-purple-600 flex items-center justify-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-purple-600" />
                          </RadioGroup.Indicator>
                        </div>
                        <div className="ml-3">
                          <label className="font-medium text-gray-900">
                            {type.title}
                          </label>
                          <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                          {type.id === 'future' && (
                            <Tooltip.Provider>
                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <div className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                    <Info className="h-4 w-4" />
                                  </div>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                  <Tooltip.Content
                                    className="bg-gray-900 text-white px-3 py-2 rounded text-sm max-w-xs"
                                    sideOffset={5}
                                  >
                                    Une commande sera automatiquement passée dès qu'un nouveau post est détecté
                                    <Tooltip.Arrow className="fill-gray-900" />
                                  </Tooltip.Content>
                                </Tooltip.Portal>
                              </Tooltip.Root>
                            </Tooltip.Provider>
                          )}
                        </div>
                      </div>
                    </RadioGroup.Item>
                  ))}
                </RadioGroup.Root>
              </div>
            )}

            {step === 'username' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Compte cible</h3>
                <Input
                  label="Nom d'utilisateur"
                  value={targetHandle}
                  onChange={(e) => setTargetHandle(e.target.value)}
                  placeholder="@votrecompte"
                  required
                />
              </div>
            )}

            {step === 'comment' && (
              <CommentOptions
                commentType={commentType}
                onCommentTypeChange={setCommentType}
                commentText={commentText}
                onCommentTextChange={setCommentText}
                commentLength={commentLength}
                onCommentLengthChange={setCommentLength}
                commentExample={commentExample}
                onCommentExampleChange={setCommentExample}
              />
            )}

            {step === 'posts' && (
              <PostSelection
                showPostSelection={showPostSelection}
                selectedPosts={selectedPosts}
                postUrl={postUrl}
                onShowPostSelectionChange={setShowPostSelection}
                onSelectedPostsChange={setSelectedPosts}
                onPostUrlChange={setPostUrl}
              />
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              {step !== 'service' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const prevSteps: Record<Step, Step> = {
                      service: 'service',
                      type: 'service',
                      username: 'type',
                      comment: 'username',
                      posts: selectedService === 'comment' ? 'comment' : 'username'
                    };
                    setStep(prevSteps[step]);
                  }}
                >
                  Retour
                </Button>
              )}
              <Button onClick={handleNext}>
                {step === 'posts' || (selectedService === 'follow' && step === 'username') || step === 'comment' ? 'Confirmer' : 'Continuer'}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
