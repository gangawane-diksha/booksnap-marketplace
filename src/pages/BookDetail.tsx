import { useParams, Link } from 'react-router-dom';
import { Heart, Star, MapPin, MessageCircle, ShoppingCart, Share2, ArrowLeft, Check } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/BookCard';
import { mockBooks, conditionColors } from '@/data/mockBooks';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function BookDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const book = mockBooks.find((b) => b.id === id);

  if (!book) {
    return (
      <Layout>
        <div className="container-booksnap py-16 text-center">
          <h1 className="text-2xl font-serif font-bold">Book not found</h1>
          <Button asChild className="mt-4">
            <Link to="/browse">Browse Books</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const relatedBooks = mockBooks.filter((b) => b.category === book.category && b.id !== book.id).slice(0, 4);
  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    setAddedToCart(true);
    toast({
      title: 'Added to cart!',
      description: `${book.title} has been added to your cart.`,
    });
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!',
      description: isWishlisted
        ? `${book.title} removed from your wishlist.`
        : `${book.title} saved to your wishlist.`,
    });
  };

  return (
    <Layout>
      <div className="container-booksnap py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/browse" className="hover:text-primary">Browse</Link>
          <span>/</span>
          <span className="text-foreground truncate">{book.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted shadow-booksnap-lg">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className={cn('px-3 py-1 rounded-full text-sm font-medium', conditionColors[book.condition])}>
                  {book.condition}
                </span>
                {discount && (
                  <span className="px-3 py-1 rounded-full text-sm font-bold bg-terracotta text-primary-foreground">
                    Save {discount}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-primary font-medium mb-2">{book.category}</p>
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground mt-2">by {book.author}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">${book.price.toFixed(2)}</span>
              {book.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${book.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Seller Info Card */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-sage-light flex items-center justify-center">
                    <span className="text-lg font-semibold text-sage-dark">
                      {book.seller.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{book.seller.name}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-terracotta text-terracotta" />
                        {book.seller.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {book.seller.location}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-serif font-semibold text-lg mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{book.description}</p>
            </div>

            {/* Book Details */}
            <div className="grid grid-cols-2 gap-4">
              {book.isbn && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">ISBN</p>
                  <p className="font-medium">{book.isbn}</p>
                </div>
              )}
              {book.publishedYear && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Published</p>
                  <p className="font-medium">{book.publishedYear}</p>
                </div>
              )}
              {book.pages && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Pages</p>
                  <p className="font-medium">{book.pages}</p>
                </div>
              )}
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Condition</p>
                <p className="font-medium">{book.condition}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="hero"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={addedToCart}
              >
                {addedToCart ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg" onClick={handleWishlist}>
                <Heart className={cn('h-5 w-5', isWishlisted && 'fill-terracotta text-terracotta')} />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Shipping Info */}
            <div className="bg-sage-light/50 rounded-xl p-4 space-y-2">
              <p className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-sage-dark" />
                <span>Free shipping on orders over $25</span>
              </p>
              <p className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-sage-dark" />
                <span>Local pickup available</span>
              </p>
              <p className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-sage-dark" />
                <span>Secure payment with buyer protection</span>
              </p>
            </div>
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-serif font-bold mb-8">More in {book.category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {relatedBooks.map((relatedBook, index) => (
                <div
                  key={relatedBook.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <BookCard book={relatedBook} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
