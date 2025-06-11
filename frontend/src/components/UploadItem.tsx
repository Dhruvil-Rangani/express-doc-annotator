// src/components/UploadItem.tsx

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createJob, getJob, type Job } from '@/lib/api';
import { FileText, CheckCircle2, X, AlertTriangle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from './ui/button';

interface UploadItemProps {
  id: string; // A unique ID for this upload instance
  file: File;
  onRemove: (id: string) => void;
  onStatusChange: (id: string, status: Job['status']) => void;
}

const statusToProgress = (status: Job['status']) => {
    switch (status) {
        case 'PENDING': return 25;
        case 'PROCESSING': return 65;
        case 'SUCCESS': return 100;
        case 'FAILED': return 100;
        default: return 0;
    }
}

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function UploadItem({ id, file, onRemove, onStatusChange }: UploadItemProps) {
  const queryClient = useQueryClient();

  const { mutate: createUploadJob, data: job, isPending: isCreatingJob } = useMutation({
    mutationFn: createJob,
    onSuccess: (data) => {
      // Manually set the query data for the new job to avoid a fetch
      queryClient.setQueryData(['job', data.id], data);
    }
  });

  // Query for this specific job's status. It will be identified by the ID from the `job` object.
  const { data: polledJob } = useQuery({
    queryKey: ['job', job?.id],
    queryFn: () => getJob(job!.id),
    enabled: !!job && !(job.status === 'SUCCESS' || job.status === 'FAILED'),
    refetchInterval: 2000,
  });

  const currentJob = polledJob || job;

  // Report status change up to the parent component
  useEffect(() => {
    if (currentJob) {
      onStatusChange(id, currentJob.status);
    }
  }, [currentJob, id, onStatusChange]);

  // Start the job creation when the component mounts
  useEffect(() => {
    createUploadJob();
  }, [createUploadJob]);
  
  const progress = currentJob ? statusToProgress(currentJob.status) : (isCreatingJob ? 10 : 0);
  const isComplete = currentJob?.status === 'SUCCESS' || currentJob?.status === 'FAILED';

  return (
    <li className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center space-x-4">
        <FileText className="h-8 w-8 flex-shrink-0 text-gray-500" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 truncate">{file.name}</p>
          <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
        </div>
        
        {/* Status Area */}
        {isComplete && currentJob?.status === 'SUCCESS' && (
            <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-500" />
        )}
        {isComplete && currentJob?.status === 'FAILED' && (
            <AlertTriangle className="h-6 w-6 flex-shrink-0 text-red-500" />
        )}

        {/* Remove Button - Appears when complete */}
        {isComplete && (
            <Button onClick={() => onRemove(id)} variant="ghost" size="icon" className="flex-shrink-0">
                <X className="h-4 w-4" />
            </Button>
        )}
      </div>

      {/* Progress Bar and Status Text Area */}
      {!isComplete && (
        <div className="mt-2 flex items-center space-x-2">
            <Progress value={progress} className="h-2 flex-1" />
            <p className="text-xs font-medium text-gray-500 w-24 text-right">
              {currentJob?.status || 'Starting...'}
            </p>
        </div>
      )}
    </li>
  );
}