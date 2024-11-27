import * as RadioGroup from '@radix-ui/react-radio-group';
import Input from '../Input';

interface CommentOptionsProps {
  commentType: 'custom' | 'delegated';
  onCommentTypeChange: (type: 'custom' | 'delegated') => void;
  commentText: string;
  onCommentTextChange: (text: string) => void;
  commentLength: 'emoji' | 'short' | 'medium' | 'long';
  onCommentLengthChange: (length: 'emoji' | 'short' | 'medium' | 'long') => void;
  commentExample: string;
  onCommentExampleChange: (example: string) => void;
}

const COMMENT_LENGTHS = {
  emoji: { label: 'Emoji uniquement', example: '🔥 💯 👏' },
  short: { label: '1-5 mots + emoji', example: 'Super photo ! 🔥' },
  medium: { label: '5-15 mots + emoji', example: 'Cette photo est magnifique, j\'adore les couleurs ! 😍' },
  long: { label: '+15 mots + emoji', example: 'Superbe composition qui capture parfaitement l\'ambiance ! 🙌' }
};

export default function CommentOptions({
  commentType,
  onCommentTypeChange,
  commentText,
  onCommentTextChange,
  commentLength,
  onCommentLengthChange,
  commentExample,
  onCommentExampleChange
}: CommentOptionsProps) {
  return (
    <div className="space-y-4">
      <RadioGroup.Root
        value={commentType}
        onValueChange={(value) => onCommentTypeChange(value as 'custom' | 'delegated')}
        className="flex space-x-4"
      >
        <RadioGroup.Item value="custom" asChild>
          <div className={`flex-1 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
            commentType === 'custom'
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-purple-200'
          }`}>
            <div className="font-medium">Je rédige mon commentaire</div>
          </div>
        </RadioGroup.Item>

        <RadioGroup.Item value="delegated" asChild>
          <div className={`flex-1 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
            commentType === 'delegated'
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-purple-200'
          }`}>
            <div className="font-medium">Je délègue à l'influenceur</div>
          </div>
        </RadioGroup.Item>
      </RadioGroup.Root>

      {commentType === 'custom' ? (
        <Input
          value={commentText}
          onChange={(e) => onCommentTextChange(e.target.value)}
          placeholder="Votre commentaire..."
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(COMMENT_LENGTHS).map(([key, { label, example }]) => (
              <button
                key={key}
                onClick={() => onCommentLengthChange(key as 'emoji' | 'short' | 'medium' | 'long')}
                className={`p-2 rounded-lg border text-center ${
                  commentLength === key
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs text-gray-500 mt-1 truncate" title={example}>
                  {example}
                </div>
              </button>
            ))}
          </div>

          <div className="flex space-x-4">
            <Input
              className="flex-1"
              placeholder="Ex: Commentaire positif sur la qualité des photos"
              value={commentExample}
              onChange={(e) => onCommentExampleChange(e.target.value)}
            />
            <div className="bg-yellow-50 rounded-lg p-3 text-xs text-yellow-700 w-72">
              <p className="font-medium">Important :</p>
              <p>L'influenceur se basera sur vos consignes. Aucun remboursement possible si les consignes sont trop larges.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}