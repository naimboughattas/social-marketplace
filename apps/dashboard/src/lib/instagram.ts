const INSTAGRAM_API_KEY = 'bacae0aee9msh27ea8e19d5b0ae9p1e1becjsn7c0591ea8da6';
const INSTAGRAM_API_HOST = 'instagram-premium-api-2023.p.rapidapi.com';

// Rate limiting configuration
const RATE_LIMIT = {
  maxCalls: 3,
  timeWindow: 60 * 1000, // 1 minute
  resetTime: 60 * 1000,
  minDelay: 2000 // 2 seconds minimum between calls
};

class RateLimiter {
  private static instance: RateLimiter;
  private calls: Map<string, number[]>;
  private lastReset: number;
  private lastCallTime: number;

  private constructor() {
    this.calls = new Map();
    this.lastReset = Date.now();
    this.lastCallTime = 0;
    this.resetIfNeeded();
  }

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  private resetIfNeeded() {
    const now = Date.now();
    if (now - this.lastReset >= RATE_LIMIT.resetTime) {
      this.calls.clear();
      this.lastReset = now;
    }
  }

  async canMakeCall(endpoint: string): Promise<boolean> {
    this.resetIfNeeded();
    
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    
    if (timeSinceLastCall < RATE_LIMIT.minDelay) {
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT.minDelay - timeSinceLastCall));
    }
    
    const calls = this.calls.get(endpoint) || [];
    const recentCalls = calls.filter(time => now - time < RATE_LIMIT.timeWindow);
    return recentCalls.length < RATE_LIMIT.maxCalls;
  }

  recordCall(endpoint: string) {
    this.resetIfNeeded();
    const calls = this.calls.get(endpoint) || [];
    const now = Date.now();
    calls.push(now);
    this.calls.set(endpoint, calls);
    this.lastCallTime = now;
  }

  getTimeToReset(endpoint: string): number {
    const calls = this.calls.get(endpoint) || [];
    if (calls.length === 0) return 0;
    
    const now = Date.now();
    const oldestCall = Math.min(...calls);
    const timeToReset = Math.max(
      RATE_LIMIT.timeWindow - (now - oldestCall),
      RATE_LIMIT.minDelay - (now - this.lastCallTime)
    );
    
    return Math.ceil(timeToReset / 1000);
  }
}

async function makeApiRequest(endpoint: string, username?: string) {
  const rateLimiter = RateLimiter.getInstance();
  const canMakeCall = await rateLimiter.canMakeCall(endpoint);

  if (!canMakeCall) {
    const timeToReset = rateLimiter.getTimeToReset(endpoint);
    throw new Error(`Trop de requêtes, veuillez réessayer dans ${timeToReset} secondes`);
  }

  const response = await fetch(
    `https://${INSTAGRAM_API_HOST}${endpoint}`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-key': INSTAGRAM_API_KEY,
        'x-rapidapi-host': INSTAGRAM_API_HOST
      }
    }
  );

  rateLimiter.recordCall(endpoint);

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  const data = await response.json();
  
  if (username && !data.username) {
    throw new Error('Compte Instagram introuvable');
  }

  return data;
}

export async function validateInstagramAccount(username: string) {
  if (!username || username.length < 3) {
    throw new Error('Le nom d\'utilisateur doit contenir au moins 3 caractères');
  }

  const cleanUsername = username.replace('@', '');
  const data = await makeApiRequest(`/v1/user/by/username?username=${cleanUsername}`, cleanUsername);

  return {
    username: data.username,
    displayName: data.full_name || data.username,
    followers: parseInt(data.follower_count) || 0,
    profileImage: data.profile_pic_url,
    isVerified: data.is_verified || false,
    isActive: true,
    avgDeliveryTime: 30,
    completedOrders: 0,
    rating: 5.0,
    pk: data.pk,
    prices: {
      follow: 2,
      like: 1,
      comment: 5,
      repost_story: 3
    },
    hideIdentity: false,
    hideProfileImage: false,
    category: data.category_name || 'Other',
    country: '',
    city: data.city_name || '',
    language: '',
  };
}

export async function getInstagramPosts(userId: string) {
  const data = await makeApiRequest(`/v1/user/medias?user_id=${userId}&amount=12`);
  
  return data.map((post: any) => ({
    id: post.id,
    thumbnail_url: post.thumbnail_url,
    likes_count: post.likes_count || 0,
    comment_count: post.comment_count || 0,
    play_count: post.play_count || 0,
    caption: post.caption,
    taken_at: post.taken_at,
  }));
}