import apiService from './api.service';

export interface KnowledgeBase {
  id: number;
  name: string;
  samples: number;
  lastUpdated: string;
  selected?: boolean;
  distribution?: number;
}

export interface CreateKnowledgeBaseRequest {
  name: string;
  description: string;
  instructions: string;
}

export interface CreateKnowledgeBaseResponse {
  id: number;
  name: string;
  samples: number;
  lastUpdated: string;
  status: string;
}

export interface GenerateSamplesRequest {
  sampleCount: number;
  model: string;
}

export interface GenerateSamplesResponse {
  jobId: string;
  status: string;
  estimatedTime: string;
}

export interface GenerationStatus {
  jobId: string;
  status: string;
  progress: number;
  samplesGenerated: number;
  totalSamples: number;
}

class KnowledgeBaseService {
  async getKnowledgeBases(): Promise<KnowledgeBase[]> {
    const response = await apiService.get<{ knowledgeBases: KnowledgeBase[] }>('/knowledge-bases');
    return response.knowledgeBases;
  }

  async createKnowledgeBase(request: CreateKnowledgeBaseRequest): Promise<CreateKnowledgeBaseResponse> {
    return apiService.post<CreateKnowledgeBaseResponse>('/knowledge-bases', request);
  }

  async generateSamples(knowledgeBaseId: number, request: GenerateSamplesRequest): Promise<GenerateSamplesResponse> {
    return apiService.post<GenerateSamplesResponse>(`/knowledge-bases/${knowledgeBaseId}/generate`, request);
  }

  async getGenerationStatus(jobId: string): Promise<GenerationStatus> {
    return apiService.get<GenerationStatus>(`/knowledge-bases/jobs/${jobId}`);
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
export default knowledgeBaseService;