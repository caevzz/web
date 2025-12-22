import { NextResponse } from "next/server";
import { atlanticPost } from "@/lib/atlantic";
import { putOrder } from "@/lib/store";

function makeId(prefix = "ORD") {
  const rnd = Math.random().toString(16).slice(2, 10);
  return `${prefix}-${Date.now()}-${rnd}`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const code = String(body.code || "").trim();
    const type = String(body.type || process.env.ATLANTIC_DEFAULT_TYPE || "prabayar").trim();
    const target = String(body.target || "").trim();
    const nominal = Number(body.nominal || 0);

    if (!code) return NextResponse.json({ ok:false, error:"code_required" }, { status: 400 });
    if (!target) return NextResponse.json({ ok:false, error:"target_required" }, { status: 400 });
    if (!Number.isFinite(nominal) || nominal <= 0) {
      return NextResponse.json({ ok:false, error:"nominal_required (need product price)" }, { status: 400 });
    }

    const orderId = makeId("ORD");
    const depReff = makeId("DEP");
    const trxReff = makeId("TRX");

    // Create QRIS deposit
    const depositRaw = await atlanticPost("/deposit/create", {
      reff_id: depReff,
      nominal: String(nominal),
      type: "ewallet",
      metode: "qris",
    });

    // Try to pick deposit id field from response:
    const depositId =
      depositRaw?.id ||
      depositRaw?.data?.id ||
      depositRaw?.data?.deposit_id ||
      depositRaw?.deposit_id ||
      depositRaw?.data?.trx_id ||
      null;

    const order = putOrder({
      orderId,
      createdAt: new Date().toISOString(),
      status: "UNPAID",
      product: { code, type, nominal },
      target,
      deposit: { reff_id: depReff, id: depositId, raw: depositRaw },
      trx: { reff_id: trxReff, id: null, raw: null },
    });

    return NextResponse.json({ ok:true, orderId: order.orderId, data: order });
  } catch (e) {
    return NextResponse.json({ ok:false, error: e.message || String(e) }, { status: 500 });
  }
}
