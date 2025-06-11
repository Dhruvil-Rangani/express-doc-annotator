// src/App.tsx
import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Upload, FileText, Settings } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { UploadItem } from "@/components/UploadItem";
import type { Job } from './lib/api';

// A type for the files we are managing in the frontend's state
interface Uploadable {
    id: string; // A unique ID for the UI
    file: File;
}

function App() {
  const [uploads, setUploads] = useState<Uploadable[]>([]);
  // A map to store the server status of each upload
  const [uploadStatuses, setUploadStatuses] = useState<Map<string, Job['status']>>(new Map());

  // Callback for the UploadItem to report its status
  const handleStatusChange = (uploadId: string, status: Job['status']) => {
    setUploadStatuses(prev => new Map(prev).set(uploadId, status));
  };

  // Callback to remove a file from the list
  const handleRemoveUpload = (uploadId: string) => {
    setUploads(prev => prev.filter(u => u.id !== uploadId));
    setUploadStatuses(prev => {
        const newMap = new Map(prev);
        newMap.delete(uploadId);
        return newMap;
    });
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    const newUploads: Uploadable[] = selectedFiles.map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
    }));
    setUploads(prev => [...prev, ...newUploads]);
  };

  // Derived state to check if all *tracked* uploads are complete
  const isUploadComplete = useMemo(() => {
    if (uploads.length === 0 || uploadStatuses.size !== uploads.length) return false;
    return Array.from(uploadStatuses.values()).every(status => status === 'SUCCESS' || status === 'FAILED');
  }, [uploads.length, uploadStatuses]);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar ... (no changes) */}
      <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-center border-b border-gray-200"><FileText className="h-6 w-6 text-blue-600" /><h1 className="ml-2 text-xl font-bold">EvenUp</h1></div>
        <nav className="flex-1 space-y-2 p-4"><Button variant="secondary" className="w-full justify-start"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Button><Button variant="ghost" className="w-full justify-start"><Upload className="mr-2 h-4 w-4" />Upload</Button><Button variant="ghost" className="w-full justify-start"><Settings className="mr-2 h-4 w-4" />Settings</Button></nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div><h2 className="text-3xl font-bold">Dashboard</h2><p className="mt-1 text-gray-500">Welcome back, Dhruvil!</p></div>
          <div><Button size="lg"><Upload className="mr-2 h-4 w-4" />Upload Document</Button></div>
        </header>
        
        <div className="mt-8">
          <FileUpload onFilesSelected={handleFilesSelected} />
        </div>

        {uploads.length > 0 && (
          <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold">
                  {isUploadComplete ? 'Uploads Complete' : 'Uploading...'}
              </h3>
              <ul className="space-y-3">
                  {uploads.map((upload) => (
                      <UploadItem 
                        key={upload.id} 
                        id={upload.id}
                        file={upload.file} 
                        onRemove={handleRemoveUpload}
                        onStatusChange={handleStatusChange}
                      />
                  ))}
              </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;