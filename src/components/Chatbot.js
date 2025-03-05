import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { config } from '../config';
// Custom Card components to replace shadcn/ui
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg border ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [language, setLanguage] = useState('en');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !sessionId) {
      initializeChat();
    }
  }, [isOpen, sessionId]); // Added sessionId to dependencies

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    const newSessionId = Math.random().toString(36).substring(7);
    setSessionId(newSessionId);

    try {
      const response = await fetch(`${config.API_HOST}/api/user/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: newSessionId }),
      });
      const data = await response.json();
      setMessages([data.message]);
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (messageText.trim() === '') return;

    try {
      const userMessage = { text: messageText, isBot: false, sessionId, language };
      setMessages(prev => [...prev, userMessage]);

      const response = await fetch(`${config.API_HOST}/api/user/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, sessionId, language }),
      });

      const data = await response.json();

      if (data.language) {
        setLanguage(data.language);
      }

      const botMessage = { text: data.response, isBot: true, sessionId, language: data.language || language };
      setMessages(prev => [...prev, botMessage]);
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderStructuredContent = (text) => {
    const sections = text.split('\n\n');
    
    return sections.map((section, idx) => {
      if (section.includes(':')) {
        const [title, ...content] = section.split(':');
        return (
          <div key={idx} className="mb-4">
           <h4 className="font-semibold text-purple-700 mb-2">{title.trim()}:</h4>
           <div className="pl-4">
  {content.join(':').split('\n').map((line, lineIdx) => {
    const [title, ...rest] = line.split(':');
    return (
      <p key={lineIdx} className="mb-2 text-gray-700">
        <span className="font-semibold text-blue-600">{title.trim()}</span>
        {rest.length > 0 && <span>: {rest.join(':').trim()}</span>}
      </p>
    );
  })}
</div>

          </div>
        );
      }
      return <p key={idx} className="mb-4 text-gray-700">{section}</p>;
    });
  };

  const renderMessageContent = (message) => {
    if (!message.isBot) {
      return <p className="text-white">{message.text}</p>;
    }

    const lines = message.text.split('\n');
    const hasOptions = lines.some(line => /^[a-c1-8]\./.test(line.trim()));

    if (hasOptions) {
      return (
        <div className="space-y-2">
          {lines.map((line, index) => {
            if (/^[a-c1-8]\./.test(line.trim())) {
              return (
                <button
                  key={index}
                  onClick={() => handleSendMessage(line.split('.')[0].trim())}  // Trim whitespace & send correct response
                  className="w-full text-left px-3 py-2 rounded bg-blue-50 hover:bg-blue-100 transition-colors duration-200 text-blue-800 text-sm border border-blue-100"
                >
                  {line.trim()}
                </button>
              );
            }            
            return <div key={index} className="text-gray-700 mb-2">{line}</div>;
          })}
        </div>
      );
    }

    return (
      <Card className="shadow-sm">
        <CardContent>
          {renderStructuredContent(message.text)}
        </CardContent>
      </Card>
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all duration-200"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[600px] flex flex-col">
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold text-lg">MedScore Support</h3>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-blue-600 rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[90%] ${message.isBot ? '' : 'bg-blue-500 rounded-lg p-3'}`}>
                  {renderMessageContent(message)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4 flex gap-2 bg-gray-50">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button 
              onClick={() => handleSendMessage()} 
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;