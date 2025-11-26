import { useState } from 'react';
import { ai, MODEL, CONFIG } from '../config/gemini';

interface Message {
  text: string;
  isUser: boolean;
}

export function useGeminiChat(initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (userMessage: string, skipAddingUserMessage = false) => {
    if (!userMessage.trim()) return;

    // Add user message only if not already added
    if (!skipAddingUserMessage) {
      const newUserMessage: Message = { text: userMessage, isUser: true };
      setMessages(prev => [...prev, newUserMessage]);
    }
    setIsLoading(true);

    try {
      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: userMessage,
            },
          ],
        },
      ];

      const response = await ai.models.generateContentStream({
        model: MODEL,
        config: CONFIG,
        contents,
      });

      let fullResponse = '';

      // Create a placeholder for the AI response
      setMessages(prev => [...prev, { text: '', isUser: false }]);

      // Stream the response
      for await (const chunk of response) {
        if (chunk.text) {
          fullResponse += chunk.text;
          // Update the last message (AI response) with accumulated text
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { text: fullResponse, isUser: false };
            return updated;
          });
        }
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prev => [
        ...prev,
        {
          text: 'Sorry, I encountered an error processing your request. Please try again.',
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    setMessages,
  };
}
