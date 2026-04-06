import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import StoreProvider from "@/app/StoreProvider";
import GetAllCategories from "@/lib/GetAllDetails/GetAllCategories";
import GetAllProducts from "@/lib/GetAllDetails/GetAllProducts";
import GetAllAttributes from "@/lib/GetAllDetails/GetAllAttributes";
import GetUser from "@/lib/GetAllDetails/GetUser";

const JWT_SECRET =
  process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  let user: any;

  let isAuthenticated = false;

  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      isAuthenticated = true;
      user = jwt.decode(token);
    } catch (e) {}
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <StoreProvider>
      <GetAllCategories />
      <GetAllProducts />
      <GetAllAttributes />
      <GetUser user={user} />
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full flex-1 flex flex-col bg-muted/20 relative min-h-screen font-sans antialiased text-foreground">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 bg-background px-4 transition-all sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink
                      href="/admin"
                      className="font-medium text-xs uppercase tracking-wider"
                    >
                      Dashboards
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-bold text-xs uppercase tracking-wider text-primary">
                      Overview
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </StoreProvider>
  );
}
