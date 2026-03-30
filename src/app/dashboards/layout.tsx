import { Navbar, Sidebar } from "@/components/layouts";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Navbar/>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[var(--surface-subtle)]">
          {children}
        </main>
      </div>
    </div>
  );
}
