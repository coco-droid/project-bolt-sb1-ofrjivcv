import apiService from './api.service';

export interface Conversation {
  id: number;
  title: string;
  messageCount: number;
  date: string;
  status: string;
}

export interface Message {
  id: number;
  sender: 'user' | 'ai' | 'system' | 'critique';
  content: string;
  timestamp: string;
  model?: string;
  reasoning?: string;
  selected?: boolean;
  relatedTo?: number;
}

export interface SendMessageRequest {
  content: string;
  models: string[];
}

export interface SendMessageResponse {
  responses: Message[];
}

export interface CritiqueRequest {
  critique: string;
  suggestion: string;
}

export interface CritiqueResponse {
  status: string;
  critiqueId: number;
  suggestionId: number;
}

export interface CreateConversationRequest {
  title: string;
}

class ConversationService {
  async getConversations(): Promise<Conversation[]> {
    const response = await apiService.get<{ conversations: Conversation[] }>('/conversations');
    return response.conversations;
  }

  async createConversation(request: CreateConversationRequest): Promise<Conversation> {
    return apiService.post<Conversation>('/conversations', request);
  }

  async getConversationMessages(conversationId: number): Promise<Message[]> {
    const response = await apiService.get<{ messages: Message[] }>(`/conversations/${conversationId}/messages`);
    return response.messages;
  }

  async sendMessage(conversationId: number, request: SendMessageRequest): Promise<SendMessageResponse> {
    return apiService.post<SendMessageResponse>(`/conversations/${conversationId}/messages`, request);
  }

  async selectResponse(messageId: number): Promise<{ status: string; messageId: number; selected: boolean }> {
    return apiService.post<{ status: string; messageId: number; selected: boolean }>(
      `/conversations/messages/${messageId}/select`, {}
    );
  }

  async critiqueResponse(messageId: number, request: CritiqueRequest): Promise<CritiqueResponse> {
    return apiService.post<CritiqueResponse>(`/conversations/messages/${messageId}/critique`, request);
  }
}

export const conversationService = new ConversationService();
export default conversationService;