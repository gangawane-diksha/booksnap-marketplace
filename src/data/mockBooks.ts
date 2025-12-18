export type BookCondition = 'New' | 'Like New' | 'Good' | 'Acceptable';

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  condition: BookCondition;
  category: string;
  description: string;
  coverImage: string;
  seller: {
    name: string;
    rating: number;
    location: string;
  };
  isbn?: string;
  publishedYear?: number;
  pages?: number;
  isFeatured?: boolean;
}

export const categories = [
  { id: 'fiction', name: 'Fiction', icon: '📖', count: 0 },
  { id: 'non-fiction', name: 'Non-Fiction', icon: '📚', count: 0 },
  { id: 'mystery', name: 'Mystery & Thriller', icon: '🔍', count: 0 },
  { id: 'romance', name: 'Romance', icon: '💕', count: 0 },
  { id: 'sci-fi', name: 'Sci-Fi & Fantasy', icon: '🚀', count: 0 },
  { id: 'biography', name: 'Biography', icon: '👤', count: 0 },
  { id: 'history', name: 'History', icon: '🏛️', count: 0 },
  { id: 'children', name: "Children's Books", icon: '🧒', count: 0 },
];

export const conditionColors: Record<BookCondition, string> = {
  'New': 'bg-sage text-primary-foreground',
  'Like New': 'bg-sage/80 text-primary-foreground',
  'Good': 'bg-accent text-accent-foreground',
  'Acceptable': 'bg-muted text-muted-foreground',
};
