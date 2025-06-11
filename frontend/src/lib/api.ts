import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Job {
    id: number;
    status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
    result: string | null;
    created_at: string;
    updated_at: string;
}

// Function to create a new job
export const createJob = async (): Promise<Job> => {
  const { data } = await apiClient.post('/jobs/', { status: 'PENDING' });
  return data;
};

// Function to get a specific job's status
export const getJob = async (jobId: number): Promise<Job> => {
    const { data } = await apiClient.get(`/jobs/${jobId}/`);
    return data;
}