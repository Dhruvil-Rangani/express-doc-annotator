// src/components/Uploader.tsx
import { useState, useCallback, useEffect, useRef} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FileUpload } from './FileUpload';
import { useToast } from '../hooks/use-toast';
import { createJob } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { Progress } from './ui/progress';
import { CheckCircle2, FileText, AlertTriangle } from 'lucide-react';

// A component to display the progress of a single new upload
function UploadProgressItem({ file, onComplete }: { file: File, onComplete: () => void }) {
    const { toast } = useToast();
    const hasFiredRef = useRef(false);
    const { mutate, isPending, isSuccess, isError } = useMutation({
        mutationFn: () => createJob(file),
        onSuccess: () => {
            onComplete(); // Notify parent that this upload is done
        },
        onError: () => {
            toast({
                variant: 'destructive',
                title: "Upload Failed",
                description: `Could not process ${file.name}.`
            });
            onComplete();
        }
    });

    // 3. THE FIX: Use useEffect to safely handle the side effect (API call)
    useEffect(() => {
        // This check ensures the mutation only fires once, even in StrictMode
        if (!hasFiredRef.current) {
            mutate();
            hasFiredRef.current = true;
        }
    }, [mutate]);

    return (
        <li className="rounded-lg border bg-white p-4">
            <div className="flex items-center space-x-4">
                <FileText className="h-8 w-8 text-gray-500" />
                <div className="flex-1">
                    <p className="font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-sm text-gray-500">
                        {isError ? 'Failed' : isSuccess ? 'Complete' : 'Processing...'}
                    </p>
                </div>
                {isSuccess && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                {isError && <AlertTriangle className="h-6 w-6 text-red-500" />}
            </div>
            {!isSuccess && !isError && <Progress value={isPending ? 30 : 70} className="mt-2 h-2" />}
        </li>
    );
}


// The main Uploader component for the modal
export function Uploader() {
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const queryClient = useQueryClient();

    const handleFilesSelected = (selectedFiles: File[]) => {
        setFilesToUpload(prev => [...prev, ...selectedFiles]);
    };

    // When a single file completes its upload, invalidate the main 'jobs' query to refresh the dashboard
    const handleUploadComplete = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }, [queryClient]);
    
    return (
        <div className="space-y-4">
            <FileUpload onFilesSelected={handleFilesSelected} />
            {filesToUpload.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-medium">Uploading</h4>
                    <ul className="space-y-2">
                        {filesToUpload.map((file, index) => (
                            <UploadProgressItem 
                                key={`${file.name}-${index}`} 
                                file={file}
                                onComplete={handleUploadComplete} 
                            />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
