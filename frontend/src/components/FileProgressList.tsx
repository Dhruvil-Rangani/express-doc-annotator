// src/components/FileProgressList.tsx

import { FileText } from 'lucide-react';
import { Progress } from "@/components/ui/progress"; // Import the progress bar
import type { UploadableFile } from "@/App";

interface FileProgressListProps {
    files: UploadableFile[];
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

export function FileProgressList({ files }: FileProgressListProps) {
    return (
        <div className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold">Uploading Files</h3>
            <ul className="space-y-3">
                {files.map((uploadableFile) => (
                    <li key={uploadableFile.id} className="rounded-lg border border-gray-200 bg-white p-4">
                        <div className="flex items-center space-x-4">
                            <FileText className="h-8 w-8 text-gray-500" />
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">{uploadableFile.file.name}</p>
                                <p className="text-sm text-gray-500">{formatBytes(uploadableFile.file.size)}</p>
                            </div>
                        </div>
                        {/* The progress value is now dynamic!The progress value is now dynamic! */}
                        <Progress value={uploadableFile.progress} className="mt-2 h-2" />
                    </li>
                ))}
            </ul>
        </div>
    )
}
