import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { useNotifications } from '../lib/notifications';
import {
  createReview,
  getInfluencerReviews,
  getUserReviews
} from '../lib/firebase/reviews';

export function useReviews(influencerId?: string) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !influencerId) return;

    const fetchReviews = async () => {
      try {
        const fetchedReviews = influencerId 
          ? await getInfluencerReviews(influencerId)
          : await getUserReviews(user.id);
        setReviews(fetchedReviews);
      } catch (err) {
        addNotification({
          type: 'error',
          message: 'Failed to load reviews'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user, influencerId]);

  const handleCreateReview = async (data: {
    orderId: string;
    influencerId: string;
    rating: number;
    comment: string;
  }) => {
    if (!user) return;

    try {
      const reviewId = await createReview({
        ...data,
        userId: user.id
      });

      const newReview = {
        id: reviewId,
        ...data,
        userId: user.id,
        createdAt: new Date()
      };

      setReviews([newReview, ...reviews]);

      addNotification({
        type: 'success',
        message: 'Review submitted successfully'
      });
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to submit review'
      });
      throw err;
    }
  };

  return {
    reviews,
    loading,
    createReview: handleCreateReview
  };
}