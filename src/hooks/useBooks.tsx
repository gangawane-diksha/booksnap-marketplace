import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

type Book = Database['public']['Tables']['books']['Row'];
type BookInsert = Database['public']['Tables']['books']['Insert'];

export interface BookWithSeller extends Book {
  seller: {
    id: string;
    name: string;
    avatar_url: string | null;
    email: string;
  };
}

export function useBooks(category?: string) {
  return useQuery({
    queryKey: ['books', category],
    queryFn: async () => {
      let query = supabase
        .from('books')
        .select(`
          *,
          seller:profiles!books_seller_id_fkey(id, full_name, avatar_url, email)
        `)
        .eq('is_sold', false)
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data.map((book: any) => ({
        ...book,
        seller: {
          id: book.seller?.id || '',
          name: book.seller?.full_name || 'Unknown Seller',
          avatar_url: book.seller?.avatar_url || null,
          email: book.seller?.email || '',
        },
      })) as BookWithSeller[];
    },
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          seller:profiles!books_seller_id_fkey(id, full_name, avatar_url, email)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        seller: {
          id: data.seller?.id || '',
          name: data.seller?.full_name || 'Unknown Seller',
          avatar_url: data.seller?.avatar_url || null,
          email: data.seller?.email || '',
        },
      } as BookWithSeller;
    },
    enabled: !!id,
  });
}

export function useMyBooks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['myBooks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Book[];
    },
    enabled: !!user,
  });
}

export function useCreateBook() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookData: Omit<BookInsert, 'seller_id'>) => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('books')
        .insert({
          ...bookData,
          seller_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['myBooks'] });
      toast({
        title: 'Book listed successfully!',
        description: 'Your book is now visible to potential buyers.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error listing book',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteBook() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookId: string) => {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['myBooks'] });
      toast({
        title: 'Book deleted',
        description: 'Your listing has been removed.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error deleting book',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
