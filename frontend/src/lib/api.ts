import apiClient from './apiClient';

export interface Job {
    id: number;
    status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
    result: string | null;
    document: string | null;
    created_at: string;
    updated_at: string;
}

// NEW: Define the structure for a chat message
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

// Function to create a new job
export const createJob = async (file: File): Promise<Job> => {
    const formData = new FormData();
    formData.append('document', file);
  const { data } = await apiClient.post('/jobs/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

// NEW: Get all jobs
export const getJobs = async (): Promise<Job[]> => {
    const { data } = await apiClient.get('/jobs/');
    return data;
}

// Function to get a specific job's status
export const getJob = async (jobId: number): Promise<Job> => {
    const { data } = await apiClient.get(`/jobs/${jobId}/`);
    return data;
}

// NEW: Delete a job
export const deleteJob = async (jobId: number): Promise<void> => {
    await apiClient.delete(`/jobs/${jobId}/`);
}

// NEW: Sends a message to the chat endpoint and gets a reply.
export const postChatMessage = async (
    jobId: number, 
    prompt: string, 
    history: ChatMessage[]
): Promise<{ reply: string }> => {
    const { data } = await apiClient.post(`/jobs/${jobId}/chat/`, {
        prompt,
        history,
    });
    return data;
};