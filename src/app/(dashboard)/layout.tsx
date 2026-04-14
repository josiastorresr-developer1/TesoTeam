import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const userName = user.user_metadata?.name ?? user.email ?? "Admin";
  const userEmail = user.email ?? "";

  return (
    <SidebarProvider>
      <AppSidebar userName={userName} userEmail={userEmail} />
      <SidebarInset>
        <main className="flex flex-1 flex-col gap-4 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
