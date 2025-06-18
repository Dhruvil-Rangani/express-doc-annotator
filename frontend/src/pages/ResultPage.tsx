// src/pages/ResultPage.tsx
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getJob } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export function ResultPage() {
    // 1. Get the job ID from the URL parameters
    const { jobId } = useParams<{ jobId: string }>();

    // 2. Fetch the specific job's data from our API
    const { data: job, isLoading, isError } = useQuery({
        queryKey: ['job', jobId],
        queryFn: () => getJob(Number(jobId)),
        enabled: !!jobId, // Only run the query if jobId exists
    });

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (isError || !job) {
        return <div>Error loading job details. Please try again.</div>;
    }

    return (
        <div className="space-y-6">
            <Button asChild variant="outline">
                <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
            </Button>

            <div>
                <p className="text-sm font-medium text-gray-500">Job ID: {job.id}</p>
                <h1 className="text-3xl font-bold mt-1">Processing Result</h1>
            </div>

            <div className="p-6 bg-white rounded-lg border">
                <h2 className="text-lg font-semibold mb-2">AI Generated Summary:</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.result || 'No summary available.'}</p>
            </div>
        </div>
    )
}
