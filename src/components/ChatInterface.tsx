import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Send, Bot, User, Loader2, Clock, Hash } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI assistant for ARGO data analysis. I can help you query oceanographic data, visualize profiles, and find insights from the Indian Ocean ARGO float network. What would you like to explore today?',
      timestamp: new Date(),
      suggestions: [
        'Show me salinity profiles near the equator in March 2023',
        'Compare BGC parameters in the Arabian Sea for the last 6 months',
        'What are the nearest ARGO floats to coordinates 10°S, 80°E?',
        'Find temperature anomalies in the Bay of Bengal'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const recentQueries = [
    {
      query: 'Show me salinity profiles near the equator in March 2023',
      timestamp: '2 hours ago',
      type: 'spatial-temporal'
    },
    {
      query: 'Compare BGC parameters in Arabian Sea',
      timestamp: '1 day ago',
      type: 'comparison'
    },
    {
      query: 'Find nearest ARGO floats to 10°S, 80°E',
      timestamp: '2 days ago',
      type: 'location'
    },
    {
      query: 'Temperature trends in Bay of Bengal',
      timestamp: '3 days ago',
      type: 'analysis'
    },
    {
      query: 'Export chlorophyll data as NetCDF',
      timestamp: '1 week ago',
      type: 'export'
    }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateMockResponse(inputMessage),
        timestamp: new Date(),
        suggestions: generateSuggestions(inputMessage)
      };

      setMessages(prev => [...prev, assistantResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const generateMockResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('salinity') && lowerQuery.includes('equator')) {
      return `I found 147 salinity profiles near the equator (±2°) for March 2023. The data shows typical equatorial upwelling patterns with lower salinity values (34.2-34.6 PSU) in the upper 100m. I've identified 12 active ARGO floats in this region during the specified period. The profiles show interesting variability related to the Indian Ocean Dipole. Would you like me to visualize these profiles or compare them with other months?`;
    }
    
    if (lowerQuery.includes('bgc') && lowerQuery.includes('arabian sea')) {
      return `Analyzing BGC parameters in the Arabian Sea over the last 6 months reveals significant seasonal variations. I found data from 23 BGC-enabled floats showing:\n\n• Chlorophyll-a concentrations peaked during the Southwest Monsoon (June-August)\n• Oxygen minimum zones intensified at 200-800m depth\n• pH values showed a declining trend, particularly in coastal regions\n• Nitrate levels increased during upwelling periods\n\nThe data suggests enhanced productivity during monsoon season. Would you like detailed visualizations or statistical analysis of specific parameters?`;
    }
    
    if (lowerQuery.includes('nearest') && lowerQuery.includes('float')) {
      return `I found 8 ARGO floats within 100km of the specified coordinates (10°S, 80°E):\n\n• Float 2902734: 45km NE, last profile 2 days ago\n• Float 2902851: 67km SW, active BGC float\n• Float 2902923: 89km N, temperature/salinity only\n• Float 2903156: 92km SE, full BGC suite\n\nThe closest float (2902734) has complete T/S profiles down to 2000m depth. All floats are operational and transmitting data regularly. Would you like to see their recent profiles or trajectory maps?`;
    }
    
    return `I understand you're interested in "${query}". I can help you analyze ARGO data using natural language queries. The system can process requests about temperature, salinity, BGC parameters, float locations, and temporal/spatial analysis. Could you provide more specific details about what you'd like to explore?`;
  };

  const generateSuggestions = (query: string): string[] => {
    return [
      'Show me the data visualization',
      'Export this data to NetCDF format',
      'Compare with historical averages',
      'Find similar patterns in other regions'
    ];
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span>AI Assistant</span>
              <Badge variant="secondary">RAG-Powered</Badge>
            </CardTitle>
            <CardDescription>
              Ask questions about ARGO data in natural language
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 mb-4 p-4 border rounded-lg bg-gray-50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div className={`flex items-start space-x-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      <div className={`flex items-start space-x-2 max-w-[80%] ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`p-2 rounded-full ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white border shadow-sm'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div className={`p-3 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white border shadow-sm'
                        }`}>
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2 ml-12">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-white border shadow-sm">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="p-3 rounded-lg bg-white border shadow-sm flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Analyzing your query...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Ask about ARGO data, floats, profiles, or any oceanographic question..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Recent Queries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentQueries.map((item, index) => (
                <div key={index} className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left text-sm h-auto p-2 hover:bg-gray-50"
                    onClick={() => handleSuggestionClick(item.query)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{item.query}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">{item.timestamp}</span>
                        <Badge 
                          variant="outline" 
                          className="text-xs px-1.5 py-0.5"
                        >
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                  </Button>
                </div>
              ))}
              <div className="pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  <Hash className="h-3 w-3 mr-1" />
                  View All History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Query Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900">Spatial Queries</p>
                <p>Use coordinates, regions, or geographic features</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium text-gray-900">Temporal Filters</p>
                <p>Specify dates, months, seasons, or time ranges</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium text-gray-900">Parameters</p>
                <p>Temperature, salinity, pressure, BGC variables</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}