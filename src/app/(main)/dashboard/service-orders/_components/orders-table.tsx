"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Download, Plus, Search } from "lucide-react";

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

import { serviceOrderColumns } from "./columns";
import { ServiceOrder } from "./schema";

interface OrdersTableProps {
  data: ServiceOrder[];
}

export function OrdersTable({ data: initialData }: OrdersTableProps) {
  const router = useRouter();
  const [data, setData] = React.useState(() => initialData);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
  const [serviceTypeFilter, setServiceTypeFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const table = useDataTableInstance({
    data,
    columns: serviceOrderColumns,
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

    if (priorityFilter !== "all") {
      filters.push({
        id: "priority",
        value: [priorityFilter],
      });
    }

    if (serviceTypeFilter !== "all") {
      filters.push({
        id: "serviceType",
        value: [serviceTypeFilter],
      });
    }

    table.setColumnFilters(filters);
  }, [statusFilter, priorityFilter, serviceTypeFilter, table]);

  // Apply search
  React.useEffect(() => {
    if (searchQuery) {
      const filtered = initialData.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.metadata.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setData(filtered);
    } else {
      setData(initialData);
    }
  }, [searchQuery, initialData]);

  const handleRowClick = (order: ServiceOrder) => {
    router.push(`/dashboard/service-orders/${order.id}`);
  };

  // Get unique service types for filter
  const serviceTypes = React.useMemo(() => {
    const uniqueTypes = Array.from(new Set(initialData.map((order) => order.serviceType)));
    return uniqueTypes.sort();
  }, [initialData]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = data.length;
    const pending = data.filter((o) => o.status === "pending").length;
    const inProgress = data.filter((o) => o.status === "in-progress").length;
    const completed = data.filter((o) => o.status === "completed").length;
    const urgent = data.filter((o) => o.priority === "urgent").length;
    const totalRevenue = data.reduce((sum, o) => sum + o.budget, 0);

    return { total, pending, inProgress, completed, urgent, totalRevenue };
  }, [data]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
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
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl">{stats.inProgress}</CardTitle>
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
            <CardDescription>Urgent</CardDescription>
            <CardTitle className="text-3xl">{stats.urgent}</CardTitle>
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
              <CardTitle>Service Orders</CardTitle>
              <CardDescription>Manage and view all service orders</CardDescription>
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
          <div className="flex flex-col gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search" className="text-sm font-medium">
                Search
              </Label>
              <div className="relative">
                <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  id="search"
                  placeholder="Search by customer, email, order ID, service type, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
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
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40 space-y-2">
                <Label htmlFor="priority-filter" className="text-sm font-medium">
                  Priority
                </Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger id="priority-filter">
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48 space-y-2">
                <Label htmlFor="service-type-filter" className="text-sm font-medium">
                  Service Type
                </Label>
                <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                  <SelectTrigger id="service-type-filter">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
          {(statusFilter !== "all" ||
            priorityFilter !== "all" ||
            serviceTypeFilter !== "all" ||
            searchQuery) && (
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
              {priorityFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Priority: {priorityFilter}
                  <button
                    onClick={() => setPriorityFilter("all")}
                    className="ml-1 rounded-full hover:bg-muted"
                    aria-label="Remove priority filter"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {serviceTypeFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Type: {serviceTypeFilter}
                  <button
                    onClick={() => setServiceTypeFilter("all")}
                    className="ml-1 rounded-full hover:bg-muted"
                    aria-label="Remove service type filter"
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
                  setPriorityFilter("all");
                  setServiceTypeFilter("all");
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
              <DataTable table={table} columns={serviceOrderColumns} onReorder={setData} />
            </div>
          </div>

          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}

