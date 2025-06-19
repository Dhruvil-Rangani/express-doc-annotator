// src/components/FileUpload.tsx

import { useCallback } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps {
    onFilesSelected: (files: File[]) => void;
}

export function FileUpload({ onFilesSelected }: FileUploadProps) {
    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if(acceptedFiles?.length) {
            onFilesSelected(acceptedFiles);
        }
        if (fileRejections?.length > 0) {
            console.error('File(s) rejected: ', fileRejections);
        }
    }, [onFilesSelected]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
            'application/msword': ['.doc', '.docx'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
    });

    return (
        <div
            {...getRootProps()}
            // THE FIX: Changed h-96 to h-64
            className={`
                flex h-64 cursor-pointer flex-col items-center justify-center
                rounded-lg border-2 border-dashed border-gray-300
                transition-colors
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'bg-white hover:bg-gray-50'}
            `}
        >
            <input {...getInputProps()} />
            <div className="text-center">
                <UploadCloud
                    className={`
                        mx-auto h-12 w-12
                        ${isDragActive ? 'text-blue-600' : 'text-gray-400'}
                `}
                />
                {isDragActive ? (
                    <p className="mt-4 text-lg font-semibold text-blue-600">Drop the files here ...</p>
                ) : (
                    <>
                        <p className="mt-4 text-lg font-semibold text-gray-600">
                            Drag 'n' drop files here, or click to select
                        </p>
                        <p className="mt-2 text-sm text-gray-500">PDF, DOCX, TXT files accepted</p>
                    </>
                )}
            </div>
        </div>
    );
}
