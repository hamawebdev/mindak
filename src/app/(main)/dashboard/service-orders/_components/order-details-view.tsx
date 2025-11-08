"use client";

import Link from "next/link";

import { format } from "date-fns";
import {
  Calendar,
  DollarSign,
  Mail,
  User,
  FileText,
  Tag,
  MessageSquare,
  ArrowLeft,
  Edit,
  Trash2,
  Download,
  Briefcase,
  Clock,
  AlertCircle,
  Users,
  Package,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { ServiceOrder } from "./schema";

interface OrderDetailsViewProps {
  order: ServiceOrder;
}

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
  { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
> = {
  low: { variant: "outline", label: "Low" },
  medium: { variant: "secondary", label: "Medium" },
  high: { variant: "default", label: "High" },
  urgent: { variant: "destructive", label: "Urgent" },
};

export function OrderDetailsView({ order }: OrderDetailsViewProps) {
  const { variant: statusVariant, label: statusLabel } = statusVariants[order.status];
  const { variant: priorityVariant, label: priorityLabel } = priorityVariants[order.priority];

  return (
    <div className="@container/main space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/service-orders">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Service Order Details</h1>
            <p className="text-muted-foreground">View and manage order information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download />
            <span className="hidden lg:inline">Export</span>
          </Button>
          <Button variant="outline" size="sm">
            <Edit />
            <span className="hidden lg:inline">Edit</span>
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 />
            <span className="hidden lg:inline">Delete</span>
          </Button>
        </div>
      </div>

      {/* Order ID, Status, and Priority Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="size-6 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="text-2xl font-bold">{order.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={statusVariant} className="text-base px-4 py-2">
                {statusLabel}
              </Badge>
              <Badge variant={priorityVariant} className="text-base px-4 py-2">
                <AlertCircle className="mr-1 size-4" />
                {priorityLabel}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Customer & Service Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Contact details and customer data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <User className="mt-1 size-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Customer Name</p>
                    <p className="text-lg font-semibold">{order.customerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 size-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                    <p className="text-lg font-semibold">{order.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>Information about the requested service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Briefcase className="mt-1 size-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Service Type</p>
                  <p className="text-xl font-bold">{order.serviceType}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Tag className="mt-1 size-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Department</p>
                    <Badge variant="outline" className="mt-1">
                      {order.metadata.department}
                    </Badge>
                  </div>
                </div>
                {order.metadata.assignedTo && (
                  <div className="flex items-start gap-3">
                    <Users className="mt-1 size-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                      <p className="text-lg font-semibold">{order.metadata.assignedTo}</p>
                    </div>
                  </div>
                )}
              </div>

              {order.metadata.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {order.metadata.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Project Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Project Requirements</CardTitle>
              <CardDescription>Detailed specifications and requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Project Description</p>
                <p className="mt-1 text-base">{order.formData.projectDescription}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold text-muted-foreground">Requirements</p>
                <p className="mt-1 text-base">{order.formData.requirements}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold text-muted-foreground">Deliverables</p>
                <p className="mt-1 text-base">{order.formData.deliverables}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold text-muted-foreground">Timeline</p>
                <p className="mt-1 text-base">{order.formData.timeline}</p>
              </div>

              {order.formData.additionalNotes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Additional Notes</p>
                    <p className="mt-1 text-base">{order.formData.additionalNotes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-5" />
                  <CardTitle>Admin Notes</CardTitle>
                </div>
                <CardDescription>Internal notes and comments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Financial & Timeline */}
        <div className="space-y-6 lg:col-span-1">
          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
              <CardDescription>Budget and payment details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <DollarSign className="mt-1 size-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                  <p className="text-3xl font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(order.budget)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Important dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 size-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Created Date</p>
                  <p className="text-lg font-semibold">{format(new Date(order.createdDate), "MMMM dd, yyyy")}</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(order.createdDate), "h:mm a")}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Clock className="mt-1 size-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Estimated Completion</p>
                  <p className="text-lg font-semibold">
                    {format(new Date(order.estimatedCompletion), "MMMM dd, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Math.ceil(
                      (new Date(order.estimatedCompletion).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    )}{" "}
                    days remaining
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Calendar className="mt-1 size-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-lg font-semibold">
                    {format(new Date(order.metadata.lastUpdated), "MMMM dd, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.metadata.lastUpdated), "h:mm a")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-2 size-4" />
                Email Customer
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 size-4" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 size-4" />
                Reassign Order
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 size-4" />
                Update Timeline
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

