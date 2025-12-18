import { useState } from 'react';
import { Upload, X, BookOpen, DollarSign, Info, Check, Loader2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/BookCard';
import { BookCondition, conditionColors } from '@/data/mockBooks';
import { cn } from '@/lib/utils';
import { useCreateBook } from '@/hooks/useBooks';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const conditions: { value: BookCondition; description: string }[] = [
  { value: 'New', description: 'Unread, perfect condition' },
  { value: 'Like New', description: 'Read once, minimal signs of use' },
  { value: 'Good', description: 'Some wear, all pages intact' },
  { value: 'Acceptable', description: 'Readable, noticeable wear' },
];

export default function Sell() {
  const { user } = useAuth();
  const { toast } = useToast();
  const createBook = useCreateBook();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    condition: '' as BookCondition | '',
    price: '',
    originalPrice: '',
    description: '',
    images: [] as string[],
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // For now, create object URLs for preview (in production, you'd upload to Supabase Storage)
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 5),
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.condition) {
      toast({
        title: 'Please select a condition',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createBook.mutateAsync({
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn || null,
        category: formData.category,
        condition: formData.condition as 'New' | 'Like New' | 'Good' | 'Acceptable',
        price: parseFloat(formData.price),
        original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        description: formData.description || null,
        cover_image: formData.images[0] || null,
      });

      // Reset form
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: '',
        condition: '',
        price: '',
        originalPrice: '',
        description: '',
        images: [],
      });
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const previewBook = formData.title && formData.condition
    ? {
        id: 'preview',
        title: formData.title || 'Book Title',
        author: formData.author || 'Author Name',
        price: parseFloat(formData.price) || 0,
        original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        condition: (formData.condition || 'Good') as string,
        category: formData.category || 'Fiction',
        description: formData.description || '',
        cover_image: formData.images[0] || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
        seller: { name: user?.user_metadata?.full_name || 'You', rating: 5.0, location: 'Your Location' },
      }
    : null;

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-b from-sage-light/30 to-background py-12">
        <div className="container-booksnap text-center">
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
            Sell Your Books
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Give your books a new home and earn some extra cash. It only takes a few minutes to list.
          </p>
        </div>
      </div>

      <div className="container-booksnap py-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Images Upload */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="font-serif font-semibold text-lg mb-4">Book Photos</h2>
                <div className="grid grid-cols-5 gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                      <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-foreground/80 text-background hover:bg-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {formData.images.length < 5 && (
                    <label className="aspect-[3/4] rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Add up to 5 photos. First photo will be the cover image.
                </p>
              </div>

              {/* Book Details */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="font-serif font-semibold text-lg mb-4">Book Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter book title"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Author *</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                      placeholder="Author name"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ISBN (Optional)</label>
                    <input
                      type="text"
                      value={formData.isbn}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isbn: e.target.value }))}
                      placeholder="978-..."
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Fiction">Fiction</option>
                      <option value="Non-Fiction">Non-Fiction</option>
                      <option value="Mystery & Thriller">Mystery & Thriller</option>
                      <option value="Romance">Romance</option>
                      <option value="Sci-Fi & Fantasy">Sci-Fi & Fantasy</option>
                      <option value="Biography">Biography</option>
                      <option value="History">History</option>
                      <option value="Children's Books">Children's Books</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($) *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Original Price (Optional)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData((prev) => ({ ...prev, originalPrice: e.target.value }))}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Condition */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="font-serif font-semibold text-lg mb-4">Condition *</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {conditions.map((cond) => (
                    <button
                      key={cond.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, condition: cond.value }))}
                      className={cn(
                        'flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all',
                        formData.condition === cond.value
                          ? 'border-primary bg-sage-light/50'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                          formData.condition === cond.value ? 'border-primary bg-primary' : 'border-muted-foreground'
                        )}
                      >
                        {formData.condition === cond.value && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <div>
                        <p className="font-medium">{cond.value}</p>
                        <p className="text-sm text-muted-foreground">{cond.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="font-serif font-semibold text-lg mb-4">Description</h2>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell buyers about your book - any highlights, notes, or special features?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  disabled={createBook.isPending} 
                  className="flex-1"
                >
                  {createBook.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Listing'
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="font-serif font-semibold text-lg mb-4">Preview</h2>
              {previewBook ? (
                <BookCard book={previewBook} />
              ) : (
                <div className="aspect-[3/4] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center p-6 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Fill in the details to see a preview of your listing
                  </p>
                </div>
              )}

              {/* Tips */}
              <div className="mt-6 bg-sage-light/50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-sage-dark flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sage-dark">Selling Tips</p>
                    <ul className="mt-2 text-sm text-sage-dark/80 space-y-1">
                      <li>• Good photos increase sales by 50%</li>
                      <li>• Price competitively by checking similar listings</li>
                      <li>• Be honest about the book's condition</li>
                      <li>• Respond quickly to buyer inquiries</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
