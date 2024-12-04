import React from 'react';
import { Brain, Lightbulb, X, AlertCircle, CheckCircle, HelpCircle, Send, Loader2 } from 'lucide-react';
import { BusinessInfo } from '../../types';
import { getIndustrySpecificGuidance, getContextualHelp, getSmartSuggestions } from '../../utils/ai/formAssistant';
import { getContextualAssistance } from '../../utils/ai/assistantManager';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface UnifiedAIAssistantProps {
  businessInfo: BusinessInfo;
  currentSection: string;
}

export function UnifiedAIAssistant({ businessInfo, currentSection }: UnifiedAIAssistantProps) {
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [contextualHelp, setContextualHelp] = React.useState<string>('');
  const [smartTips, setSmartTips] = React.useState<string[]>([]);
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'chat' | 'suggestions' | 'help' | 'tips'>('chat');
  const [messages, setMessages] = React.useState<Message[]>([{
    id: '0',
    type: 'assistant',
    content: 'Hello! I\'m your AI assistant. I can help you with your workers\' compensation application. What questions do you have?',
    timestamp: new Date().toISOString()
  }]);
  const [input, setInput] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const dragRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStart = React.useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dragRef.current) {
      setIsDragging(true);
      const style = window.getComputedStyle(dragRef.current);
      const transform = new WebKitCSSMatrix(style.transform);
      
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        offsetX: transform.m41,
        offsetY: transform.m42
      };
    }
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging && dragRef.current && dragStart.current) {
      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;
      const newX = dragStart.current.offsetX + deltaX;
      const newY = dragStart.current.offsetY + deltaY;
      dragRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
    }
  }, [isDragging]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  React.useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const loadSuggestions = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [guidance, help, tips] = await Promise.all([
        getIndustrySpecificGuidance(businessInfo),
        getContextualHelp(currentSection, businessInfo),
        getSmartSuggestions(currentSection, businessInfo)
      ]);
      setSuggestions(guidance);
      setContextualHelp(help);
      setSmartTips(tips);
    } catch (error) {
      console.error('Error loading AI suggestions:', error);
    }
    setIsLoading(false);
  }, [currentSection, businessInfo]);

  React.useEffect(() => {
    if (businessInfo.description) {
      loadSuggestions();
    }
  }, [loadSuggestions, businessInfo.description]);

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

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 right-4 p-3 bg-white rounded-full shadow-lg border border-blue-100 hover:bg-blue-50 transition-colors z-50"
      >
        <Brain className="w-6 h-6 text-blue-600" />
        <span className="sr-only">Show AI Assistant</span>
      </button>
    );
  }

  return (
    <div 
      ref={dragRef}
      className="fixed bottom-4 right-4 w-[450px] bg-white rounded-lg shadow-lg border border-blue-100 overflow-hidden z-50"
      style={{ 
        cursor: isDragging ? 'grabbing' : 'move',
        userSelect: 'none',
        touchAction: 'none'
      }}
    >
      <div 
        className="bg-blue-50 p-3 flex items-center justify-between"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'move' }}
      >
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-medium text-blue-900">AI Assistant</h3>
            <div className="flex items-center gap-1 text-sm text-blue-700">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              {isLoading ? 'Analyzing...' : 'Ready to help'}
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsExpanded(false)}
          className="text-blue-400 hover:text-blue-600"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <Brain className="w-4 h-4" />
              Chat
            </div>
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'suggestions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <Lightbulb className="w-4 h-4" />
              Suggestions
            </div>
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'help' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <HelpCircle className="w-4 h-4" />
              Help
            </div>
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'tips' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Tips
            </div>
          </button>
        </div>
      </div>

      <div className="h-[400px] overflow-y-auto">
        {activeTab === 'chat' ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
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
        ) : (
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center gap-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 animate-pulse" />
                  <span>Analyzing your application...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {activeTab === 'suggestions' && (
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600 mt-1" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Smart Suggestions
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Based on your {currentSection.replace('_', ' ').toLowerCase()} data
                      </p>
                      <ul className="mt-2 space-y-2">
                        {suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-400 flex-shrink-0">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {activeTab === 'help' && (
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600 mt-1" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Contextual Help
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Expert guidance for current section
                      </p>
                      <div className="mt-2 text-sm text-gray-600">
                        {contextualHelp}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'tips' && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-1" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Smart Tips
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Optimize your application
                      </p>
                      <ul className="mt-2 space-y-2">
                        {smartTips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-400 flex-shrink-0">✓</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Brain className="w-3 h-3 animate-pulse" />
            <span>AI continuously learning from your input</span>
          </div>
          {!isLoading && activeTab !== 'chat' && (
            <button
              onClick={() => loadSuggestions()}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Brain className="w-3 h-3" />
              Refresh
            </button>
          )}
        </div>
      </div>
    </div>
  );
}