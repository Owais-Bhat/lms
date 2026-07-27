import { Download, RotateCcw } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { Button } from "@/components/ui/Button";
import { orderHistory } from "@/lib/data";

const statusColor: Record<string, string> = {
  Delivered: "text-cocoa",
  "Out for Delivery": "text-cocoa",
  Baking: "text-cocoa",
  Confirmed: "text-cocoa",
  Cancelled: "text-red-700",
};

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-4">
      {orderHistory.map((order) => (
        <div key={order.id} className="neu-raised rounded-3xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div>
              <div className="font-bold text-ink">{order.id}</div>
              <div className="text-xs text-ink-soft">{order.date}</div>
            </div>
            <span className={`neu-inset rounded-full px-3 py-1 text-xs font-semibold ${statusColor[order.status]}`}>
              {order.status}
            </span>
          </div>

          <div className="flex gap-3 mb-4">
            {order.items.map((item, i) => (
              <div key={i} className="neu-inset rounded-xl w-14 h-14 p-1 shrink-0">
                <ProductImage
                  image={item.image}
                  illustration={item.illustration as never}
                  alt={item.name}
                  className="w-full h-full rounded-lg"
                  sizes="56px"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="font-bold text-ink">${order.total.toFixed(2)}</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Download size={14} /> Invoice
              </Button>
              <Button size="sm">
                <RotateCcw size={14} /> Reorder
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
