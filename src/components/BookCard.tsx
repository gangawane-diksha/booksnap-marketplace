import { Link } from 'react-router-dom';
import { Heart, Star, MapPin } from 'lucide-react';
import { conditionColors, BookCondition } from '@/data/mockBooks';
import { cn } from '@/lib/utils';
import { useToggleWishlist, useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
    original_price?: number | null;
    condition: string;
    cover_image?: string | null;
    category?: string;
    seller?: {
      id?: string;
      name?: string;
      rating?: number;
      location?: string;
    };
    seller_id?: string;
  };
}

export function BookCard({ book }: BookCardProps) {
  const { user } = useAuth();
  const { data: wishlist } = useWishlist();
  const toggleWishlist = useToggleWishlist();

  const isWishlisted = wishlist?.some((item) => item.book.id === book.id) ?? false;
  const discount = book.original_price
    ? Math.round(((book.original_price - book.price) / book.original_price) * 100)
    : null;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    toggleWishlist.mutate(book.id);
  };

  const conditionKey = book.condition as BookCondition;

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-booksnap-sm card-hover border border-border">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Link to={`/book/${book.id}`}>
          <img
            src={book.cover_image || '/placeholder.svg'}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {/* Wishlist Button */}
        {user && (
          <button
            onClick={handleWishlistClick}
            disabled={toggleWishlist.isPending}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-colors',
                isWishlisted ? 'fill-terracotta text-terracotta' : 'text-muted-foreground'
              )}
            />
          </button>
        )}

        {/* Condition Badge */}
        <span
          className={cn(
            'absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium',
            conditionColors[conditionKey] || 'bg-muted text-muted-foreground'
          )}
        >
          {book.condition}
        </span>

        {/* Discount Badge */}
        {discount && discount > 0 && (
          <span className="absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-bold bg-terracotta text-primary-foreground">
            -{discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <Link to={`/book/${book.id}`}>
          <h3 className="font-serif font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
        
        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-primary">₹{Number(book.price).toFixed(0)}</span>
          {book.original_price && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{Number(book.original_price).toFixed(0)}
            </span>
          )}
        </div>

        {/* Seller Info */}
        {book.seller && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-terracotta text-terracotta" />
              <span>{book.seller.rating || 5.0}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[100px]">{book.seller.location || 'Online'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
