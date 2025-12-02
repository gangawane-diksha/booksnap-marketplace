import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  placeholder?: string;
}

export function SearchBar({ variant = 'hero', placeholder = 'Search by title, author, or ISBN...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/browse?search=${encodeURIComponent(query.trim())}`);
    }
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center bg-background rounded-2xl shadow-booksnap-lg border border-border overflow-hidden">
        <Search className="absolute left-5 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 pl-14 pr-4 py-4 text-base bg-transparent focus:outline-none"
        />
        <Button type="submit" variant="hero" className="m-2 rounded-xl">
          Search
        </Button>
      </div>
    </form>
  );
}
