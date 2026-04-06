"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Tags,
  Layers,
  ShoppingCart,
  TrendingUp,
  Activity,
  ArrowUpRight,
  BarChart3,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    attributes: 0,
  });
  const { nestCraftUser, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  console.log(nestCraftUser);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, catRes, attrRes, ordRes] = await Promise.all([
          fetch("/api/ecommerce/products"),
          fetch("/api/ecommerce/categories"),
          fetch("/api/ecommerce/attributes"),
          fetch("/api/ecommerce/orders"),
        ]);

        const products = await prodRes.json();
        const categories = await catRes.json();
        const attributes = await attrRes.json();
        const orders = await ordRes.json();

        setStats({
          products: products.length || 0,
          categories: categories.length || 0,
          attributes: attributes.length || 0,
          orders: orders.length || 0,
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };

    if (nestCraftUser) {
      fetchStats();
    }
  }, [nestCraftUser]);

  const revenueData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 5500 },
    { month: "Mar", revenue: 3200 },
    { month: "Apr", revenue: 6800 },
    { month: "May", revenue: 4800 },
    { month: "Jun", revenue: 8400 },
    { month: "Jul", revenue: 9500 },
  ];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--primary))",
    },
  };

  // Loading screen
  if (isLoading || !nestCraftUser) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-semibold text-foreground">
              Loading Dashboard
            </p>
            <p className="text-sm text-muted-foreground">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 font-sans pb-10">
      {/* Header Banner */}
      {/* <div className="relative overflow-hidden rounded-3xl  p-8 border border-border/50 shadow-sm">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
          <BarChart3 className="w-64 h-64 text-primary" />
        </div>
        <div className="relative z-10 flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 w-max px-4 py-1.5 rounded-full mb-1 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            System Online
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground text-base max-w-xl">
            Monitor your NestCraftLiving furniture store activity, analyze performance metrics, and manage your inventory from one central hub.
          </p>
        </div>
      </div> */}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Products Card */}
        <Card className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <Package className="w-32 h-32 text-cyan-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Total Products
            </CardTitle>
            <div className="p-3 bg-cyan-500/10 rounded-xl rounded-tr-3xl group-hover:bg-cyan-500/20 transition-colors">
              <Package className="h-5 w-5 text-cyan-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-foreground mb-1">
              {stats.products}
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="h-3 w-3" /> 2.1%
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                from last week
              </span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-400 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
        </Card>

        {/* Total Categories Card */}
        <Card className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <Layers className="w-32 h-32 text-purple-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Total Categories
            </CardTitle>
            <div className="p-3 bg-purple-500/10 rounded-xl rounded-tr-3xl group-hover:bg-purple-500/20 transition-colors">
              <Layers className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-foreground mb-1">
              {stats.categories}
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full">
                <Activity className="h-3 w-3" /> Active
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Store hierarchy
              </span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-400 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
        </Card>

        {/* Total Orders Card */}
        <Card className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <ShoppingCart className="w-32 h-32 text-emerald-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Total Orders
            </CardTitle>
            <div className="p-3 bg-emerald-500/10 rounded-xl rounded-tr-3xl group-hover:bg-emerald-500/20 transition-colors">
              <ShoppingCart className="h-5 w-5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-foreground mb-1">
              {stats.orders}
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" /> 12%
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                sales growth
              </span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
        </Card>

        {/* Attribute Sets Card */}
        <Card className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <Tags className="w-32 h-32 text-amber-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Attribute Sets
            </CardTitle>
            <div className="p-3 bg-amber-500/10 rounded-xl rounded-tr-3xl group-hover:bg-amber-500/20 transition-colors">
              <Tags className="h-5 w-5 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-foreground mb-1">
              {stats.attributes}
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                <Tags className="h-3 w-3" /> Set
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Variations configured
              </span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
        </Card>
      </div>

      {/* Revenue Chart Section */}
      <div className="grid gap-6 md:grid-cols-7 mt-6">
        <Card className="md:col-span-5 rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly revenue for the current year
            </p>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--muted-foreground))"
                  opacity={0.2}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-sm hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest events on your store
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    New Order #1024 - Elegant Velvet Sofa
                  </p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Product 'Oak Wood Dining Table' updated
                  </p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    New Category 'Outdoor Loungers' created
                  </p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Low Stock: Premium Rattan Armchair
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
