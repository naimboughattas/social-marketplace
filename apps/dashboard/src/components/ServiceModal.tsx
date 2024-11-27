import { useState } from 'react';
import { X, Grid, Link as LinkIcon, Info } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as RadioGroup from '@radix-ui/react-radio-group';
import Button from './Button';
import Input from './Input';
import { Service, SocialAccount } from '../lib/types';
import { useNotifications } from '../lib/notifications';
import { useCart } from '../lib/cart';
import * as Tooltip from '@radix-ui/react-tooltip';
import CommentOptions from './comment/CommentOptions';
import PostSelection from './post/PostSelection';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  influencer: SocialAccount;
}

type Step = 'type' | 'username' | 'comment' | 'posts';
type InteractionType = 'specific' | 'monthly' | 'specific-future' | 'future';
type CommentType = 'custom' | 'delegated';
type CommentLength = 'emoji' | 'short' | 'medium' | 'long';

const MOCK_POSTS = [
  { id: '1', url: 'https://instagram.com/p/123', thumbnail: 'https://picsum.photos/300/300?random=1' },
  { id: '2', url: 'https://instagram.com/p/456', thumbnail: 'https://picsum.photos/300/300?random=2' },
  { id: '3', url: 'https://instagram.com/p/789', thumbnail: 'https://picsum.photos/300/300?random=3' },
  { id: '4', url: 'https://instagram.com/p/012', thumbnail: 'https://picsum.photos/300/300?random=4' },
];

export default function ServiceModal({
  isOpen,
  onClose,
  service,
  influencer
}: ServiceModalProps) {
  const { addNotification } = useNotifications();
  const { addItem } = useCart();
  const [step, setStep] = useState<Step>('type');
  const [interactionType, setInteractionType] = useState<InteractionType>('specific');
  const [targetHandle, setTargetHandle] = useState('');
  const [commentType, setCommentType] = useState<CommentType>('custom');
  const [commentText, setCommentText] = useState('');
  const [commentLength, setCommentLength] = useState<CommentLength>('short');
  const [commentExample, setCommentExample] = useState('');
  const [showPostSelection, setShowPostSelection] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [postUrl, setPostUrl] = useState('');

  const resetForm = () => {
    setStep('type');
    setInteractionType('specific');
    setTargetHandle('');
    setCommentType('custom');
    setCommentText('');
    setCommentLength('short');
    setCommentExample('');
    setShowPostSelection(true);
    setSelectedPosts([]);
    setPostUrl('');
  };

  const handleNext = () => {
    if (step === 'type') {
      setStep('username');
    } else if (step === 'username') {
      if (!targetHandle) {
        addNotification({
          type: 'error',
          message: 'Veuillez entrer un nom d\'utilisateur'
        });
        return;
      }
      if (service === 'follow') {
        handleSubmit();
      } else if (service === 'comment') {
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
      setStep('posts');
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
    try {
      let finalTarget = targetHandle;
      let finalCommentText = undefined;

      if (service !== 'follow' && interactionType !== 'future') {
        const posts = showPostSelection ? selectedPosts : [postUrl];
        finalTarget = posts.join('|');
      }

      if (service === 'comment') {
        finalCommentText = commentType === 'custom' 
          ? commentText 
          : `[${commentLength}]${commentExample ? ` Exemple: ${commentExample}` : ''}`;
      }

      addItem({
        id: crypto.randomUUID(),
        influencerUsername: influencer.username,
        service,
        price: influencer.prices[service] || 0,
        targetHandle: finalTarget,
        commentText: finalCommentText,
        isFuturePosts: interactionType === 'future' || interactionType === 'specific-future',
        isRecurring: service === 'follow' && interactionType === 'monthly'
      });

      addNotification({
        type: 'success',
        message: 'Service ajouté au panier'
      });

      resetForm();
      onClose();
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'ajout au panier'
      });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-medium">
              {service === 'follow' ? 'Être suivi par' : 
               service === 'like' ? 'Obtenir un like de' :
               service === 'comment' ? 'Obtenir un commentaire de' :
               'Obtenir un repost de'} {influencer.username}
            </Dialog.Title>
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-6">
            {step === 'type' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Type d'interaction</h3>
                <RadioGroup.Root
                  value={interactionType}
                  onValueChange={(value) => setInteractionType(value as InteractionType)}
                  className="space-y-3"
                >
                  {(service === 'follow' ? [
                    {
                      id: 'one-month',
                      title: 'Suivi pendant 1 mois',
                      description: 'L\'influenceur suivra le compte pendant 1 mois puis se désabonnera automatiquement'
                    },
                    {
                      id: 'monthly',
                      title: 'Renouveler le suivi tous les mois',
                      description: 'L\'influenceur restera abonné et le montant sera automatiquement débité chaque mois'
                    }
                  ] : [
                    {
                      id: 'specific',
                      title: 'Posts spécifiques',
                      description: 'Sélectionnez un ou plusieurs posts existants'
                    },
                    {
                      id: 'specific-future',
                      title: 'Posts spécifiques + Futurs posts',
                      description: 'Sélectionnez des posts existants et recevez automatiquement des interactions sur vos futurs posts'
                    },
                    {
                      id: 'future',
                      title: 'Tous les futurs posts',
                      description: 'Recevez automatiquement des interactions sur tous vos nouveaux posts'
                    }
                  ]).map((type) => (
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
                          <p className="text-sm text-gray-500 mt-1">
                            {type.description}
                          </p>
                          {type.id === 'future' && (
                            <div className="flex items-center mt-1">
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
                            </div>
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
              {step !== 'type' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const prevSteps: Record<Step, Step> = {
                      type: 'type',
                      username: 'type',
                      comment: 'username',
                      posts: 'comment'
                    };
                    setStep(prevSteps[step]);
                  }}
                >
                  Retour
                </Button>
              )}
              <Button onClick={handleNext}>
                {step === 'comment' || (service === 'follow' && step === 'username') ? 'Confirmer' : 'Continuer'}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}