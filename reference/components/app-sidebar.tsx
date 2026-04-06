"use client";

import {
  LayoutDashboard,
  Package,
  Tags,
  Layers,
  ShoppingCart,
  LogOut,
  ListTree,
  ChevronUp,
  User2,
  Settings,
  Bell,
  Sparkles,
  FileText,
  Image,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AppDispatch } from "@/lib/store/store";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { logout } from "@/lib/store/auth/authSlice";
import { logoutThunk } from "@/lib/store/auth/authThunks";
import Link from "next/link";

const NAV_ITEMS = [
  {
    group: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        exact: true,
        badge: null,
      },
      {
        label: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
        exact: false,
        badge: "3",
      },
    ],
  },
  {
    group: "Store Management",
    items: [
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
        exact: false,
        badge: null,
      },
      {
        label: "Categories",
        href: "/admin/categories",
        icon: Layers,
        exact: false,
        badge: null,
      },
      {
        label: "Attributes",
        href: "/admin/attributes",
        icon: Tags,
        exact: false,
        badge: null,
      },
    ],
  },
  {
    group: "Pages and Media",
    items: [
      {
        label: "Pages",
        href: "/admin/pages",
        icon: FileText,
        exact: false,
        badge: null,
      },
      {
        label: "Media",
        href: "/admin/media",
        icon: Image,
        exact: false,
        badge: null,
      },
    ],
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = async () => {
    const user = await dispatch(logoutThunk());
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <Sidebar variant="inset">
      {/* Header */}
      <SidebarHeader className="h-20 flex px-4 items-center justify-center bg-transparent border-b border-border/50">
        <div className="flex items-center gap-3 w-full">
          <div className="flex h-10 w-10 items-center border border-[#ddd] p-1 justify-center rounded-xl bg-[#fff] text-white">
            {/* <Sparkles size={20} /> */}
            <img
              src="/assets/Image/favicon.svg"
              alt="Logo"
              className="w-10 h-10"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black uppercase text-foreground tracking-tight leading-none">
              Nestcraft
            </span>
            <span className="text-[10px] font-bold text-[#0d6533] tracking-[0.2em]">
              LIVING ADMIN
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="font-sans pt-4 gap-2">
        {NAV_ITEMS.map((group) => (
          <SidebarGroup key={group.group} className="px-3 py-1">
            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 mb-1">
              {group.group}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map(
                  ({ label, href, icon: Icon, exact, badge }) => {
                    const active = isActive(href, exact);
                    return (
                      <SidebarMenuItem key={href}>
                        <Link
                          href={href}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 h-10 w-full text-sm font-semibold transition-all duration-150",
                            active
                              ? "bg-[#0d6533] text-white shadow-md shadow-[#0d6533]/25"
                              : "text-muted-foreground hover:bg-[#0d6533]/10 hover:text-[#0d6533]",
                          )}
                        >
                          <Icon
                            size={18}
                            className={cn(
                              "shrink-0 transition-colors",
                              active
                                ? "text-white"
                                : "text-muted-foreground group-hover:text-[#0d6533]",
                            )}
                          />
                          <span>{label}</span>
                          {badge && (
                            <span
                              className={cn(
                                "ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                                active
                                  ? "bg-white/20 text-white"
                                  : "bg-[#98c45f] text-[#063A1D]",
                              )}
                            >
                              {badge}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuItem>
                    );
                  },
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 mt-auto border-t border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full rounded-xl px-3 h-14 bg-card border border-border/60 shadow-sm hover:bg-[#0d6533]/5 hover:border-[#0d6533]/30 transition-all group text-left">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0d6533]/10 text-[#0d6533] shrink-0">
                    <User2 size={18} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-extrabold text-sm text-foreground leading-none mb-0.5">
                      Admin User
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate">
                      admin@nestcraft.com
                    </span>
                  </div>
                  <ChevronUp
                    size={16}
                    className="text-muted-foreground shrink-0"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                sideOffset={8}
                className="w-56 font-sans border border-border/60 shadow-xl rounded-2xl p-1.5"
              >
                <DropdownMenuLabel className="px-3 py-2.5 bg-[#0d6533]/5 rounded-xl mb-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0d6533]/10 text-[#0d6533]">
                      <User2 size={18} />
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-foreground">
                        Admin User
                      </p>
                      <p className="text-[10px] text-[#0d6533] font-bold uppercase tracking-widest">
                        Superadmin
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50 my-1" />
                <DropdownMenuItem
                  onClick={() => router.push("/admin/account-settings")}
                  className="cursor-pointer gap-2 py-2 rounded-lg text-muted-foreground hover:text-[#0d6533] focus:text-[#0d6533] focus:bg-[#0d6533]/8"
                >
                  <Settings size={15} />
                  <span className="font-medium">Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2 py-2 rounded-lg text-muted-foreground hover:text-[#0d6533] focus:text-[#0d6533] focus:bg-[#0d6533]/8">
                  <Bell size={15} />
                  <span className="font-medium">Notifications</span>
                  <span className="ml-auto bg-[#98c45f] text-[#063A1D] text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    2
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50 my-1" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer gap-2 py-2 rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut size={15} />
                  <span className="font-bold">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
