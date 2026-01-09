import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Send,
  Bot,
  User,
  Heart,
  Lightbulb,
  MessageCircle,
  TrendingUp,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MotivationScore {
  stage: 'precontemplation' | 'contemplation' | 'preparation' | 'action' | 'maintenance';
  score: number;
  importanceRating: number;
  confidenceRating: number;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'message' | 'reflection' | 'question' | 'affirmation';
}

interface MotivationalChatProps {
  assessment: MotivationScore;
  physicianName?: string;
  onMotivationUpdate?: (newAssessment: MotivationScore) => void;
}

// Motivational Interviewing responses based on assessment
const MI_RESPONSES = {
  precontemplation: {
    opening: "I appreciate you taking the time to talk with me today. It sounds like you're not quite ready to think about making changes right now, and that's completely okay. Many people feel this way.",
    questions: [
      "What brought you here today?",
      "What would need to happen for you to consider this important?",
      "What concerns do you have about diabetes?",
      "What matters most to you in your life right now?"
    ],
    reflections: [
      "It sounds like you have a lot on your plate right now.",
      "You're being honest about where you are, and I respect that.",
      "You value your independence and don't want to be told what to do."
    ]
  },
  contemplation: {
    opening: "I can hear that you're thinking about making some changes, but you also have some concerns. That's very normal - most people feel conflicted when considering changes to their lifestyle.",
    questions: [
      "What are some of the good things about your current lifestyle?",
      "What concerns you most about developing diabetes?",
      "If you decided to make changes, what would be most important to you?",
      "What's held you back from making changes before?"
    ],
    reflections: [
      "On one hand, you see the benefits of changing, but on the other hand, you're worried about...",
      "Part of you wants to prevent diabetes, and part of you feels it might be too difficult.",
      "You're torn between wanting to stay healthy and maintaining your current routine."
    ]
  },
  preparation: {
    opening: "It's great to hear that you're ready to take some steps toward preventing diabetes. You seem motivated and thoughtful about this decision.",
    questions: [
      "What specific changes are you thinking about making?",
      "What would success look like to you?",
      "What obstacles do you think you might face?",
      "What has worked for you in the past when making changes?"
    ],
    reflections: [
      "You're ready to take action and just want to make sure you do it right.",
      "You're being realistic about the challenges while staying optimistic.",
      "You've thought this through and feel confident about moving forward."
    ]
  }
};

export function MotivationalChat({ assessment, physicianName = "Dr. Smith", onMotivationUpdate }: MotivationalChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const responses = MI_RESPONSES[assessment.stage] || MI_RESPONSES.contemplation;

  useEffect(() => {
    // Add initial bot message
    const initialMessage: ChatMessage = {
      id: '1',
      content: `Hello! I'm your diabetes prevention coach. ${physicianName} asked me to work with you on your health journey. ${responses.opening}`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'message'
    };
    setMessages([initialMessage]);
  }, [assessment.stage, physicianName, responses.opening]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addBotMessage = (content: string, type: 'message' | 'reflection' | 'question' | 'affirmation' = 'message') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'bot',
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Simple keyword-based responses for demo
    if (lowerMessage.includes('no') || lowerMessage.includes("don't") || lowerMessage.includes("can't")) {
      return responses.reflections[Math.floor(Math.random() * responses.reflections.length)];
    }

    if (lowerMessage.includes('ready') || lowerMessage.includes('want') || lowerMessage.includes('need')) {
      return "I hear that you're feeling ready to make some changes. That takes courage. What feels most important to you right now?";
    }

    if (lowerMessage.includes('scared') || lowerMessage.includes('worried') || lowerMessage.includes('concerned')) {
      return "It sounds like you have some concerns about this. That's completely understandable. What worries you most?";
    }

    if (lowerMessage.includes('family') || lowerMessage.includes('children') || lowerMessage.includes('kids')) {
      return "Your family is clearly important to you. How might preventing diabetes help you be there for them in the way you want?";
    }

    // Default to asking an open-ended question
    return responses.questions[Math.floor(Math.random() * responses.questions.length)];
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate and add bot response
    const botResponse = generateBotResponse(input);
    addBotMessage(botResponse, 'question');
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageIcon = (message: ChatMessage) => {
    if (message.sender === 'user') return <User className="h-4 w-4" />;

    switch (message.type) {
      case 'reflection': return <Heart className="h-4 w-4" />;
      case 'question': return <MessageCircle className="h-4 w-4" />;
      case 'affirmation': return <TrendingUp className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getMessageTypeLabel = (type?: string) => {
    switch (type) {
      case 'reflection': return 'Reflection';
      case 'question': return 'Question';
      case 'affirmation': return 'Affirmation';
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Chat Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Motivation Coaching Session
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              Stage: {assessment.stage.charAt(0).toUpperCase() + assessment.stage.slice(1)}
            </Badge>
            <Badge variant="outline">
              Importance: {assessment.importanceRating}/10
            </Badge>
            <Badge variant="outline">
              Confidence: {assessment.confidenceRating}/10
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lightbulb className="h-4 w-4" />
            Using Motivational Interviewing techniques to explore your readiness for change
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.sender === 'bot' && (
                    <div className="bg-primary text-primary-foreground rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
                      {getMessageIcon(message)}
                    </div>
                  )}

                  <div
                    className={cn(
                      "rounded-lg px-4 py-2 max-w-[80%] space-y-1",
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    )}
                  >
                    {/* Label removed for cleaner UI */}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {message.sender === 'user' && (
                    <div className="bg-secondary text-secondary-foreground rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="bg-primary text-primary-foreground rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator />

          {/* Message Input */}
          <div className="p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your thoughts and feelings..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This conversation helps us understand your motivation better. Press Enter to send.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}