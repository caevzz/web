"use client";

import { useEffect, useState } from "react";

export default function CheckoutPage({ params }) {
  const orderId = params.orderId;
  const [order, setOrder] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const r = await fetch(`/api/order/${encodeURIComponent(orderId)}`, { cache: "no-store" });
    const j = await r.json();
    if (!r.ok) throw new Error(j?.error || "Failed to load order");
    setOrder(j.data);
  }

  useEffect(() => {
    load().catch(e => setErr(String(e.message || e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshAndMaybeFulfill() {
    setBusy(true);
    setErr("");
    try {
      const r = await fetch(`/api/order/${encodeURIComponent(orderId)}/refresh`, { method: "POST" });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Refresh failed");
      setOrder(j.data);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setBusy(false);
    }
  }

  const depositRaw = order?.deposit?.raw || null;

  // Try to pick common QR fields if present
  const qrValue =
    depositRaw?.qris_string ||
    depositRaw?.qr_string ||
    depositRaw?.qr ||
    depositRaw?.data?.qris_string ||
    depositRaw?.data?.qr_string ||
    depositRaw?.data?.qr ||
    null;

  const qrUrl =
    depositRaw?.qris_url ||
    depositRaw?.qr_url ||
    depositRaw?.checkout_url ||
    depositRaw?.data?.qris_url ||
    depositRaw?.data?.qr_url ||
    depositRaw?.data?.checkout_url ||
    null;

  return (
    <div className="card">
      <div style={{fontSize:16, fontWeight:800}}>Checkout</div>
      <div className="small">Order ID: <span className="mono">{orderId}</span></div>

      <hr />

      {err ? <div style={{color:"#ff6b6b"}}>{err}</div> : null}

      {!order ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="row">
            <div className="col">
              <div className="badge">STATUS: {order.status}</div>
              <div style={{height:10}} />
              <div className="small">Produk:</div>
              <pre className="mono">{JSON.stringify(order.product, null, 2)}</pre>
              <div className="small">Target:</div>
              <div className="mono">{order.target}</div>
            </div>

            <div className="col">
              <div className="small">Deposit info (raw):</div>
              <pre className="mono">{JSON.stringify(depositRaw, null, 2)}</pre>
            </div>
          </div>

          <hr />

          <div className="small">Jika response deposit punya QR string/url, template akan mencoba menampilkannya:</div>
          {qrUrl ? (
            <div style={{marginTop:10}}>
              <a className="badge" href={qrUrl} target="_blank" rel="noreferrer">Buka link QRIS</a>
            </div>
          ) : null}
          {qrValue ? (
            <div style={{marginTop:10}}>
              <div className="small">QR value:</div>
              <pre className="mono">{String(qrValue)}</pre>
            </div>
          ) : (
            <div className="small" style={{marginTop:10, opacity:.85}}>
              (Belum ketemu field QR di response. Kalau kamu kasih contoh response deposit, aku bisa mapping fieldnya biar tampil rapi.)
            </div>
          )}

          <div style={{height:12}} />
          <button onClick={refreshAndMaybeFulfill} disabled={busy}>
            {busy ? "Mengecek status..." : "Saya sudah bayar → cek status & proses topup"}
          </button>

          <div className="small" style={{marginTop:12}}>
            Tombol ini akan:
            <ul>
              <li>cek <span className="mono">/deposit/status</span></li>
              <li>kalau sudah PAID → panggil <span className="mono">/transaksi/create</span></li>
            </ul>
          </div>

          {order.trx?.raw ? (
            <>
              <hr />
              <div className="small">Transaksi info (raw):</div>
              <pre className="mono">{JSON.stringify(order.trx.raw, null, 2)}</pre>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
