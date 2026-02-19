import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                    <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background/80 backdrop-blur-sm px-4 py-3 md:px-6">
                        <SidebarTrigger className="md:hidden" />
                        <div className="h-5 w-px bg-border md:hidden" />
                    </div>
                    <div className="p-4 md:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
