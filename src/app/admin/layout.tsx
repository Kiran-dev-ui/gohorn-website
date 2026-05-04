import { createAdminServerClient } from "@/lib/supabase-server";
import AdminSidebar from "./AdminSidebar";

export const metadata = {
  title: "GoHorn Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createAdminServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Not authenticated — render children without the shell (login page)
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen" style={{ background: "#F0EFEA" }}>
      <AdminSidebar />
      {/* Desktop: push content right of sidebar. Mobile: push content below top bar. */}
      <div className="lg:pl-[240px] pt-[60px] lg:pt-0">
        {children}
      </div>
    </div>
  );
}
