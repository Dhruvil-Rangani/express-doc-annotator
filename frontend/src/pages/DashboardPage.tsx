// src/pages/DashboardPage.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getJobs } from '@/lib/api';
import { JobListItem } from '@/components/JobListItem';
import { Uploader } from '@/components/Uploader';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, FileWarning } from "lucide-react";
import { JobListItemSkeleton } from '@/components/JobListItemSkeleton';

export function DashboardPage() {
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);

    // Fetch the list of all historical jobs from the server
    const { data: jobs, isLoading } = useQuery({
        queryKey: ['jobs'],
        queryFn: getJobs,
    });

    return (
        <>
            <header className="flex items-center justify-between border-b border-gray-200 pb-6">
                <div>
                    <h2 className="text-3xl font-bold">Dashboard</h2>
                    <p className="mt-1 text-gray-500">View and manage your processed documents.</p>
                </div>
                {/* This button now opens the upload modal */}
                <Dialog open={isUploadModalOpen} onOpenChange={setUploadModalOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg"><Upload className="mr-2 h-4 w-4" />Upload Document</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Upload New Documents</DialogTitle>
                        </DialogHeader>
                        <Uploader />
                    </DialogContent>
                </Dialog>
            </header>

            <div className="mt-8 space-y-4">
                <h3 className="text-xl font-semibold">My Documents</h3>
                {/* 2. Implement the new loading logic */}
                {isLoading ? (
                    <ul className="space-y-3">
                        {/* Render 3 skeleton items to give a sense of the content */}
                        <JobListItemSkeleton />
                        <JobListItemSkeleton />
                        <JobListItemSkeleton />
                    </ul>
                ) : jobs && jobs.length > 0 ? (
                    <ul className="space-y-3">
                        {jobs.map((job) => (
                            <JobListItem key={job.id} initialJob={job} />
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center">
                        <FileWarning className="h-10 w-10 text-gray-400" />
                        <p className="mt-4 font-semibold">No documents found</p>
                        <p className="mt-1 text-sm text-gray-500">Upload your first document to get started.</p>
                    </div>
                )}
            </div>
        </>
    );
}
