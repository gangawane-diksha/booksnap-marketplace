import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Loader2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useCart, useUpdateCartQuantity, useRemoveFromCart } from '@/hooks/useCart';

export default function Cart() {
  const { data: cartItems, isLoading } = useCart();
  const updateQuantity = useUpdateCartQuantity();
  const removeFromCart = useRemoveFromCart();

  const handleUpdateQuantity = (itemId: string, currentQuantity: number, delta: number) => {
    updateQuantity.mutate({ itemId, quantity: currentQuantity + delta });
  };

  const handleRemove = (itemId: string) => {
    removeFromCart.mutate(itemId);
  };

  const subtotal = cartItems?.reduce((sum, item) => sum + Number(item.book.price) * item.quantity, 0) || 0;
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;

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
          <h1 className="text-3xl font-serif font-bold text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">
            {cartItems?.length || 0} {(cartItems?.length || 0) === 1 ? 'item' : 'items'} in your cart
          </p>

          {cartItems && cartItems.length > 0 ? (
            <div className="mt-8 grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-card rounded-xl border border-border animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link to={`/book/${item.book.id}`} className="flex-shrink-0">
                      <img
                        src={item.book.cover_image || '/placeholder.svg'}
                        alt={item.book.title}
                        className="w-24 h-32 object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/book/${item.book.id}`}>
                        <h3 className="font-serif font-semibold hover:text-primary transition-colors">
                          {item.book.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.book.author}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Condition: {item.book.condition}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                            className="p-1 rounded-md hover:bg-muted transition-colors"
                            disabled={updateQuantity.isPending}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                            className="p-1 rounded-md hover:bg-muted transition-colors"
                            disabled={updateQuantity.isPending}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-primary">
                            ₹{(Number(item.book.price) * item.quantity).toFixed(0)}
                          </span>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                            disabled={removeFromCart.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                  <h2 className="font-serif font-semibold text-lg mb-4">Order Summary</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(0)}`}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-sage-dark">
                        Add ₹{(500 - subtotal).toFixed(0)} more for free shipping
                      </p>
                    )}
                    <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span className="text-primary">₹{total.toFixed(0)}</span>
                    </div>
                  </div>
                  <Button variant="hero" className="w-full mt-6" asChild>
                    <Link to="/messages">Proceed to Chat</Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full mt-2">
                    <Link to="/browse">Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage-light mb-6">
                <ShoppingBag className="h-10 w-10 text-sage-dark" />
              </div>
              <h2 className="text-xl font-serif font-semibold">Your cart is empty</h2>
              <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                Looks like you haven't added any books yet. Start exploring!
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
