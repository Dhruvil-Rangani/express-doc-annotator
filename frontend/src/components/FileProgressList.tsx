// src/components/FileProgressList.tsx

import { FileText, CheckCircle2, X } from 'lucide-react';
import { Progress } from "@/components/ui/progress"; // Import the progress bar
import { Button } from "@/components/ui/button";
import type { UploadableFile } from "@/App";

interface FileProgressListProps {
    files: UploadableFile[];
    onRemoveFile: (fileId: string) => void; // New prop for handling removal
    isUploadComplete: boolean; // New prop to know the overall status
}

// A small utility function to format bytes into a more readable format
function formatBytes(bytes: number, decimals = 2): string {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function FileProgressList({ files, onRemoveFile, isUploadComplete }: FileProgressListProps) {
    return (
        <div className="mt-8 space-y-4">
            {/* 1. Dynamic Title */}
            <h3 className="text-xl font-semibold">
                {isUploadComplete ? 'Uploaded Files' : 'Uploading Files'}
            </h3>
            <ul className="space-y-3">
                {files.map((uploadableFile) => {
                    const isFileComplete = uploadableFile.progress === 100;
                    return (
                        <li key={uploadableFile.id} className="rounded-lg border border-gray-200 bg-white p-4">
                            <div className="flex items-center space-x-4">
                                <FileText className="h-8 w-8 flex-shrink-0 text-gray-500" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 truncate">{uploadableFile.file.name}</p>
                                    <p className="text-sm text-gray-500">{formatBytes(uploadableFile.file.size)}</p>
                                </div>

                                {/* 2. Show Checkmark or Percentage */}
                                {isFileComplete ? (
                                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-500" />
                                ) : (
                                    <p className="text-sm font-medium">{Math.round(uploadableFile.progress)}%</p>
                                )}

                                {/* 3. Show Remove Button */}
                                {isFileComplete && (
                                    <Button onClick={() => onRemoveFile(uploadableFile.id)} variant="ghost" size="icon" className="flex-shrink-0">
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            {/* Only show progress bar if not complete */}
                            {!isFileComplete && (
                                <Progress value={uploadableFile.progress} className="mt-2 h-2" />
                            )}
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}
