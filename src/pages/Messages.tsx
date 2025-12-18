import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useConversations } from '@/hooks/useChat';
import { formatDistanceToNow } from 'date-fns';

export default function Messages() {
  const { data: conversations, isLoading } = useConversations();

  if (isLoading) {
    return (
      <Layout>
        <div className="container-booksnap py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-booksnap py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-2">
            {conversations?.length || 0} {(conversations?.length || 0) === 1 ? 'conversation' : 'conversations'}
          </p>

          {conversations && conversations.length > 0 ? (
            <div className="mt-8 space-y-4">
              {conversations.map((conversation, index) => (
                <Link
                  key={conversation.id}
                  to={`/book/${conversation.book_id}`}
                  className="block p-4 bg-card rounded-xl border border-border hover:border-primary transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={(conversation as any).books?.cover_image || '/placeholder.svg'}
                        alt={(conversation as any).books?.title || 'Book'}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-semibold text-foreground">
                        {(conversation as any).books?.title || 'Book'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {(conversation as any).books?.author || 'Author'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Last message: {conversation.last_message_at 
                          ? formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })
                          : 'No messages yet'}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage-light mb-6">
                <MessageCircle className="h-10 w-10 text-sage-dark" />
              </div>
              <h2 className="text-xl font-serif font-semibold">No conversations yet</h2>
              <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                Start a conversation by contacting a seller on any book listing.
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
