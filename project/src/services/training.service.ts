import apiService from './api.service';

export interface TrainingSession {
  id: number;
  date: string;
  duration: string;
  baseModel: string;
  checkpoint: string | null;
  metrics: {
    accuracy: number;
    loss: number;
    f1Score: number;
  };
  knowledgeBases: string[];
}

export interface TrainingMetric {
  id: number;
  name: string;
  value: number;
  change: number;
  date: string;
  checkpoint: string;
}

export interface TrainingProgress {
  sessionId: number;
  progress: number;
  status: string;
  timeRemaining: string;
}

export interface StartTrainingRequest {
  baseModel: string;
  useCheckpoint: boolean;
  checkpointId: string;
  knowledgeBases: {
    id: number;
    distribution: number;
  }[];
}

export interface StartTrainingResponse {
  sessionId: number;
  status: string;
  estimatedDuration: string;
}

export interface TestCheckpointRequest {
  message: string;
}

export interface TestCheckpointResponse {
  response: string;
  checkpoint: string;
  date: string;
  metrics: {
    confidence: number;
    responseTime: string;
  };
}

class TrainingService {
  async getTrainingSessions(): Promise<TrainingSession[]> {
    const response = await apiService.get<{ sessions: TrainingSession[] }>('/training/sessions');
    return response.sessions;
  }

  async getTrainingMetrics(): Promise<TrainingMetric[]> {
    const response = await apiService.get<{ metrics: TrainingMetric[] }>('/training/metrics');
    return response.metrics;
  }

  async startTrainingSession(request: StartTrainingRequest): Promise<StartTrainingResponse> {
    return apiService.post<StartTrainingResponse>('/training/sessions', request);
  }

  async getTrainingProgress(sessionId: number): Promise<TrainingProgress> {
    return apiService.get<TrainingProgress>(`/training/sessions/${sessionId}/progress`);
  }

  async testCheckpoint(checkpointId: string, request: TestCheckpointRequest): Promise<TestCheckpointResponse> {
    return apiService.post<TestCheckpointResponse>(`/training/checkpoints/${checkpointId}/test`, request);
  }
}

export const trainingService = new TrainingService();
export default trainingService;