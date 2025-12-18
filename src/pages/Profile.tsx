import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShoppingBag, Heart, Settings, LogOut, Camera, Loader2, Trash2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/BookCard';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useMyBooks, useDeleteBook } from '@/hooks/useBooks';
import { useWishlist } from '@/hooks/useWishlist';
import { useConversations } from '@/hooks/useChat';

const tabs = [
  { id: 'listings', label: 'My Listings', icon: BookOpen },
  { id: 'messages', label: 'Messages', icon: ShoppingBag },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Profile() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const { data: myBooks, isLoading: loadingBooks } = useMyBooks();
  const { data: wishlist, isLoading: loadingWishlist } = useWishlist();
  const { data: conversations, isLoading: loadingConversations } = useConversations();
  const deleteBook = useDeleteBook();

  const userProfile = {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    avatar: user?.user_metadata?.avatar_url || null,
    joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
  };

  const stats = {
    listings: myBooks?.length || 0,
    messages: conversations?.length || 0,
    favorites: wishlist?.length || 0,
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Layout>
      <div className="container-booksnap py-12">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-sage-light/50 to-background rounded-2xl p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-sage flex items-center justify-center text-primary-foreground text-3xl font-serif font-bold overflow-hidden">
                  {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    userProfile.name.charAt(0).toUpperCase()
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-background border border-border shadow-booksnap-sm hover:bg-muted transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-serif font-bold">{userProfile.name}</h1>
                <p className="text-muted-foreground">{userProfile.email}</p>
                <p className="text-sm text-muted-foreground mt-1">Member since {userProfile.joinDate}</p>
              </div>
              <div className="sm:ml-auto flex gap-4">
                <div className="text-center px-4">
                  <p className="text-2xl font-bold text-primary">{stats.listings}</p>
                  <p className="text-xs text-muted-foreground">Listings</p>
                </div>
                <div className="text-center px-4 border-x border-border">
                  <p className="text-2xl font-bold text-primary">{stats.messages}</p>
                  <p className="text-xs text-muted-foreground">Chats</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-2xl font-bold text-primary">{stats.favorites}</p>
                  <p className="text-xs text-muted-foreground">Favorites</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  activeTab === tab.id ? 'bg-sage text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'listings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif font-semibold text-lg">My Listings</h2>
                  <Button asChild><Link to="/sell">Add New Listing</Link></Button>
                </div>
                {loadingBooks ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : myBooks && myBooks.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                    {myBooks.map((book, index) => (
                      <div key={book.id} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <BookCard book={{
                          id: book.id,
                          title: book.title,
                          author: book.author,
                          price: Number(book.price),
                          original_price: book.original_price ? Number(book.original_price) : null,
                          condition: book.condition,
                          cover_image: book.cover_image,
                          category: book.category,
                        }} />
                        <button
                          onClick={() => deleteBook.mutate(book.id)}
                          disabled={deleteBook.isPending}
                          className="absolute top-3 right-12 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={BookOpen} title="No listings yet" description="Start selling your books today" actionLabel="Create Listing" actionHref="/sell" />
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div>
                <h2 className="font-serif font-semibold text-lg mb-6">Messages</h2>
                {loadingConversations ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : conversations && conversations.length > 0 ? (
                  <div className="space-y-4">
                    {conversations.map((conv) => {
                      const otherUser = conv.buyer_id === user?.id ? conv.seller : conv.buyer;
                      const lastMessage = conv.messages[conv.messages.length - 1];
                      return (
                        <div key={conv.id} className="flex gap-4 p-4 bg-card rounded-xl border border-border">
                          <img src={conv.book.cover_image || '/placeholder.svg'} alt="" className="w-16 h-20 rounded-lg object-cover" />
                          <div className="flex-1">
                            <p className="font-medium">{conv.book.title}</p>
                            <p className="text-sm text-muted-foreground">with {otherUser.full_name || 'User'}</p>
                            {lastMessage && <p className="text-sm text-muted-foreground mt-2 truncate">{lastMessage.content}</p>}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(conv.last_message_at).toLocaleDateString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState icon={ShoppingBag} title="No messages yet" description="Your conversations will appear here" actionLabel="Browse Books" actionHref="/browse" />
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h2 className="font-serif font-semibold text-lg mb-6">Favorite Books</h2>
                {loadingWishlist ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : wishlist && wishlist.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                    {wishlist.map((item, index) => (
                      <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
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
                  <EmptyState icon={Heart} title="No favorites yet" description="Save books you love by clicking the heart icon" actionLabel="Browse Books" actionHref="/browse" />
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-xl">
                <h2 className="font-serif font-semibold text-lg mb-6">Account Settings</h2>
                <div className="space-y-6">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-medium mb-4">Profile Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Display Name</label>
                        <input type="text" defaultValue={userProfile.name} className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input type="email" defaultValue={userProfile.email} disabled className="w-full px-4 py-2 rounded-lg border border-input bg-muted text-muted-foreground" />
                      </div>
                      <Button>Save Changes</Button>
                    </div>
                  </div>

                  <Button variant="outline" className="text-destructive hover:text-destructive" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: { icon: typeof BookOpen; title: string; description: string; actionLabel: string; actionHref: string }) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-light mb-4"><Icon className="h-8 w-8 text-sage-dark" /></div>
      <h3 className="font-serif font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground mt-1">{description}</p>
      <Button asChild className="mt-4"><Link to={actionHref}>{actionLabel}</Link></Button>
    </div>
  );
}
