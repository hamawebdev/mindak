"use client";

import Link from "next/link";

import { format } from "date-fns";
import {
  Calendar,
  DollarSign,
  Mail,
  Package,
  User,
  FileText,
  Clock,
  Tag,
  MessageSquare,
  ArrowLeft,
  Edit,
  Trash2,
  Download,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { PodcastOrder } from "./schema";

interface OrderDetailsViewProps {
  order: PodcastOrder;
}

const statusVariants: Record<
  PodcastOrder["status"],
  { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
> = {
  pending: { variant: "outline", label: "Pending" },
  processing: { variant: "secondary", label: "Processing" },
  completed: { variant: "default", label: "Completed" },
  cancelled: { variant: "destructive", label: "Cancelled" },
};

export function OrderDetailsView({ order }: OrderDetailsViewProps) {
  const { variant, label } = statusVariants[order.status];

  return (
    <div className="@container/main space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/podcast-orders">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
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

      {/* Order ID and Status Card */}
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
            <Badge variant={variant} className="text-base px-4 py-2">
              {label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Customer & Podcast Info */}
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

          {/* Podcast Details */}
          <Card>
            <CardHeader>
              <CardTitle>Podcast Details</CardTitle>
              <CardDescription>Information about the podcast production</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="mt-1 size-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Podcast Title</p>
                  <p className="text-xl font-bold">{order.podcastTitle}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-start gap-3">
                  <Tag className="mt-1 size-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <Badge variant="outline" className="mt-1">
                      {order.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="mt-1 size-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Episodes</p>
                    <p className="text-lg font-semibold">{order.episodeCount} episodes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 size-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                    <p className="text-lg font-semibold">{order.duration}</p>
                  </div>
                </div>
              </div>
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
                <p className="text-sm font-semibold text-muted-foreground">Target Audience</p>
                <p className="mt-1 text-base">{order.formData.targetAudience}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold text-muted-foreground">Tone</p>
                <p className="mt-1 text-base">{order.formData.tone}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold text-muted-foreground">Format</p>
                <p className="mt-1 text-base">{order.formData.format}</p>
              </div>

              {order.formData.additionalRequirements && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">Additional Requirements</p>
                    <p className="mt-1 text-base">{order.formData.additionalRequirements}</p>
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
                  <CardTitle>Notes</CardTitle>
                </div>
                <CardDescription>Additional information and comments</CardDescription>
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
                <Calendar className="mt-1 size-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Delivery Date</p>
                  <p className="text-lg font-semibold">{format(new Date(order.deliveryDate), "MMMM dd, yyyy")}</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.ceil(
                      (new Date(order.deliveryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    )}{" "}
                    days remaining
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Episodes</span>
                <span className="font-semibold">{order.episodeCount}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration per Episode</span>
                <span className="font-semibold">{order.duration}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Duration</span>
                <span className="font-semibold">
                  {order.episodeCount * parseInt(order.duration)} min
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cost per Episode</span>
                <span className="font-semibold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(order.budget / order.episodeCount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

