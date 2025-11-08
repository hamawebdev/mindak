import { notFound } from "next/navigation";

import { OrderDetailsView } from "../_components/order-details-view";
import ordersData from "../_components/data.json";

interface OrderDetailsPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { orderId } = await params;
  const order = ordersData.find((o) => o.id === orderId);

  if (!order) {
    notFound();
  }

  return <OrderDetailsView order={order} />;
}

