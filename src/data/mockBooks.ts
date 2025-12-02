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
  { id: 'fiction', name: 'Fiction', icon: '📖', count: 1240 },
  { id: 'non-fiction', name: 'Non-Fiction', icon: '📚', count: 890 },
  { id: 'mystery', name: 'Mystery & Thriller', icon: '🔍', count: 456 },
  { id: 'romance', name: 'Romance', icon: '💕', count: 678 },
  { id: 'sci-fi', name: 'Sci-Fi & Fantasy', icon: '🚀', count: 534 },
  { id: 'biography', name: 'Biography', icon: '👤', count: 321 },
  { id: 'history', name: 'History', icon: '🏛️', count: 287 },
  { id: 'children', name: "Children's Books", icon: '🧒', count: 445 },
];

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    price: 8.99,
    originalPrice: 14.99,
    condition: 'Like New',
    category: 'Fiction',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    seller: { name: 'BookLover42', rating: 4.8, location: 'Portland, OR' },
    isbn: '978-0525559474',
    publishedYear: 2020,
    pages: 304,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 12.50,
    originalPrice: 27.00,
    condition: 'Good',
    category: 'Non-Fiction',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Tiny changes, remarkable results.',
    coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop',
    seller: { name: 'ReadMore', rating: 4.9, location: 'Seattle, WA' },
    isbn: '978-0735211292',
    publishedYear: 2018,
    pages: 320,
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    price: 10.00,
    condition: 'New',
    category: 'Sci-Fi & Fantasy',
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the Earth itself will perish.',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    seller: { name: 'SpaceReader', rating: 4.7, location: 'Austin, TX' },
    isbn: '978-0593135204',
    publishedYear: 2021,
    pages: 496,
    isFeatured: true,
  },
  {
    id: '4',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    price: 7.50,
    originalPrice: 16.99,
    condition: 'Good',
    category: 'Mystery & Thriller',
    description: "Alicia Berenson's life is seemingly perfect until one night she shoots her husband five times—and then never speaks another word.",
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    seller: { name: 'ThrillerFan', rating: 4.6, location: 'Chicago, IL' },
    isbn: '978-1250301697',
    publishedYear: 2019,
    pages: 336,
    isFeatured: true,
  },
  {
    id: '5',
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    price: 9.25,
    originalPrice: 17.00,
    condition: 'Like New',
    category: 'Fiction',
    description: 'For years, rumors of the "Marsh Girl" haunted Barkley Cove, a quiet fishing village. Kya Clark is barefoot and wild.',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    seller: { name: 'NatureLover', rating: 4.9, location: 'Savannah, GA' },
    isbn: '978-0735219090',
    publishedYear: 2018,
    pages: 384,
  },
  {
    id: '6',
    title: 'Educated',
    author: 'Tara Westover',
    price: 11.00,
    originalPrice: 18.00,
    condition: 'Acceptable',
    category: 'Biography',
    description: 'A memoir about a young girl who leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop',
    seller: { name: 'StorySeeker', rating: 4.5, location: 'Denver, CO' },
    isbn: '978-0399590504',
    publishedYear: 2018,
    pages: 334,
  },
  {
    id: '7',
    title: 'The Very Hungry Caterpillar',
    author: 'Eric Carle',
    price: 5.00,
    condition: 'Good',
    category: "Children's Books",
    description: 'The all-time classic picture book, from generation to generation, sold somewhere in the world every 30 seconds!',
    coverImage: 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=400&h=600&fit=crop',
    seller: { name: 'KidsBooks', rating: 4.8, location: 'Boston, MA' },
    isbn: '978-0399226908',
    publishedYear: 1969,
    pages: 26,
  },
  {
    id: '8',
    title: 'Sapiens: A Brief History',
    author: 'Yuval Noah Harari',
    price: 13.50,
    originalPrice: 24.99,
    condition: 'Like New',
    category: 'History',
    description: 'A groundbreaking narrative of humanity\'s creation and evolution that explores the ways in which biology and history have defined us.',
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
    seller: { name: 'HistoryBuff', rating: 4.7, location: 'New York, NY' },
    isbn: '978-0062316097',
    publishedYear: 2015,
    pages: 464,
  },
];

export const conditionColors: Record<BookCondition, string> = {
  'New': 'bg-sage text-primary-foreground',
  'Like New': 'bg-sage/80 text-primary-foreground',
  'Good': 'bg-accent text-accent-foreground',
  'Acceptable': 'bg-muted text-muted-foreground',
};
