// src/App.tsx
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, Settings } from "lucide-react";
import { DashboardPage } from './pages/DashboardPage';
import { ResultPage } from './pages/ResultPage';
import { Toaster } from "@/components/ui/toaster";

function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="ml-2 text-xl font-bold">EvenUp</h1>
        </div>
        <nav className="flex-1 space-y-2 p-4">
          {/* Use `asChild` prop to merge Link functionality with Button styling */}
          <Button asChild variant="secondary" className="w-full justify-start">
            <Link to="/"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
          </Button>
          {/* We can disable buttons for pages that don't exist yet */}
          <Button variant="ghost" className="w-full justify-start" disabled>
            <Settings className="mr-2 h-4 w-4" />Settings
          </Button>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>

      <Toaster />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="jobs/:jobId" element={<ResultPage />} />
      </Route>
    </Routes>
  );
}

export default App;
