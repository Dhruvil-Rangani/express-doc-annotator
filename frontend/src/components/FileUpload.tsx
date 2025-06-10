// src/components/FileUpload.tsx

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

export function FileUpload() {
    // Callback function to handle file drop
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // For now, we'll just log the accepted files
        // In a future, we can handle the file upload logic here
        console.log('Accepted files:', acceptedFiles);
    }, []);

    // useDropzone hook provided props and state for the dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
            'application/msword': ['.doc', '.docx'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.ms-excel': ['.xls', '.xlsx'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-powerpoint': ['.ppt', '.pptx'],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
            'application/zip': ['.zip', '.rar', '.tar', '.gz'],
            'text/csv': ['.csv'],
        },
    });

    return (
        // The main container div gets props from getRootProps.
        // We conditionally apply styles based on whether a file is being dragged over the dropzone.
        <div
            {...getRootProps()}
            className={`
                flex h-96 cursor-pointer flex-col items-center justify-center
                rounded-lg border-2 border-dashed border-gray-300
                transition-colors
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'bg-white hover:bg-gray-50'}
            `}
        >
            {/* The hidden file input gets props from getInputProps. */}
            <input {...getInputProps()} />
            {/* Icon and text displayed in the dropzone */}
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
                            Drag 'n' drop some files here, or click to select files
                        </p>
                        <p className="mt-2 text-sm text-gray-500">PDF, DOCX, TXT files accepted</p>
                    </>
                )}
            </div>
        </div>
    );
}