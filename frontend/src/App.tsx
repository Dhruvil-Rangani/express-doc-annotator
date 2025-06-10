// src/App.tsx

import { Button } from "@/components/ui/button";
import { LayoutDashboard, Upload, FileText, Settings } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";

function App() {
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
      <main className="flex-1 p-8">
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
          <FileUpload />
        </div>

      </main>
    </div>
  )
}

export default App