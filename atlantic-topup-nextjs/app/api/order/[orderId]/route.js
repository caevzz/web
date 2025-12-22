import { NextResponse } from "next/server";
import { getOrder } from "@/lib/store";

export async function GET(_req, { params }) {
  const order = getOrder(params.orderId);
  if (!order) return NextResponse.json({ ok:false, error:"order_not_found" }, { status: 404 });
  return NextResponse.json({ ok:true, data: order });
}
