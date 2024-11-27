import { useState } from 'react';
import { X, Grid, Link as LinkIcon } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import Button from './Button';
import Input from './Input';
import { Service } from '../lib/types';
import { useNotifications } from '../lib/notifications';
import CommentOptions from './comment/CommentOptions';
import PostSelection from './post/PostSelection';

interface MultiSelectServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (service: Service, target: string, commentText?: string) => void;
}

type Step = 'service' | 'type' | 'username' | 'comment' | 'posts';
type InteractionType = 'specific' | 'specific-future' | 'future';
type CommentType = 'custom' | 'delegated';
type CommentLength = 'emoji' | 'short' | 'medium' | 'long';

export default function MultiSelectServiceModal({
  isOpen,
  onClose,
  onConfirm
}: MultiSelectServiceModalProps) {
  const { addNotification } = useNotifications();
  const [step, setStep] = useState<Step>('service');
  const [selectedService, setSelectedService] = useState<Service>('follow');
  const [interactionType, setInteractionType] = useState<InteractionType>('specific');
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
    setInteractionType('specific');
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
      if (interactionType === 'future') {
        handleSubmit();
      } else {
        setStep('posts');
      }
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

    if (selectedService !== 'follow' && interactionType !== 'future') {
      const posts = showPostSelection ? selectedPosts : [postUrl];
      finalTarget = posts.join('|');
    }

    if (selectedService === 'comment') {
      finalCommentText = commentType === 'custom' 
        ? commentText 
        : `[${commentLength}]${commentExample ? ` Exemple: ${commentExample}` : ''}`;
    }

    onConfirm(selectedService, finalTarget, finalCommentText);
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
                <div className="space-y-4">
                  {[
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
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setInteractionType(type.id as InteractionType)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                        interactionType === type.id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200'
                      }`}
                    >
                      <div className="font-medium">{type.title}</div>
                      <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                    </button>
                  ))}
                </div>
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
              {step === 'service' ? (
                <>
                  <Button variant="outline" onClick={onClose}>
                    Annuler
                  </Button>
                  <Button onClick={handleNext}>
                    Continuer
                  </Button>
                </>
              ) : (
                <>
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
                  <Button onClick={handleNext}>
                    {step === 'posts' || (selectedService === 'follow' && step === 'username') ? 'Confirmer' : 'Continuer'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}