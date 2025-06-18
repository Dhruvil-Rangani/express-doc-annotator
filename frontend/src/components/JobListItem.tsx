// src/components/JobListItem.tsx
import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJob, deleteJob, type Job } from '@/lib/api';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { FileText, CheckCircle2, X, AlertTriangle } from 'lucide-react';

interface JobListItemProps {
  initialJob: Job;
}

const statusToProgress = (status: Job['status']) => {
    switch (status) {
        case 'PENDING': return 25;
        case 'PROCESSING': return 65;
        default: return 100;
    }
}

export function JobListItem({ initialJob }: JobListItemProps) {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const statusRef = useRef<Job['status']>(initialJob.status);

    const { data: job } = useQuery({
        queryKey: ['job', initialJob.id],
        queryFn: () => getJob(initialJob.id),
        initialData: initialJob,
        refetchInterval: (query) => {
            const data = query.state.data;
            return data?.status === 'SUCCESS' || data?.status === 'FAILED' ? false : 3000;
        },
    });

    useEffect(() => {
        if (job.status !== statusRef.current) {
            if (job.status === 'SUCCESS') {
                toast({
                    title: "Processing Complete",
                    className: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 border-green-300",
                    duration: 3000,
                });
            }
            statusRef.current = job.status;
        }
    }, [job.status, toast]);

    const deleteMutation = useMutation({
        mutationFn: () => deleteJob(job.id),
        onSuccess: () => {
            toast({ 
                variant: 'destructive',
                title: "Document Removed",
                duration: 3000,
            });
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
        onError: () => {
            toast({ 
                variant: 'destructive', 
                title: "Error", 
                description: "Could not remove document.",
                duration: 3000,
            });
        }
    });

    const isComplete = job.status === 'SUCCESS' || job.status === 'FAILED';
    const isSuccess = job.status === 'SUCCESS';

    return (
        // The `li` remains the relative container
        <li className="relative rounded-lg border bg-white p-4 transition-colors">
            {/* The main content's layout is now ALWAYS consistent */}
            <div className="flex items-center space-x-4">
                <FileText className="h-8 w-8 flex-shrink-0 text-gray-500" />
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{job.document?.split('/').pop() || `Job #${job.id}`}</p>
                    <p className="text-sm text-gray-500">Status: {job.status}</p>
                </div>
                {isSuccess && <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-500" />}
                {job.status === 'FAILED' && <AlertTriangle className="h-6 w-6 flex-shrink-0 text-red-500" />}
            </div>

            {/* The progress bar is also consistently placed */}
            {!isComplete && (
                <Progress value={statusToProgress(job.status)} className="mt-2 h-2" />
            )}
            
            {/* THE FIX: The link is now an invisible overlay on top of the card */}
            {isSuccess && (
                <Link to={`/jobs/${job.id}`} className="absolute inset-0 rounded-lg hover:bg-black/5" aria-label={`View details for job ${job.id}`} />
            )}
            
            {/* The "X" button is placed on top of everything */}
            {isComplete && (
                <Button onClick={() => deleteMutation.mutate()} variant="ghost" size="icon" className="absolute top-1 right-1 h-8 w-8 z-10">
                    <X className="h-4 w-4" />
                </Button>
            )}
        </li>
    );
}
