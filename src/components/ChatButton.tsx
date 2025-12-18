import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatBox } from './ChatBox';
import { useConversations } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';

export function ChatButton() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { data: conversations } = useConversations();

  if (!user) return null;

  const unreadCount = conversations?.reduce((count, conv) => {
    const unread = conv.messages.filter(
      (msg) => !msg.is_read && msg.sender_id !== user.id
    ).length;
    return count + unread;
  }, 0) || 0;

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-booksnap-lg z-40"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta text-primary-foreground text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      <ChatBox isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
