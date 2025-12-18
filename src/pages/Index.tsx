import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, DollarSign, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { SearchBar } from '@/components/SearchBar';
import { BookCard } from '@/components/BookCard';
import { CategoryCard } from '@/components/CategoryCard';
import { categories } from '@/data/mockBooks';
import { useBooks } from '@/hooks/useBooks';

const features = [
  { icon: BookOpen, title: 'Vast Selection', description: 'Thousands of pre-loved books across all genres' },
  { icon: DollarSign, title: 'Great Prices', description: 'Save up to 70% compared to new books' },
  { icon: ShieldCheck, title: 'Secure Trading', description: 'Safe transactions with buyer protection' },
  { icon: Truck, title: 'Easy Shipping', description: 'Convenient delivery or local pickup options' },
];

export default function Index() {
  const { data: books, isLoading } = useBooks();
  const featuredBooks = books?.filter((book) => book.is_featured).slice(0, 4) || [];
  const recentBooks = books?.slice(0, 4) || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-sage-light/30 to-background py-20 lg:py-32">
        <div className="absolute top-20 left-10 w-64 h-64 bg-sage/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl" />
        <div className="container-booksnap relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground animate-fade-in">
              Discover Your Next<span className="block text-primary mt-2">Favorite Read</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Buy and sell pre-loved books in your cozy corner of the internet. Great stories deserve a second chapter.
            </p>
            <div className="mt-10 animate-fade-in" style={{ animationDelay: '0.2s' }}><SearchBar /></div>
            <div className="mt-8 flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button variant="hero" asChild><Link to="/browse">Browse Books<ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
              <Button variant="hero-outline" asChild><Link to="/sell">Start Selling</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container-booksnap">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sage-light mb-4">
                  <feature.icon className="h-7 w-7 text-sage-dark" />
                </div>
                <h3 className="font-serif font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24">
        <div className="container-booksnap">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground">Browse Categories</h2>
              <p className="text-muted-foreground mt-2">Find your next read by genre</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex"><Link to="/browse">View All<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((category, index) => (
              <div key={category.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <CategoryCard {...category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Books */}
      <section className="py-16 lg:py-24 bg-muted/50">
        <div className="container-booksnap">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground">Recently Listed</h2>
              <p className="text-muted-foreground mt-2">Fresh additions from our community</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex"><Link to="/browse">View All<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : recentBooks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {recentBooks.map((book, index) => (
                <div key={book.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <BookCard book={{ ...book, cover_image: book.cover_image, original_price: book.original_price, seller: { id: book.seller.id, name: book.seller.name, rating: 5.0, location: 'Online' } }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No books listed yet. Be the first to <Link to="/sell" className="text-primary hover:underline">sell a book</Link>!</div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="container-booksnap">
          <div className="relative bg-gradient-to-br from-sage to-sage-dark rounded-3xl p-10 lg:p-16 text-center overflow-hidden">
            <div className="absolute top-10 left-10 w-20 h-28 bg-primary-foreground/10 rounded-lg rotate-12" />
            <div className="absolute bottom-10 right-10 w-16 h-24 bg-primary-foreground/10 rounded-lg -rotate-12" />
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-primary-foreground">Have Books to Sell?</h2>
              <p className="mt-4 text-lg text-primary-foreground/80 max-w-xl mx-auto">Turn your old books into cash. List them in minutes and reach thousands of book lovers.</p>
              <Button variant="secondary" size="xl" asChild className="mt-8 bg-primary-foreground text-sage-dark hover:bg-primary-foreground/90">
                <Link to="/sell">Start Selling Today<ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
