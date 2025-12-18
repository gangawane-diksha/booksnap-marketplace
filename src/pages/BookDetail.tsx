import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Star, MapPin, MessageCircle, ShoppingCart, Share2, Check, Loader2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/BookCard';
import { conditionColors, BookCondition } from '@/data/mockBooks';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useBook, useBooks } from '@/hooks/useBooks';
import { useAddToCart } from '@/hooks/useCart';
import { useToggleWishlist, useWishlist } from '@/hooks/useWishlist';
import { useStartConversation } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { ChatBox } from '@/components/ChatBox';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: book, isLoading } = useBook(id || '');
  const { data: allBooks } = useBooks();
  const { data: wishlist } = useWishlist();
  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlist();
  const startConversation = useStartConversation();
  const [addedToCart, setAddedToCart] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="container-booksnap py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

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

  const relatedBooks = allBooks?.filter((b) => b.category === book.category && b.id !== book.id).slice(0, 4) || [];
  const discount = book.original_price
    ? Math.round(((Number(book.original_price) - Number(book.price)) / Number(book.original_price)) * 100)
    : null;
  const isWishlisted = wishlist?.some((item) => item.book.id === book.id) ?? false;
  const isOwnBook = user?.id === book.seller_id;

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    await addToCart.mutateAsync({ bookId: book.id });
    setAddedToCart(true);
  };

  const handleWishlist = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    toggleWishlist.mutate(book.id);
  };

  const handleContact = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    try {
      const conv = await startConversation.mutateAsync({
        bookId: book.id,
        sellerId: book.seller_id,
      });
      setConversationId(conv.id);
      setChatOpen(true);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const conditionKey = book.condition as BookCondition;

  // Check if cover_image is a valid URL (not a blob URL which won't persist)
  const isValidImageUrl = book.cover_image && !book.cover_image.startsWith('blob:');
  const imageUrl = isValidImageUrl && !imageError ? book.cover_image : '/placeholder.svg';


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
                  src={imageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className={cn('px-3 py-1 rounded-full text-sm font-medium', conditionColors[conditionKey])}>
                  {book.condition}
                </span>
                {discount && discount > 0 && (
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
              <span className="text-4xl font-bold text-primary">₹{Number(book.price).toFixed(0)}</span>
              {book.original_price && (
                <span className="text-xl text-muted-foreground line-through">
                  ₹{Number(book.original_price).toFixed(0)}
                </span>
              )}
            </div>

            {/* Seller Info Card */}
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-sage-light flex items-center justify-center overflow-hidden">
                    {book.seller.avatar_url ? (
                      <img src={book.seller.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-semibold text-sage-dark">
                        {book.seller.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{book.seller.name}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-terracotta text-terracotta" />
                        5.0
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Online
                      </span>
                    </div>
                  </div>
                </div>
                {!isOwnBook && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleContact}
                    disabled={startConversation.isPending}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                )}
              </div>
            </div>

            {/* Description */}
            {book.description && (
              <div>
                <h2 className="font-serif font-semibold text-lg mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{book.description}</p>
              </div>
            )}

            {/* Book Details */}
            <div className="grid grid-cols-2 gap-4">
              {book.isbn && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">ISBN</p>
                  <p className="font-medium">{book.isbn}</p>
                </div>
              )}
              {book.published_year && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Published</p>
                  <p className="font-medium">{book.published_year}</p>
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
            {!isOwnBook && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={addedToCart || addToCart.isPending}
                >
                  {addedToCart ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Added to Cart
                    </>
                  ) : addToCart.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={handleWishlist}
                  disabled={toggleWishlist.isPending}
                >
                  <Heart className={cn('h-5 w-5', isWishlisted && 'fill-terracotta text-terracotta')} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Shipping Info */}
            <div className="bg-sage-light/50 rounded-xl p-4 space-y-2">
              <p className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-sage-dark" />
                <span>Free shipping on orders over ₹500</span>
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
                  <BookCard book={{
                    ...relatedBook,
                    cover_image: relatedBook.cover_image,
                    original_price: relatedBook.original_price,
                    seller: {
                      id: relatedBook.seller.id,
                      name: relatedBook.seller.name,
                      rating: 5.0,
                      location: 'Online',
                    },
                  }} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Chat Box */}
      <ChatBox 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
        initialConversationId={conversationId || undefined}
      />
    </Layout>
  );
}
