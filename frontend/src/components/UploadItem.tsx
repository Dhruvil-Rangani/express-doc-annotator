// src/components/UploadItem.tsx

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createJob, getJob, type Job } from '@/lib/api';
import { FileText, CheckCircle2, X, AlertTriangle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createUploadJob, data: job } = useMutation({
    mutationFn: createJob,
    onSuccess: (data) => {
      // Manually set the query data for the new job to avoid a fetch
      queryClient.setQueryData(['job', data.id], data);
    },
    onError: (error: unknown) => {
      let message = `Could not start processing for ${file.name}. Please try again.`;
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: message,
      });
      onStatusChange(id, 'FAILED');
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
    createUploadJob(file);
  }, [createUploadJob, file]);


  const isComplete = currentJob?.status === 'SUCCESS' || currentJob?.status === 'FAILED';
  const isSuccess = currentJob?.status === 'SUCCESS';

  const itemContent = (
    <>
      <div className="flex items-center space-x-4">
        <FileText className="h-8 w-8 flex-shrink-0 text-gray-500" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 truncate">{file.name}</p>
          <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
        </div>
        {isSuccess && <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-500" />}
        {currentJob?.status === 'FAILED' && <AlertTriangle className="h-6 w-6 flex-shrink-0 text-red-500" />}
      </div>
      {!isComplete && (
        <div className="mt-2 flex items-center space-x-2">
          <Progress value={statusToProgress(currentJob?.status || 'PENDING')} className="h-2 flex-1" />
          <p className="text-xs font-medium text-gray-500 w-24 text-right">{currentJob?.status || 'Starting...'}</p>
        </div>
      )}
    </>
  );

  return (
    <li className={`rounded-lg border border-gray-200 bg-white p-4 transition-colors ${isSuccess ? 'hover:bg-gray-50' : ''}`}>
      {isSuccess ? (
        <Link to={`/jobs/${currentJob.id}`} className="flex items-center justify-between w-full">
          <div className="flex-1">{itemContent}</div>
        </Link>
      ) : (
        itemContent
      )}
      {/* The remove button needs to be outside the link to work properly */}
      {isComplete && (
        <Button onClick={() => onRemove(id)} variant="ghost" size="icon" className="flex-shrink-0 absolute top-2 right-2">
          <X className="h-4 w-4" />
        </Button>
      )}
    </li>
  );
}