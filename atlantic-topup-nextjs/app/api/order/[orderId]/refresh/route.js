import { NextResponse } from "next/server";
import { atlanticPost } from "@/lib/atlantic";
import { getOrder, updateOrder } from "@/lib/store";

function isPaid(depositStatusRaw) {
  // Best-effort: normalize common patterns.
  const s =
    depositStatusRaw?.status ||
    depositStatusRaw?.data?.status ||
    depositStatusRaw?.data?.payment_status ||
    depositStatusRaw?.payment_status ||
    "";
  const msg = (depositStatusRaw?.message || depositStatusRaw?.data?.message || "").toString().toLowerCase();

  const val = String(s).toLowerCase();
  if (val.includes("paid") || val.includes("success") || val === "true" || val === "1") return true;
  if (msg.includes("paid") || msg.includes("berhasil") || msg.includes("sukses")) return true;
  return false;
}

export async function POST(_req, { params }) {
  try {
    const order = getOrder(params.orderId);
    if (!order) return NextResponse.json({ ok:false, error:"order_not_found" }, { status: 404 });

    const depositId = order.deposit?.id;
    if (!depositId) {
      return NextResponse.json({ ok:false, error:"deposit_id_missing_in_order (provide deposit response example to map id)" }, { status: 400 });
    }

    // 1) check deposit status
    const depStatusRaw = await atlanticPost("/deposit/status", { id: depositId });

    const paid = isPaid(depStatusRaw);

    let next = updateOrder(order.orderId, { deposit: { ...order.deposit, statusRaw: depStatusRaw } });

    if (!paid) {
      // still unpaid
      next = updateOrder(order.orderId, { status: "UNPAID" });
      return NextResponse.json({ ok:true, data: next, note: "not_paid_yet" });
    }

    // 2) paid -> if no trx yet, create trx
    if (!next.trx?.id) {
      next = updateOrder(order.orderId, { status: "PROCESSING" });

      const trxRaw = await atlanticPost("/transaksi/create", {
        code: next.product.code,
        reff_id: next.trx.reff_id,
        target: next.target,
      });

      const trxId =
        trxRaw?.id ||
        trxRaw?.data?.id ||
        trxRaw?.data?.trx_id ||
        trxRaw?.trx_id ||
        null;

      next = updateOrder(order.orderId, {
        status: "PAID",
        trx: { ...next.trx, id: trxId, raw: trxRaw },
      });
    }

    // 3) check trx status if we have trx id
    if (next.trx?.id) {
      const trxStatusRaw = await atlanticPost("/transaksi/status", {
        id: next.trx.id,
        type: next.product.type || "prabayar",
      });

      // best-effort success detection
      const st = String(trxStatusRaw?.status || trxStatusRaw?.data?.status || "").toLowerCase();
      const msg = String(trxStatusRaw?.message || trxStatusRaw?.data?.message || "").toLowerCase();

      let finalStatus = next.status;
      if (st.includes("success") || st.includes("sukses") || msg.includes("sukses") || msg.includes("berhasil")) finalStatus = "SUCCESS";
      if (st.includes("fail") || st.includes("gagal") || msg.includes("gagal")) finalStatus = "FAILED";

      next = updateOrder(order.orderId, { status: finalStatus, trx: { ...next.trx, statusRaw: trxStatusRaw } });
    }

    return NextResponse.json({ ok:true, data: next });
  } catch (e) {
    return NextResponse.json({ ok:false, error: e.message || String(e) }, { status: 500 });
  }
}
