import { Sidebar } from '@/components/layout/sidebar';
import { BottomNav } from '@/components/layout/bottom-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-gray-50 dark:bg-black min-h-screen">
      <Sidebar />
      <main className="flex-1 w-full flex flex-col pt-4 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-8 max-w-[1600px] mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
