
import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import ChatInput from '@/components/ChatInput';
import MessageBubble, { Message } from '@/components/MessageBubble';
import LoadingIndicator from '@/components/LoadingIndicator';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { sendMessageToWebhook } from '@/utils/chatWebhook';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus, History } from 'lucide-react';

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'مرحباً، أنا طمّني - المساعد الطبي لصحة طفلك. كيف يمكنني مساعدتك اليوم؟',
    sender: 'assistant',
    timestamp: new Date()
  }
];

const ChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  useEffect(() => {
    if (currentSessionId) {
      fetchMessages(currentSessionId);
    } else {
      setMessages(INITIAL_MESSAGES);
    }
  }, [currentSessionId]);

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user?.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
    } else {
      setSessions(data || []);
      if (data && data.length > 0) {
        setCurrentSessionId(data[0].id);
      }
    }
    setIsInitialLoading(false);
  };

  const fetchMessages = async (sessionId: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      const formattedMessages: Message[] = (data || []).map(m => ({
        id: m.id,
        text: m.content,
        sender: m.role as 'user' | 'assistant',
        timestamp: new Date(m.created_at)
      }));
      setMessages(formattedMessages.length > 0 ? formattedMessages : INITIAL_MESSAGES);
    }
    setIsLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

    // Add user message to UI
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('assistant-chat', {
        body: {
          sessionId: currentSessionId,
          message: text,
          userId: user.id
        }
      });

      if (error) throw error;

      if (!currentSessionId && data.sessionId) {
        setCurrentSessionId(data.sessionId);
        fetchSessions(); // Refresh sessions list to get the new one with title
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error("عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setCurrentSessionId(null);
    setMessages(INITIAL_MESSAGES);
  };

  const getCurrentSessionName = () => {
    if (!currentSessionId) return "استشارة جديدة";
    const session = sessions.find(s => s.id === currentSessionId);
    return session?.name || "محادثة سابقة";
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      <Header title="استشارة طبية" />

      <div className="flex items-center justify-between px-1 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 rounded-2xl bg-white shadow-soft border-none px-4 h-11 text-sm font-bold">
              <History size={16} className="text-primary" />
              <span className="truncate max-w-[150px]">{getCurrentSessionName()}</span>
              <ChevronDown size={14} className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 rounded-2xl p-2 shadow-xl border-gray-100">
            <DropdownMenuItem
              onClick={startNewChat}
              className="rounded-xl flex items-center gap-2 p-3 font-bold text-primary active:bg-primary/5 hover:bg-primary/5 cursor-pointer"
            >
              <Plus size={16} />
              استشارة جديدة
            </DropdownMenuItem>
            {sessions.length > 0 && <div className="h-px bg-gray-50 my-2 mx-1" />}
            <div className="max-h-60 overflow-y-auto">
              {sessions.map(session => (
                <DropdownMenuItem
                  key={session.id}
                  onClick={() => setCurrentSessionId(session.id)}
                  className={`rounded-xl p-3 flex flex-col items-start gap-1 cursor-pointer mb-1 ${currentSessionId === session.id ? 'bg-primary/5 border border-primary/20' : 'hover:bg-gray-50'}`}
                >
                  <span className="font-bold text-sm truncate w-full">{session.name || "محادثة سابقة"}</span>
                  <span className="text-[10px] text-muted-foreground italic">
                    {new Date(session.updated_at).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="bg-primary/10 text-primary p-2 rounded-xl">
          <Info size={18} />
        </div>
      </div>

      {!currentSessionId && messages.length <= 1 && (
        <div className="bg-primary/5 p-4 rounded-3xl border border-primary/10 mb-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <p className="text-xs text-primary leading-relaxed font-medium">
            أنا مساعدك الطبي الذكي، اتفضلي اسألي أي سؤال بخصوص صحة طفلك أو نموه، وهساعدك بكل حب.
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-4 py-2 scrollbar-hide">
        <div className="flex flex-col">
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="mt-auto sticky bottom-0 bg-background/80 backdrop-blur-sm pt-2">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        <p className="text-[10px] text-center text-muted-foreground mt-4 pb-2">
          المعلومات استرشادية وليست بديلاً عن استشارة الطبيب المختص
        </p>
      </div>
    </div>
  );
};

export default ChatPage;
