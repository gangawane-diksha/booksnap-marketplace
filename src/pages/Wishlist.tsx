import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Loader2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/BookCard';
import { useWishlist } from '@/hooks/useWishlist';

export default function Wishlist() {
  const { data: wishlistItems, isLoading } = useWishlist();

  if (isLoading) {
    return (
      <Layout>
        <div className="container-booksnap py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-booksnap py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-foreground">My Wishlist</h1>
          <p className="text-muted-foreground mt-2">Books you've saved for later</p>

          {wishlistItems && wishlistItems.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
              {wishlistItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <BookCard book={{
                    id: item.book.id,
                    title: item.book.title,
                    author: item.book.author,
                    price: item.book.price,
                    original_price: item.book.original_price,
                    condition: item.book.condition,
                    cover_image: item.book.cover_image,
                    category: item.book.category,
                  }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage-light mb-6">
                <Heart className="h-10 w-10 text-sage-dark" />
              </div>
              <h2 className="text-xl font-serif font-semibold">Your wishlist is empty</h2>
              <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                Start adding books you love by clicking the heart icon on any book
              </p>
              <Button asChild className="mt-6">
                <Link to="/browse">
                  Browse Books
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
