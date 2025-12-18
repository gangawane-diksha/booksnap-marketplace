import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { useEffect } from 'react';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface ConversationWithDetails {
  id: string;
  book_id: string;
  buyer_id: string;
  seller_id: string;
  last_message_at: string;
  created_at: string;
  book: {
    id: string;
    title: string;
    cover_image: string | null;
    price: number;
  };
  buyer: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  seller: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  messages: Message[];
}

export function useConversations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          book:books(id, title, cover_image, price),
          buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url),
          seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url),
          messages(*)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      return data as ConversationWithDetails[];
    },
    enabled: !!user,
  });
}

export function useConversation(conversationId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up realtime subscription
  useEffect(() => {
    if (!conversationId || !user) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user, queryClient]);

  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          book:books(id, title, cover_image, price),
          buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url),
          seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url),
          messages(*)
        `)
        .eq('id', conversationId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        // Sort messages by created_at
        data.messages = data.messages.sort(
          (a: Message, b: Message) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }

      return data as ConversationWithDetails | null;
    },
    enabled: !!conversationId && !!user,
  });
}

export function useStartConversation() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookId, sellerId }: { bookId: string; sellerId: string }) => {
      if (!user) throw new Error('Must be logged in');
      if (user.id === sellerId) throw new Error("You can't message yourself");

      // Check if conversation already exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('book_id', bookId)
        .eq('buyer_id', user.id)
        .maybeSingle();

      if (existing) {
        return existing;
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          book_id: bookId,
          buyer_id: user.id,
          seller_id: sellerId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
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

export function useSendMessage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation's last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data;
    },
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
