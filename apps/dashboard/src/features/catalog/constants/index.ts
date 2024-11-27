export const SORT_OPTIONS = [
  { value: 'followers', label: 'Followers' },
  { value: 'delai', label: 'Délai' },
  { value: 'price', label: 'Prix' }
];

export const VIEW_MODES = {
  TABLE: 'table',
  GRID: 'grid'
} as const;

export const SERVICE_TYPES = {
  FOLLOW: 'follow',
  LIKE: 'like',
  COMMENT: 'comment',
  REPOST: 'repost_story'
} as const;