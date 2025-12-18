import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Grid3X3, List, X, Loader2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { BookCard } from '@/components/BookCard';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { categories, BookCondition } from '@/data/mockBooks';
import { cn } from '@/lib/utils';
import { useBooks } from '@/hooks/useBooks';

const conditions: BookCondition[] = ['New', 'Like New', 'Good', 'Acceptable'];
const priceRanges = [
  { label: 'Under $5', min: 0, max: 5 },
  { label: '$5 - $10', min: 5, max: 10 },
  { label: '$10 - $20', min: 10, max: 20 },
  { label: 'Over $20', min: 20, max: Infinity },
];

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { data: books, isLoading } = useBooks();

  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedCondition = searchParams.get('condition') || '';
  const selectedPriceRange = searchParams.get('price') || '';
  const sortBy = searchParams.get('sort') || 'featured';

  const filteredBooks = useMemo(() => {
    if (!books) return [];
    let result = [...books];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.isbn?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(
        (book) => book.category.toLowerCase().replace(/[^a-z]/g, '-').includes(selectedCategory)
      );
    }

    // Condition filter
    if (selectedCondition) {
      result = result.filter((book) => book.condition === selectedCondition);
    }

    // Price filter
    if (selectedPriceRange) {
      const range = priceRanges.find((r) => r.label === selectedPriceRange);
      if (range) {
        result = result.filter((book) => Number(book.price) >= range.min && Number(book.price) < range.max);
      }
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-high':
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return result;
  }, [books, searchQuery, selectedCategory, selectedCondition, selectedPriceRange, sortBy]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = selectedCategory || selectedCondition || selectedPriceRange || searchQuery;

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-b from-sage-light/30 to-background py-12">
        <div className="container-booksnap">
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground text-center">Browse Books</h1>
          <p className="text-muted-foreground text-center mt-2">Discover your next great read from our collection</p>
          <div className="mt-8 max-w-xl mx-auto"><SearchBar variant="compact" /></div>
        </div>
      </div>

      <div className="container-booksnap py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif font-semibold text-lg">Filters</h2>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-sm text-muted-foreground hover:text-primary">Clear all</button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateFilter('category', selectedCategory === cat.id ? '' : cat.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                        selectedCategory === cat.id ? 'bg-sage text-primary-foreground' : 'hover:bg-muted'
                      )}
                    >
                      <span className="flex items-center gap-2"><span>{cat.icon}</span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <h3 className="font-medium mb-3">Condition</h3>
                <div className="space-y-2">
                  {conditions.map((condition) => (
                    <button
                      key={condition}
                      onClick={() => updateFilter('condition', selectedCondition === condition ? '' : condition)}
                      className={cn(
                        'w-full px-3 py-2 rounded-lg text-sm text-left transition-colors',
                        selectedCondition === condition ? 'bg-sage text-primary-foreground' : 'hover:bg-muted'
                      )}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => updateFilter('price', selectedPriceRange === range.label ? '' : range.label)}
                      className={cn(
                        'w-full px-3 py-2 rounded-lg text-sm text-left transition-colors',
                        selectedPriceRange === range.label ? 'bg-sage text-primary-foreground' : 'hover:bg-muted'
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4 mr-2" />Filters
                </Button>
                <span className="text-sm text-muted-foreground">{filteredBooks.length} books found</span>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="text-sm bg-transparent border border-input rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
                <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
                  <button onClick={() => setViewMode('grid')} className={cn('p-2 transition-colors', viewMode === 'grid' ? 'bg-muted' : 'hover:bg-muted')}>
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setViewMode('list')} className={cn('p-2 transition-colors', viewMode === 'list' ? 'bg-muted' : 'hover:bg-muted')}>
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sage-light text-sage-dark text-sm">
                    Search: {searchQuery}<button onClick={() => updateFilter('search', '')}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sage-light text-sage-dark text-sm">
                    {categories.find((c) => c.id === selectedCategory)?.name}<button onClick={() => updateFilter('category', '')}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {selectedCondition && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sage-light text-sage-dark text-sm">
                    {selectedCondition}<button onClick={() => updateFilter('condition', '')}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {selectedPriceRange && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sage-light text-sage-dark text-sm">
                    {selectedPriceRange}<button onClick={() => updateFilter('price', '')}><X className="h-3 w-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Books Grid */}
            {isLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filteredBooks.length > 0 ? (
              <div className={cn('grid gap-4 lg:gap-6', viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1')}>
                {filteredBooks.map((book, index) => (
                  <div key={book.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <BookCard book={{
                      ...book,
                      cover_image: book.cover_image,
                      original_price: book.original_price,
                      seller: { id: book.seller.id, name: book.seller.name, rating: 5.0, location: 'Online' }
                    }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">No books found matching your criteria.</p>
                {hasActiveFilters ? (
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
                ) : (
                  <Button asChild className="mt-4"><Link to="/sell">Be the first to sell a book</Link></Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-background p-6 overflow-y-auto animate-slide-in-right">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif font-semibold text-lg">Filters</h2>
              <button onClick={() => setShowFilters(false)}><X className="h-6 w-6" /></button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateFilter('category', selectedCategory === cat.id ? '' : cat.id)}
                      className={cn('w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors', selectedCategory === cat.id ? 'bg-sage text-primary-foreground' : 'hover:bg-muted')}
                    >
                      <span className="flex items-center gap-2"><span>{cat.icon}</span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Condition</h3>
                <div className="space-y-2">
                  {conditions.map((condition) => (
                    <button
                      key={condition}
                      onClick={() => updateFilter('condition', selectedCondition === condition ? '' : condition)}
                      className={cn('w-full px-3 py-2 rounded-lg text-sm text-left transition-colors', selectedCondition === condition ? 'bg-sage text-primary-foreground' : 'hover:bg-muted')}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => updateFilter('price', selectedPriceRange === range.label ? '' : range.label)}
                      className={cn('w-full px-3 py-2 rounded-lg text-sm text-left transition-colors', selectedPriceRange === range.label ? 'bg-sage text-primary-foreground' : 'hover:bg-muted')}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-3">
              <Button className="w-full" onClick={() => setShowFilters(false)}>Show Results</Button>
              {hasActiveFilters && <Button variant="outline" className="w-full" onClick={clearFilters}>Clear All Filters</Button>}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
