// src/components/JobListItemSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function JobListItemSkeleton() {
    return (
        <div className="relative rounded-lg border bg-white p-4">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton className="mt-2 h-2 w-full" />
        </div>
    );
}
