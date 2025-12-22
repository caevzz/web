import "./globals.css";

export const metadata = {
  title: "Atlantic Topup",
  description: "Codashop-style topup with Atlantic QRIS deposit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <div className="container">
          <header className="row" style={{alignItems:"center", justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:18, fontWeight:800}}>Atlantic Topup</div>
              <div className="small">QRIS deposit → PAID → transaksi/create</div>
            </div>
            <a className="badge" href="/">Home</a>
          </header>
          <hr />
          {children}
          <hr />
          <footer className="small">
            Template aman: API key hanya di server. Simpan di <span className="mono">.env</span>.
          </footer>
        </div>
      </body>
    </html>
  );
}
