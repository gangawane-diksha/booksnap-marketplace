import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConversations, useConversation, useSendMessage, ConversationWithDetails } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  initialConversationId?: string;
}

export function ChatBox({ isOpen, onClose, initialConversationId }: ChatBoxProps) {
  const { user } = useAuth();
  const { data: conversations, isLoading } = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialConversationId || null);
  const { data: selectedConversation } = useConversation(selectedConversationId || '');
  const sendMessage = useSendMessage();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialConversationId) {
      setSelectedConversationId(initialConversationId);
    }
  }, [initialConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversationId) return;

    await sendMessage.mutateAsync({
      conversationId: selectedConversationId,
      content: message,
    });
    setMessage('');
  };

  const getOtherUser = (conv: ConversationWithDetails) => {
    return conv.buyer_id === user?.id ? conv.seller : conv.buyer;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-card border border-border rounded-xl shadow-booksnap-lg flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-sage text-primary-foreground">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold">Messages</span>
        </div>
        <button onClick={onClose} className="hover:opacity-70">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        {!selectedConversationId && (
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">Loading...</div>
            ) : conversations && conversations.length > 0 ? (
              <div className="divide-y divide-border">
                {conversations.map((conv) => {
                  const otherUser = getOtherUser(conv);
                  const lastMessage = conv.messages[conv.messages.length - 1];
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversationId(conv.id)}
                      className="w-full p-4 text-left hover:bg-muted transition-colors"
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center flex-shrink-0">
                          {otherUser.avatar_url ? (
                            <img src={otherUser.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="font-semibold text-sage-dark">
                              {(otherUser.full_name || 'U').charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="font-medium truncate">{otherUser.full_name || 'User'}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(conv.last_message_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conv.book.title}
                          </p>
                          {lastMessage && (
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No conversations yet</p>
                <p className="text-sm mt-1">Contact a seller to start chatting!</p>
              </div>
            )}
          </div>
        )}

        {/* Chat View */}
        {selectedConversationId && selectedConversation && (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-3 border-b border-border flex items-center gap-3">
              <button
                onClick={() => setSelectedConversationId(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ←
              </button>
              <img
                src={selectedConversation.book.cover_image || '/placeholder.svg'}
                alt=""
                className="w-10 h-10 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{selectedConversation.book.title}</p>
                <p className="text-xs text-muted-foreground">
                  ${selectedConversation.book.price}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex',
                    msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2',
                      msg.sender_id === user?.id
                        ? 'bg-sage text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={cn(
                      'text-xs mt-1',
                      msg.sender_id === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-border flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!message.trim() || sendMessage.isPending}
                className="rounded-full"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
