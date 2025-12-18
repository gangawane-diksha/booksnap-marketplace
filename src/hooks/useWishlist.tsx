import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface WishlistItemWithBook {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
    original_price: number | null;
    condition: string;
    cover_image: string | null;
    category: string;
    seller_id: string;
  };
}

export function useWishlist() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          id,
          book:books(id, title, author, price, original_price, condition, cover_image, category, seller_id)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data as WishlistItemWithBook[];
    },
    enabled: !!user,
  });
}

export function useIsWishlisted(bookId: string) {
  const { data: wishlist } = useWishlist();
  return wishlist?.some((item) => item.book.id === bookId) ?? false;
}

export function useToggleWishlist() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookId: string) => {
      if (!user) throw new Error('Must be logged in');

      // Check if already in wishlist
      const { data: existing } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .maybeSingle();

      if (existing) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        return { action: 'removed' as const };
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlist_items')
          .insert({ user_id: user.id, book_id: bookId });
        if (error) throw error;
        return { action: 'added' as const };
      }
    },
    onSuccess: ({ action }) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({
        title: action === 'added' ? 'Added to wishlist!' : 'Removed from wishlist',
        description: action === 'added' 
          ? 'Book has been saved to your wishlist.' 
          : 'Book has been removed from your wishlist.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
