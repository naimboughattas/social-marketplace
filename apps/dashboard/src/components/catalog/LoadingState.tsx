import { Spinner } from '../Loading';

export default function LoadingState() {
  return (
    <div className="flex justify-center items-center py-12">
      <Spinner size="lg" />
    </div>
  );
}