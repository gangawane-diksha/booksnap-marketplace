import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, BookOpen, ShoppingBag, Heart, Settings, LogOut, Camera } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/BookCard';
import { mockBooks } from '@/data/mockBooks';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'listings', label: 'My Listings', icon: BookOpen },
  { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState('listings');
  
  // Mock user data
  const user = {
    name: 'Book Enthusiast',
    email: 'reader@booksnap.com',
    joinDate: 'January 2024',
    avatar: null,
    stats: {
      listings: 5,
      purchases: 12,
      favorites: 8,
    },
  };

  const myListings = mockBooks.slice(0, 3);
  const purchases = mockBooks.slice(3, 5);
  const favorites = mockBooks.slice(5, 8);

  return (
    <Layout>
      <div className="container-booksnap py-12">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gradient-to-br from-sage-light/50 to-background rounded-2xl p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-sage flex items-center justify-center text-primary-foreground text-3xl font-serif font-bold">
                  {user.name.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-background border border-border shadow-booksnap-sm hover:bg-muted transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-serif font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-1">Member since {user.joinDate}</p>
              </div>
              <div className="sm:ml-auto flex gap-4">
                <div className="text-center px-4">
                  <p className="text-2xl font-bold text-primary">{user.stats.listings}</p>
                  <p className="text-xs text-muted-foreground">Listings</p>
                </div>
                <div className="text-center px-4 border-x border-border">
                  <p className="text-2xl font-bold text-primary">{user.stats.purchases}</p>
                  <p className="text-xs text-muted-foreground">Purchases</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-2xl font-bold text-primary">{user.stats.favorites}</p>
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
                  activeTab === tab.id
                    ? 'bg-sage text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
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
                  <Button asChild>
                    <Link to="/sell">Add New Listing</Link>
                  </Button>
                </div>
                {myListings.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                    {myListings.map((book, index) => (
                      <div
                        key={book.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <BookCard book={book} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={BookOpen}
                    title="No listings yet"
                    description="Start selling your books today"
                    actionLabel="Create Listing"
                    actionHref="/sell"
                  />
                )}
              </div>
            )}

            {activeTab === 'purchases' && (
              <div>
                <h2 className="font-serif font-semibold text-lg mb-6">Purchase History</h2>
                {purchases.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                    {purchases.map((book, index) => (
                      <div
                        key={book.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <BookCard book={book} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={ShoppingBag}
                    title="No purchases yet"
                    description="Your purchased books will appear here"
                    actionLabel="Browse Books"
                    actionHref="/browse"
                  />
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h2 className="font-serif font-semibold text-lg mb-6">Favorite Books</h2>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                    {favorites.map((book, index) => (
                      <div
                        key={book.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <BookCard book={book} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Heart}
                    title="No favorites yet"
                    description="Save books you love by clicking the heart icon"
                    actionLabel="Browse Books"
                    actionHref="/browse"
                  />
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
                        <input
                          type="text"
                          defaultValue={user.name}
                          className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <Button>Save Changes</Button>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-medium mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Email me when someone messages me</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Email me about price drops on wishlisted books</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Email me about new features and updates</span>
                      </label>
                    </div>
                  </div>

                  <Button variant="outline" className="text-destructive hover:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
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

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: typeof BookOpen;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-light mb-4">
        <Icon className="h-8 w-8 text-sage-dark" />
      </div>
      <h3 className="font-serif font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground mt-1">{description}</p>
      <Button asChild className="mt-4">
        <Link to={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}
