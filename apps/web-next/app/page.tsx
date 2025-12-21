import Image from "next/image";

const SPOTIFY = "https://open.spotify.com/embed/playlist/5oVzQUYicfqlOzCUVh240Z?utm_source=generator";
const CBOX = "https://www3.cbox.ws/box/?boxid=3550944&boxtag=FnAAxT";

export default function Page() {
  return (
    <>
      <div className="bg" />
      <main className="wrap">
        <section className="hero">
          <div className="hero-bg">
            <Image className="hero-cover" src="/images/cover.jpg" alt="cover" fill priority />
            <div className="hero-overlay" />
          </div>

          <div className="card profile">
            <div className="avatar-wrap">
              <Image className="avatar" src="/images/avatar.jpg" alt="avatar" width={84} height={84} priority />
            </div>

            <div className="profile-main">
              <div className="name-row">
                <h1 className="name">ZyrooNour</h1>
                <span className="badge-verify" title="Verified">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2l2.5 2.2 3.2-.2 1 3 2.8 1.7-1.1 3.1.8 3.1-2.8 1.7-1 3-3.2-.2L12 22l-2.5-2.2-3.2.2-1-3L2.5 15l.8-3.1L2.2 8.8 5 7.1l1-3 3.2.2L12 2z" fill="currentColor" />
                  </svg>
                </span>
              </div>

              <p className="bio">Just a personal hub.</p>

              <div className="tags">
                <span className="tag"><span className="tag-ico">💻</span> Dev</span>
                <span className="tag"><span className="tag-ico">🎵</span> Music</span>
                <span className="tag"><span className="tag-ico">💬</span> Community</span>
              </div>

              <div className="social">
                <a className="icon" href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub"></a>
                <a className="icon" href="https://youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube">▶</a>
                <a className="icon" href="https://t.me/" target="_blank" rel="noreferrer" aria-label="Telegram">✈</a>
                <a className="icon" href="https://wa.me/" target="_blank" rel="noreferrer" aria-label="WhatsApp">🟢</a>
              </div>
            </div>
          </div>

          <ThemeToggle />
        </section>

        <section className="card section">
          <div className="section-title">Spotify Playlist</div>
          <div className="embed">
            <iframe style={{ borderRadius: 12 }} src={SPOTIFY} width="100%" height="152" frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
          </div>
        </section>

        <div className="section-label">Navigation</div>
        <section className="list">
          <a className="list-item" href="/contact">
            <div className="li-ico i-blue">✉</div>
            <div className="li-text">
              <div className="li-title">Contact</div>
              <div className="li-sub">Contact Help Center</div>
            </div>
            <div className="li-arrow">›</div>
          </a>

          <a className="list-item" href="/produk">
            <div className="li-ico i-purple">▣</div>
            <div className="li-text">
              <div className="li-title">Produk</div>
              <div className="li-sub">View available products</div>
            </div>
            <div className="li-arrow">›</div>
          </a>

          <a className="list-item" href="/gudang">
            <div className="li-ico i-green">⟐</div>
            <div className="li-text">
              <div className="li-title">Gudang Script</div>
              <div className="li-sub">Free script warehouse</div>
            </div>
            <div className="li-arrow">›</div>
          </a>

          <a className="list-item" href="/donasi">
            <div className="li-ico i-gold">❤</div>
            <div className="li-text">
              <div className="li-title">Donasi</div>
              <div className="li-sub">Support our project voluntarily</div>
            </div>
            <div className="li-arrow">›</div>
          </a>
        </section>

        <div className="section-label">Community</div>
        <section className="list">
          <a className="list-item" href="/group">
            <div className="li-ico i-green2">💬</div>
            <div className="li-text">
              <div className="li-title">Grup Chat</div>
              <div className="li-sub">Gabung ke grup support & sharing</div>
            </div>
            <div className="li-arrow">›</div>
          </a>

          <a className="list-item" href="/channel">
            <div className="li-ico i-blue2">📣</div>
            <div className="li-text">
              <div className="li-title">Channel Info</div>
              <div className="li-sub">Dapatkan notifikasi update penting</div>
            </div>
            <div className="li-arrow">›</div>
          </a>
        </section>

        <section className="card section">
          <div className="section-title">Cbox</div>
          <div className="embed embed-tall">
            <iframe src={CBOX} width="100%" height="420" frameBorder="0" scrolling="no" loading="lazy" />
          </div>
        </section>

        <footer className="footer">© {new Date().getFullYear()} ZyrooNour. All rights reserved.</footer>
      </main>
    </>
  );
}

function ThemeToggle() {
  return (
    <button
      className="theme-toggle"
      aria-label="Toggle theme"
      onClick={() => {
        const root = document.documentElement;
        const key = "zyroonour_theme";
        const isLight = root.classList.toggle("light");
        localStorage.setItem(key, isLight ? "light" : "dark");
      }}
    >
      ☀
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function(){
            try{
              var key="zyroonour_theme";
              var t=localStorage.getItem(key)||"dark";
              if(t==="light") document.documentElement.classList.add("light");
            }catch(e){}
          })();
        `,
        }}
      />
    </button>
  );
}
