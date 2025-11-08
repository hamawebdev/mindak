"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { PodcastOrder } from "./schema";

const statusVariants: Record<PodcastOrder["status"], { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
  pending: { variant: "outline", label: "Pending" },
  processing: { variant: "secondary", label: "Processing" },
  completed: { variant: "default", label: "Completed" },
  cancelled: { variant: "destructive", label: "Cancelled" },
};

export const podcastOrderColumns: ColumnDef<PodcastOrder>[] = [
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
    accessorKey: "podcastTitle",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Podcast Title" />,
    cell: ({ row }) => <span>{row.original.podcastTitle}</span>,
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
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge>,
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
    accessorKey: "deliveryDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Delivery Date" />,
    cell: ({ row }) => {
      const date = new Date(row.original.deliveryDate);
      return <span className="tabular-nums">{format(date, "MMM dd, yyyy")}</span>;
    },
  },
];

