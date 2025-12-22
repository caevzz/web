"use client";

import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState("");
  const [target, setTarget] = useState("");
  const [selectedCode, setSelectedCode] = useState("");
  const [type, setType] = useState("prabayar");
  const [note, setNote] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const r = await fetch(`/api/products?type=${encodeURIComponent(type)}`, { cache: "no-store" });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error || "Failed to load products");
        setProducts(j.data || []);
        setSelectedCode("");
      } catch (e) {
        setErr(String(e.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, [type]);

  const selected = useMemo(() => products.find(p => p.code === selectedCode) || null, [products, selectedCode]);

  async function onCheckout() {
    setCreating(true);
    setErr("");
    setNote("");
    try {
      if (!selectedCode) throw new Error("Pilih produk dulu");
      if (!target.trim()) throw new Error("Isi target dulu (UID/No HP)");
      const payload = {
        code: selectedCode,
        type,
        target: target.trim(),
        // For deposit nominal, this template uses product price if provided by API.
        // If your price_list response uses a different field name, adjust mapping in /api/products.
        nominal: selected?.price ?? selected?.harga ?? selected?.price_sell ?? selected?.price_default,
      };
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Checkout failed");
      window.location.href = `/checkout/${encodeURIComponent(j.orderId)}`;
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <div style={{fontSize:16, fontWeight:800, marginBottom: 10}}>Buat Pesanan</div>

          <label className="small">Tipe</label>
          <select value={type} onChange={(e)=>setType(e.target.value)}>
            <option value="prabayar">prabayar</option>
            <option value="pascabayar">pascabayar</option>
          </select>

          <div style={{height:10}} />

          <label className="small">Produk (code)</label>
          <select value={selectedCode} onChange={(e)=>setSelectedCode(e.target.value)} disabled={loading}>
            <option value="">{loading ? "Loading..." : "Pilih produk"}</option>
            {products.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name ? `${p.name} — ${p.code}` : p.code}{p.price ? ` (Rp${p.price})` : ""}
              </option>
            ))}
          </select>

          <div style={{height:10}} />

          <label className="small">Target (No HP / UID)</label>
          <input value={target} onChange={(e)=>setTarget(e.target.value)} placeholder="contoh: 0856xxxx / UID12345" />

          <div style={{height:12}} />

          <button onClick={onCheckout} disabled={creating || loading}>
            {creating ? "Membuat QRIS..." : "Lanjut Bayar (QRIS)"}
          </button>

          {err ? <div style={{marginTop:12, color:"#ff6b6b"}}>{err}</div> : null}
          {note ? <div style={{marginTop:12}}>{note}</div> : null}

          <div className="small" style={{marginTop:12}}>
            Catatan: Template ini menampilkan data produk dari endpoint price_list. Jika field harga berbeda, sesuaikan mapping di <span className="mono">/api/products</span>.
          </div>
        </div>
      </div>

      <div className="col">
        <div className="card">
          <div style={{fontSize:16, fontWeight:800, marginBottom: 10}}>Preview</div>
          <div className="small">Produk terpilih:</div>
          <pre className="mono">{JSON.stringify(selected, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
