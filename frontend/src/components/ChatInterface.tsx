// src/components/ChatInterface.tsx
import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { postChatMessage, type ChatMessage } from '@/lib/api';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '../hooks/use-toast';

interface ChatInterfaceProps {
  jobId: number;
}

export function ChatInterface({ jobId }: ChatInterfaceProps) {
    const { toast } = useToast();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const chatMutation = useMutation({
        mutationFn: (newPrompt: string) => {
            const history = messages.slice(-10); // Send the last 10 messages as history
            return postChatMessage(jobId, newPrompt, history);
        },
        onSuccess: (data) => {
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        },
        onError: () => {
            toast({
                variant: 'destructive',
                title: "Error",
                description: "Could not get a response. Please try again.",
            });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || chatMutation.isPending) return;

        setMessages(prev => [...prev, { role: 'user', content: input }]);
        chatMutation.mutate(input);
        setInput('');
    };

    return (
        <div className="mt-8 pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Ask Questions About This Document</h2>
            {/* THE FIX: Removed max-h-[50vh] to allow the container to grow */}
            <div className="space-y-4 bg-white p-4 rounded-lg border flex flex-col">
                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                    {messages.map((msg, index) => (
                        <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : '')}>
                            {msg.role === 'assistant' && <div className="p-2 rounded-full bg-gray-100 border"><Bot className="h-5 w-5 text-gray-600" /></div>}
                            <div className={cn("max-w-md rounded-lg p-3 text-sm", msg.role === 'assistant' ? 'bg-gray-100' : 'bg-blue-500 text-white')}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            {msg.role === 'user' && <div className="p-2 rounded-full bg-blue-500 border border-blue-600"><User className="h-5 w-5 text-white" /></div>}
                        </div>
                    ))}
                    {chatMutation.isPending && (
                        <div className="flex items-start gap-3">
                           <div className="p-2 rounded-full bg-gray-100 border"><Bot className="h-5 w-5 text-gray-600" /></div>
                           <div className="max-w-md rounded-lg p-3 text-sm bg-gray-100 flex items-center">
                               <Loader2 className="h-4 w-4 animate-spin" />
                           </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4 border-t">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a follow-up question..."
                        className="flex-1 resize-none"
                        rows={1}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <Button type="submit" disabled={chatMutation.isPending} size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
