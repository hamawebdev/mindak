"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { ServiceOrder } from "./schema";

const statusVariants: Record<
  ServiceOrder["status"],
  { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
> = {
  pending: { variant: "outline", label: "Pending" },
  "in-progress": { variant: "secondary", label: "In Progress" },
  completed: { variant: "default", label: "Completed" },
  cancelled: { variant: "destructive", label: "Cancelled" },
};

const priorityVariants: Record<
  ServiceOrder["priority"],
  { variant: "default" | "secondary" | "destructive" | "outline"; label: string; color: string }
> = {
  low: { variant: "outline", label: "Low", color: "text-blue-600" },
  medium: { variant: "secondary", label: "Medium", color: "text-yellow-600" },
  high: { variant: "default", label: "High", color: "text-orange-600" },
  urgent: { variant: "destructive", label: "Urgent", color: "text-red-600" },
};

export const serviceOrderColumns: ColumnDef<ServiceOrder>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order ID" />,
    cell: ({ row }) => <span className="font-medium tabular-nums">{row.original.id}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer Name" />,
    cell: ({ row }) => <span className="font-medium">{row.original.customerName}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
  },
  {
    accessorKey: "serviceType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Service Type" />,
    cell: ({ row }) => <span className="font-medium">{row.original.serviceType}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status;
      const { variant, label } = statusVariants[status];
      return <Badge variant={variant}>{label}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => {
      const priority = row.original.priority;
      const { variant, label } = priorityVariants[priority];
      return <Badge variant={variant}>{label}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "budget",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Budget" />,
    cell: ({ row }) => {
      const amount = row.original.budget;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <span className="tabular-nums">{formatted}</span>;
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created Date" />,
    cell: ({ row }) => {
      const date = new Date(row.original.createdDate);
      return <span className="text-muted-foreground tabular-nums">{format(date, "MMM dd, yyyy")}</span>;
    },
  },
  {
    accessorKey: "estimatedCompletion",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Est. Completion" />,
    cell: ({ row }) => {
      const date = new Date(row.original.estimatedCompletion);
      return <span className="tabular-nums">{format(date, "MMM dd, yyyy")}</span>;
    },
  },
  {
    accessorKey: "metadata.department",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
    cell: ({ row }) => <Badge variant="outline">{row.original.metadata.department}</Badge>,
  },
];

