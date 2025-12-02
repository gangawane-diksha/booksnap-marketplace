import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { mockBooks } from '@/data/mockBooks';
import { cn } from '@/lib/utils';

interface CartItem {
  book: typeof mockBooks[0];
  quantity: number;
}

export default function Cart() {
  // Mock cart - in a real app, this would come from state/context
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { book: mockBooks[0], quantity: 1 },
    { book: mockBooks[1], quantity: 1 },
  ]);

  const updateQuantity = (bookId: string, delta: number) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.book.id === bookId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (bookId: string) => {
    setCartItems((items) => items.filter((item) => item.book.id !== bookId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const shipping = subtotal > 25 ? 0 : 4.99;
  const total = subtotal + shipping;

  return (
    <Layout>
      <div className="container-booksnap py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>

          {cartItems.length > 0 ? (
            <div className="mt-8 grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={item.book.id}
                    className="flex gap-4 p-4 bg-card rounded-xl border border-border animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link to={`/book/${item.book.id}`} className="flex-shrink-0">
                      <img
                        src={item.book.coverImage}
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
                            onClick={() => updateQuantity(item.book.id, -1)}
                            className="p-1 rounded-md hover:bg-muted transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.book.id, 1)}
                            className="p-1 rounded-md hover:bg-muted transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-primary">
                            ${(item.book.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.book.id)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
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
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-sage-dark">
                        Add ${(25 - subtotal).toFixed(2)} more for free shipping
                      </p>
                    )}
                    <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button variant="hero" className="w-full mt-6">
                    Proceed to Checkout
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
