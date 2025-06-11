// src/App.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Upload, FileText, Settings } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { FileProgressList } from "@/components/FileProgressList";

// Define the new, more detailed state structure for each file
export interface UploadableFile {
  id: string;
  file: File;
  progress: number;
}

function App() {
  // Add state to hold the array of files
  const [files, setFiles] = useState<UploadableFile[]>([]);

  // Function to remove a file from the state
  const onRemoveFile = (fileId: string) => {
    setFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
  };

  // Derived state to check if all uploads are complete
  const isUploadComplete = files.length > 0 && files.every(f => f.progress === 100);

  // This function simulates an upload over 2 seconds
  const simulateUpload = (file: UploadableFile) => {
    const interval = setInterval(() => {
      setFiles(prevFiles =>
        prevFiles.map(f => {
          if (f.id === file.id) {
            //Increment progress by a bit
            const newProgress = f.progress + 10;
            if (newProgress >= 100) {
              clearInterval(interval); // Stop the interval when progress reaches 100%
              return { ...f, progress: 100 };
            }
            return { ...f, progress: newProgress };
          }
          return f;
        })
      );
    }, 200);
  };

  // This function will be passed to the FileUpload component
  const handleFilesSelected = (selectedFiles: File[]) => {
    // Create new UploadableFile objects for each selected file
    const newUploads: UploadableFile[] = selectedFiles.map(file => ({
      id: `${file.name}-${Date.now()}`, // Unique ID based on file name and current timestamp
      file: file,
      progress: 0, // Initial progress is 0%
    }));

    // Append the new files to the existing array
    setFiles(prevFiles => [...prevFiles, ...newUploads]);

    //Start the simulation for each new file
    newUploads.forEach(simulateUpload);
  };


  return (
    // Main container using flexbox
    <div className="flex h-screen bg-gray-50 text-gray-800">

      {/* Sidebar */}
      <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="ml-2 text-xl font-bold">EvenUp</h1>
        </div>

        <nav className="flex-1 space-y-4 p-4">
          {/* We are using the Button component we built, but with different styles! */}
          <Button variant="secondary" className="w-full justify-start">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="mt-1 text-gray-500">Welcome back, Dhruvil!</p>
          </div>
          <div>
            {/* Using our main Button component again */}
            <Button size="lg">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </header>

        {/* File Upload Area */}
        <div className="mt-8">
          <FileUpload onFilesSelected={handleFilesSelected} />
        </div>

        {/* Conditionally render the file list only if there are files */}
        {files.length > 0 && (
          <FileProgressList
            files={files}
            onRemoveFile={onRemoveFile}
            isUploadComplete={isUploadComplete}
          />
        )}
      </main>
    </div>
  );
}

export default App