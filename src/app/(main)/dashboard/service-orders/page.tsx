import { OrdersTable } from "./_components/orders-table";
import ordersData from "./_components/data.json";

export default function ServiceOrdersPage() {
  return (
    <div className="@container/main">
      <OrdersTable data={ordersData} />
    </div>
  );
}

