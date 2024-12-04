import React from 'react';
import { Brain, Send, Loader2, AlertCircle } from 'lucide-react';
import { getContextualAssistance } from '../../utils/ai/assistantManager';
import { BusinessInfo } from '../../types';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIChatInterfaceProps {
  businessInfo: BusinessInfo;
  currentSection: string;
}

export function AIChatInterface({ businessInfo, currentSection }: AIChatInterfaceProps) {
  const [messages, setMessages] = React.useState<Message[]>([{
    id: '0',
    type: 'assistant',
    content: 'Hello! I\'m your AI assistant. I can help you with your workers\' compensation application. What questions do you have?',
    timestamp: new Date().toISOString()
  }]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await getContextualAssistance(currentSection, businessInfo);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.suggestions[0] || 'I apologize, but I\'m unable to provide a specific answer at the moment. Please try rephrasing your question.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setError('I encountered an error processing your request. Please try again.');
      console.error('AI Chat Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed bottom-4 right-[420px] w-96 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col max-h-[600px]">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-blue-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-medium text-gray-900">AI Assistant</h3>
            <p className="text-sm text-gray-600">Ask me anything about your application</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            className="flex-1 resize-none rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2 text-sm min-h-[40px] max-h-[120px]"
            rows={1}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}