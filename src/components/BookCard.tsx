import { Link } from 'react-router-dom';
import { Heart, Star, MapPin } from 'lucide-react';
import { Book, conditionColors } from '@/data/mockBooks';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : null;

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-booksnap-sm card-hover border border-border">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Link to={`/book/${book.id}`}>
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
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

        {/* Condition Badge */}
        <span
          className={cn(
            'absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium',
            conditionColors[book.condition]
          )}
        >
          {book.condition}
        </span>

        {/* Discount Badge */}
        {discount && (
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
          <span className="text-lg font-bold text-primary">${book.price.toFixed(2)}</span>
          {book.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${book.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-terracotta text-terracotta" />
            <span>{book.seller.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-[100px]">{book.seller.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
