"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Download, Filter, Plus, Search } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { podcastOrderColumns } from "./columns";
import { PodcastOrder } from "./schema";

interface OrdersTableProps {
  data: PodcastOrder[];
}

export function OrdersTable({ data: initialData }: OrdersTableProps) {
  const router = useRouter();
  const [data, setData] = React.useState(() => initialData);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const table = useDataTableInstance({
    data,
    columns: podcastOrderColumns,
    getRowId: (row) => row.id,
  });

  // Apply filters
  React.useEffect(() => {
    const filters = [];

    if (statusFilter !== "all") {
      filters.push({
        id: "status",
        value: [statusFilter],
      });
    }

    if (categoryFilter !== "all") {
      filters.push({
        id: "category",
        value: [categoryFilter],
      });
    }

    table.setColumnFilters(filters);
  }, [statusFilter, categoryFilter, table]);

  // Apply search
  React.useEffect(() => {
    if (searchQuery) {
      const filtered = initialData.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.podcastTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setData(filtered);
    } else {
      setData(initialData);
    }
  }, [searchQuery, initialData]);

  const handleRowClick = (order: PodcastOrder) => {
    router.push(`/dashboard/podcast-orders/${order.id}`);
  };

  // Get unique categories for filter
  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(new Set(initialData.map((order) => order.category)));
    return uniqueCategories.sort();
  }, [initialData]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = data.length;
    const pending = data.filter((o) => o.status === "pending").length;
    const processing = data.filter((o) => o.status === "processing").length;
    const completed = data.filter((o) => o.status === "completed").length;
    const totalRevenue = data.reduce((sum, o) => sum + o.budget, 0);

    return { total, pending, processing, completed, totalRevenue };
  }, [data]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Processing</CardDescription>
            <CardTitle className="text-3xl">{stats.processing}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-3xl">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(stats.totalRevenue)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Podcast Orders</CardTitle>
              <CardDescription>Manage and view all podcast production orders</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download />
                <span className="hidden lg:inline">Export</span>
              </Button>
              <Button size="sm">
                <Plus />
                <span className="hidden lg:inline">New Order</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters and Search */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search" className="text-sm font-medium">
                Search
              </Label>
              <div className="relative">
                <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  id="search"
                  placeholder="Search by customer, email, order ID, or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-40 space-y-2">
                <Label htmlFor="status-filter" className="text-sm font-medium">
                  Status
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40 space-y-2">
                <Label htmlFor="category-filter" className="text-sm font-medium">
                  Category
                </Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <DataTableViewOptions table={table} />
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(statusFilter !== "all" || categoryFilter !== "all" || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {statusFilter}
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="ml-1 rounded-full hover:bg-muted"
                    aria-label="Remove status filter"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {categoryFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Category: {categoryFilter}
                  <button
                    onClick={() => setCategoryFilter("all")}
                    className="ml-1 rounded-full hover:bg-muted"
                    aria-label="Remove category filter"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 rounded-full hover:bg-muted"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter("all");
                  setCategoryFilter("all");
                  setSearchQuery("");
                }}
                className="h-7 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Table */}
          <div className="overflow-hidden rounded-lg border">
            <div
              className="[&_tbody_tr]:cursor-pointer [&_tbody_tr]:hover:bg-muted/50"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                const row = target.closest("tr");
                if (row && row.parentElement?.tagName === "TBODY") {
                  const rowId = row.getAttribute("data-row-id");
                  if (rowId) {
                    const order = data.find((o) => o.id === rowId);
                    if (order) {
                      handleRowClick(order);
                    }
                  }
                }
              }}
            >
              <DataTable
                table={table}
                columns={podcastOrderColumns}
                onReorder={setData}
              />
            </div>
          </div>

          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}

