import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import Accessibility from "@/components/accessibility";
import Header from "@/components/header";
import Post from "@/components/post";
import { useIsMobile } from "@/hooks/use-moble";


export default function Page() {

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <Sidebar/>

          {/* Main Feed */}
          <div className="col-span-6 space-y-4">
            {/* Create Post */}
            <Header/>

            {/* Posts Feed */}
            <Post/>
          </div>

          {/* Right Sidebar */}
          <Accessibility/>
        </div>
      </main>
    </div>
  );
};