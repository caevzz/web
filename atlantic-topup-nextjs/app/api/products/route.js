import { NextResponse } from "next/server";
import { atlanticPost } from "@/lib/atlantic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || process.env.ATLANTIC_DEFAULT_TYPE || "prabayar";

    const raw = await atlanticPost("/layanan/price_list", { type });

    // Best-effort normalization: different APIs may use different keys.
    const list = raw?.data || raw?.result || raw?.items || raw;
    const arr = Array.isArray(list) ? list : [];

    const normalized = arr.map((x) => ({
      code: x.code ?? x.kode ?? x.id ?? x.product_code ?? "",
      name: x.name ?? x.nama ?? x.layanan ?? x.product_name ?? "",
      price: Number(x.price ?? x.harga ?? x.price_sell ?? x.sell_price ?? x.price_default ?? 0) || undefined,
      raw: x,
    })).filter(p => p.code);

    return NextResponse.json({ ok: true, data: normalized, raw });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || String(e) }, { status: 500 });
  }
}
