export interface DefaultModule {
  id: string;
  name: string;
  category: string;
  html: string;
  css: string;
}

export const defaultModules: DefaultModule[] = [
  // ─── NAVBAR ───────────────────────────────────────────
  {
    id: "navbar-simple",
    name: "\u5c0e\u822a\u5217 \u7c21\u7d04",
    category: "navbar",
    html: `<nav class="sf-nav-simple" data-module="navbar-simple">
  <div class="sf-nav-simple-inner">
    <a href="#" data-editable="brand" class="sf-nav-simple-brand">\u4f60\u7684\u54c1\u724c</a>
    <div class="sf-nav-simple-links">
      <a href="#" data-editable="link1">\u9996\u9801</a>
      <a href="#" data-editable="link2">\u670d\u52d9</a>
      <a href="#" data-editable="link3">\u4f5c\u54c1</a>
      <a href="#" data-editable="link4">\u806f\u7e6b</a>
    </div>
    <button class="sf-nav-hamburger" onclick="this.closest('nav').classList.toggle('sf-nav-open')" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
    <div class="sf-nav-mobile-menu">
      <a href="#">\u9996\u9801</a>
      <a href="#">\u670d\u52d9</a>
      <a href="#">\u4f5c\u54c1</a>
      <a href="#">\u806f\u7e6b</a>
    </div>
  </div>
</nav>`,
    css: `.sf-nav-simple{padding:0 24px;background:#fff;border-bottom:1px solid rgba(0,0,0,.06);position:sticky;top:0;z-index:100}.sf-nav-simple-inner{max-width:1120px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px;flex-wrap:wrap}.sf-nav-simple-brand{font-family:'Noto Serif TC',serif;font-size:18px;font-weight:700;color:#0A0E1A;text-decoration:none}.sf-nav-simple-links{display:flex;gap:32px}.sf-nav-simple-links a{font-size:14px;color:#4A5568;text-decoration:none;font-weight:500;transition:color .2s}.sf-nav-simple-links a:hover{color:#086CF2}.sf-nav-hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px}.sf-nav-hamburger span{display:block;width:22px;height:2px;background:#0A0E1A;border-radius:2px;transition:transform .3s,opacity .3s}.sf-nav-open .sf-nav-hamburger span:nth-child(1){transform:translateY(7px) rotate(45deg)}.sf-nav-open .sf-nav-hamburger span:nth-child(2){opacity:0}.sf-nav-open .sf-nav-hamburger span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}.sf-nav-mobile-menu{display:none;width:100%;flex-direction:column;padding:12px 0 16px;gap:4px}.sf-nav-mobile-menu a{font-size:15px;color:#4A5568;text-decoration:none;padding:10px 0;border-bottom:1px solid rgba(0,0,0,.04);font-weight:500}.sf-nav-mobile-menu a:hover{color:#086CF2}@media(max-width:768px){.sf-nav-simple-links{display:none}.sf-nav-hamburger{display:flex}.sf-nav-open .sf-nav-mobile-menu{display:flex}}`,
  },
  {
    id: "navbar-cta",
    name: "\u5c0e\u822a\u5217 + CTA",
    category: "navbar",
    html: `<nav class="sf-nav-cta" data-module="navbar-cta">
  <div class="sf-nav-cta-inner">
    <a href="#" data-editable="brand" class="sf-nav-cta-brand">\u4f60\u7684\u54c1\u724c</a>
    <div class="sf-nav-cta-right">
      <a href="#" data-editable="link1" class="sf-nav-cta-link">\u95dc\u65bc</a>
      <a href="#" data-editable="link2" class="sf-nav-cta-link">\u670d\u52d9</a>
      <a href="#" data-editable="link3" class="sf-nav-cta-link">\u4f5c\u54c1</a>
      <a href="#" data-editable="cta" class="sf-nav-cta-btn">\u514d\u8cbb\u8ae7\u8a62</a>
    </div>
    <button class="sf-nav-hamburger" onclick="this.closest('nav').classList.toggle('sf-nav-open')" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
    <div class="sf-nav-mobile-menu">
      <a href="#">\u95dc\u65bc</a>
      <a href="#">\u670d\u52d9</a>
      <a href="#">\u4f5c\u54c1</a>
      <a href="#" class="sf-nav-cta-mobile-btn">\u514d\u8cbb\u8ae7\u8a62</a>
    </div>
  </div>
</nav>`,
    css: `.sf-nav-cta{padding:0 24px;background:#fff;border-bottom:1px solid rgba(0,0,0,.06);position:sticky;top:0;z-index:100}.sf-nav-cta-inner{max-width:1120px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px;flex-wrap:wrap}.sf-nav-cta-brand{font-family:'Noto Serif TC',serif;font-size:18px;font-weight:700;color:#0A0E1A;text-decoration:none}.sf-nav-cta-right{display:flex;align-items:center;gap:28px}.sf-nav-cta-link{font-size:14px;color:#4A5568;text-decoration:none;font-weight:500;transition:color .2s}.sf-nav-cta-link:hover{color:#086CF2}.sf-nav-cta-btn{font-size:14px;font-weight:600;color:#fff;background:#086CF2;padding:8px 20px;border-radius:8px;text-decoration:none;transition:opacity .2s}.sf-nav-cta-btn:hover{opacity:.9}.sf-nav-hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px}.sf-nav-hamburger span{display:block;width:22px;height:2px;background:#0A0E1A;border-radius:2px;transition:transform .3s,opacity .3s}.sf-nav-open .sf-nav-hamburger span:nth-child(1){transform:translateY(7px) rotate(45deg)}.sf-nav-open .sf-nav-hamburger span:nth-child(2){opacity:0}.sf-nav-open .sf-nav-hamburger span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}.sf-nav-mobile-menu{display:none;width:100%;flex-direction:column;padding:12px 0 16px;gap:4px}.sf-nav-mobile-menu a{font-size:15px;color:#4A5568;text-decoration:none;padding:10px 0;border-bottom:1px solid rgba(0,0,0,.04);font-weight:500}.sf-nav-mobile-menu a:hover{color:#086CF2}.sf-nav-cta-mobile-btn{background:#086CF2;color:#fff !important;padding:12px 20px;border-radius:8px;text-align:center;margin-top:8px;border:none !important}@media(max-width:768px){.sf-nav-cta-right{display:none}.sf-nav-hamburger{display:flex}.sf-nav-open .sf-nav-mobile-menu{display:flex}}`,
  },
  {
    id: "navbar-center",
    name: "\u5c0e\u822a\u5217 \u7f6e\u4e2d",
    category: "navbar",
    html: `<nav class="sf-nav-center" data-module="navbar-center">
  <div class="sf-nav-center-inner">
    <div class="sf-nav-center-left">
      <a href="#" data-editable="link1">\u670d\u52d9\u9805\u76ee</a>
      <a href="#" data-editable="link2">\u4f5c\u54c1\u96c6</a>
    </div>
    <a href="#" data-editable="brand" class="sf-nav-center-brand">\u4f60\u7684\u54c1\u724c</a>
    <div class="sf-nav-center-right">
      <a href="#" data-editable="link3">\u95dc\u65bc\u6211\u5011</a>
      <a href="#" data-editable="link4">\u806f\u7e6b\u6211\u5011</a>
    </div>
    <button class="sf-nav-hamburger" onclick="this.closest('nav').classList.toggle('sf-nav-open')" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
    <div class="sf-nav-mobile-menu">
      <a href="#">\u670d\u52d9\u9805\u76ee</a>
      <a href="#">\u4f5c\u54c1\u96c6</a>
      <a href="#">\u95dc\u65bc\u6211\u5011</a>
      <a href="#">\u806f\u7e6b\u6211\u5011</a>
    </div>
  </div>
</nav>`,
    css: `.sf-nav-center{padding:0 24px;background:#fff;border-bottom:1px solid rgba(0,0,0,.06);position:sticky;top:0;z-index:100}.sf-nav-center-inner{max-width:1120px;margin:0 auto;display:flex;align-items:center;justify-content:center;height:64px;gap:40px;flex-wrap:wrap}.sf-nav-center-left,.sf-nav-center-right{display:flex;gap:28px}.sf-nav-center-left a,.sf-nav-center-right a{font-size:14px;color:#4A5568;text-decoration:none;font-weight:500;transition:color .2s}.sf-nav-center-left a:hover,.sf-nav-center-right a:hover{color:#086CF2}.sf-nav-center-brand{font-family:'Noto Serif TC',serif;font-size:20px;font-weight:700;color:#0A0E1A;text-decoration:none}.sf-nav-hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px;position:absolute;right:24px}.sf-nav-hamburger span{display:block;width:22px;height:2px;background:#0A0E1A;border-radius:2px;transition:transform .3s,opacity .3s}.sf-nav-open .sf-nav-hamburger span:nth-child(1){transform:translateY(7px) rotate(45deg)}.sf-nav-open .sf-nav-hamburger span:nth-child(2){opacity:0}.sf-nav-open .sf-nav-hamburger span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}.sf-nav-mobile-menu{display:none;width:100%;flex-direction:column;padding:12px 0 16px;gap:4px}.sf-nav-mobile-menu a{font-size:15px;color:#4A5568;text-decoration:none;padding:10px 0;border-bottom:1px solid rgba(0,0,0,.04);font-weight:500}.sf-nav-mobile-menu a:hover{color:#086CF2}@media(max-width:768px){.sf-nav-center-inner{justify-content:space-between;position:relative}.sf-nav-center-left,.sf-nav-center-right{display:none}.sf-nav-hamburger{display:flex}.sf-nav-open .sf-nav-mobile-menu{display:flex}}`,
  },

  // ─── HERO ─────────────────────────────────────────────
  {
    id: "hero-minimal",
    name: "Hero \u7c21\u7d04",
    category: "hero",
    html: `<section class="sf-hero" data-module="hero-minimal">
  <div class="sf-hero-inner">
    <h1 data-editable="title" class="sf-hero-title">\u54c1\u724c\u6a19\u984c\u653e\u9019\u88e1</h1>
    <p data-editable="subtitle" class="sf-hero-subtitle">\u526f\u6a19\u984c\uff0c\u4e00\u53e5\u8a71\u8aac\u6e05\u695a\u4f60\u662f\u8ab0</p>
    <a data-editable="cta" href="#" class="sf-hero-cta">\u4e86\u89e3\u66f4\u591a</a>
  </div>
</section>`,
    css: `.sf-hero{padding:120px 24px;text-align:center;background:#fff}.sf-hero-inner{max-width:720px;margin:0 auto}.sf-hero-title{font-family:'Noto Serif TC',serif;font-size:48px;font-weight:700;line-height:1.3;color:#0A0E1A;margin:0 0 16px}.sf-hero-subtitle{font-family:'Noto Sans TC',sans-serif;font-size:18px;line-height:1.8;color:#4A5568;margin:0 0 32px}.sf-hero-cta{display:inline-block;padding:14px 32px;background:#086CF2;color:#fff;text-decoration:none;border-radius:10px;font-size:16px;font-weight:600;transition:opacity .2s}.sf-hero-cta:hover{opacity:.9}@media(max-width:768px){.sf-hero{padding:80px 20px}.sf-hero-title{font-size:32px}.sf-hero-subtitle{font-size:16px}}`,
  },
  {
    id: "hero-split",
    name: "Hero \u5de6\u53f3\u5206\u6b04",
    category: "hero",
    html: `<section class="sf-hero-split" data-module="hero-split">
  <div class="sf-hero-split-inner">
    <div class="sf-hero-split-text">
      <h1 data-editable="title" class="sf-hero-split-title">\u6253\u9020\u5c08\u5c6c\u65bc\u4f60\u7684\u54c1\u724c\u5b98\u7db2</h1>
      <p data-editable="subtitle" class="sf-hero-split-sub">\u7c21\u7d04\u8a2d\u8a08\uff0c\u5feb\u901f\u4e0a\u7dda\u3002\u8b93\u4f60\u7684\u54c1\u724c\u5728\u7db2\u8def\u4e0a\u767c\u5149\u767c\u71b1\u3002</p>
      <div class="sf-hero-split-btns">
        <a href="#" data-editable="cta1" class="sf-hero-split-primary">\u958b\u59cb\u4f7f\u7528</a>
        <a href="#" data-editable="cta2" class="sf-hero-split-secondary">\u67e5\u770b\u6848\u4f8b</a>
      </div>
    </div>
    <div class="sf-hero-split-img">
      <img data-editable="image" src="https://placehold.co/560x400/F0F4FF/086CF2?text=Hero+Image" alt="">
    </div>
  </div>
</section>`,
    css: `.sf-hero-split{padding:100px 24px;background:#fff}.sf-hero-split-inner{max-width:1120px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}.sf-hero-split-title{font-family:'Noto Serif TC',serif;font-size:42px;font-weight:700;line-height:1.3;color:#0A0E1A;margin:0 0 16px}.sf-hero-split-sub{font-size:16px;line-height:1.8;color:#4A5568;margin:0 0 32px}.sf-hero-split-btns{display:flex;gap:12px}.sf-hero-split-primary{padding:12px 28px;background:#086CF2;color:#fff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:600;transition:opacity .2s}.sf-hero-split-primary:hover{opacity:.9}.sf-hero-split-secondary{padding:12px 28px;background:transparent;color:#086CF2;text-decoration:none;border-radius:10px;font-size:15px;font-weight:600;border:1px solid #086CF2;transition:background .2s}.sf-hero-split-secondary:hover{background:rgba(8,108,242,.06)}.sf-hero-split-img img{width:100%;border-radius:16px}@media(max-width:768px){.sf-hero-split{padding:60px 20px}.sf-hero-split-inner{grid-template-columns:1fr;gap:32px}.sf-hero-split-title{font-size:30px}.sf-hero-split-btns{flex-direction:column}.sf-hero-split-primary,.sf-hero-split-secondary{text-align:center}}`,
  },
  {
    id: "hero-fullbg",
    name: "Hero \u6eff\u7248\u80cc\u666f",
    category: "hero",
    html: `<section class="sf-hero-full" data-module="hero-fullbg">
  <div class="sf-hero-full-overlay">
    <div class="sf-hero-full-inner">
      <h1 data-editable="title" class="sf-hero-full-title">\u7528\u5fc3\u505a\u597d\u6bcf\u4e00\u500b\u7d30\u7bc0</h1>
      <p data-editable="subtitle" class="sf-hero-full-sub">\u6211\u5011\u5c08\u6ce8\u65bc\u63d0\u4f9b\u6700\u512a\u8cea\u7684\u670d\u52d9\u9ad4\u9a57</p>
      <a href="#" data-editable="cta" class="sf-hero-full-cta">\u7acb\u5373\u8ae7\u8a62</a>
    </div>
  </div>
</section>`,
    css: `.sf-hero-full{min-height:520px;background:#0A0E1A;position:relative;display:flex;align-items:center}.sf-hero-full-overlay{width:100%;padding:100px 24px;text-align:center}.sf-hero-full-inner{max-width:640px;margin:0 auto}.sf-hero-full-title{font-family:'Noto Serif TC',serif;font-size:44px;font-weight:700;line-height:1.3;color:#fff;margin:0 0 16px}.sf-hero-full-sub{font-size:17px;line-height:1.8;color:rgba(255,255,255,.7);margin:0 0 36px}.sf-hero-full-cta{display:inline-block;padding:14px 36px;background:#086CF2;color:#fff;text-decoration:none;border-radius:10px;font-size:16px;font-weight:600;transition:opacity .2s}.sf-hero-full-cta:hover{opacity:.9}@media(max-width:768px){.sf-hero-full{min-height:400px}.sf-hero-full-overlay{padding:60px 20px}.sf-hero-full-title{font-size:30px}.sf-hero-full-sub{font-size:15px}}`,
  },

  // ─── FEATURE ──────────────────────────────────────────
  {
    id: "feature-grid",
    name: "Feature \u4e09\u6b04",
    category: "feature",
    html: `<section class="sf-features" data-module="feature-grid">
  <div class="sf-features-inner">
    <h2 data-editable="title" class="sf-features-title">\u6211\u5011\u7684\u7279\u8272</h2>
    <div class="sf-features-grid">
      <div class="sf-feature-card"><div class="sf-feature-icon">01</div><h3 data-editable="f1-title" class="sf-feature-name">\u5c08\u696d\u8a2d\u8a08</h3><p data-editable="f1-desc" class="sf-feature-desc">\u6b50\u7f8e\u7c21\u7d04\u98a8\u683c\uff0c\u8b93\u4f60\u7684\u54c1\u724c\u8131\u7a4e\u800c\u51fa</p></div>
      <div class="sf-feature-card"><div class="sf-feature-icon">02</div><h3 data-editable="f2-title" class="sf-feature-name">\u5feb\u901f\u4e0a\u7dda</h3><p data-editable="f2-desc" class="sf-feature-desc">\u5e7e\u5206\u9418\u5373\u53ef\u5efa\u7acb\u4e26\u767c\u5e03\u4f60\u7684\u5b98\u7db2</p></div>
      <div class="sf-feature-card"><div class="sf-feature-icon">03</div><h3 data-editable="f3-title" class="sf-feature-name">\u4e2d\u6587\u512a\u5316</h3><p data-editable="f3-desc" class="sf-feature-desc">\u7e41\u9ad4\u4e2d\u6587\u6392\u7248\u5c08\u5c6c\u8a2d\u8a08\uff0c\u8b80\u8d77\u4f86\u66f4\u8212\u670d</p></div>
    </div>
  </div>
</section>`,
    css: `.sf-features{padding:100px 24px;background:#F8F9FC}.sf-features-inner{max-width:960px;margin:0 auto}.sf-features-title{font-family:'Noto Serif TC',serif;font-size:36px;font-weight:700;color:#0A0E1A;text-align:center;margin:0 0 48px}.sf-features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}.sf-feature-card{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:16px;padding:32px}.sf-feature-icon{font-family:'DM Mono',monospace;font-size:14px;font-weight:500;color:#086CF2;background:rgba(8,108,242,.1);width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:20px}.sf-feature-name{font-size:18px;font-weight:600;color:#0A0E1A;margin:0 0 8px}.sf-feature-desc{font-size:14px;line-height:1.7;color:#4A5568;margin:0}@media(max-width:768px){.sf-features{padding:60px 20px}.sf-features-title{font-size:28px}.sf-features-grid{grid-template-columns:1fr;gap:16px}}`,
  },
  {
    id: "feature-icon-row",
    name: "Feature \u5716\u6a19\u6a6b\u5217",
    category: "feature",
    html: `<section class="sf-feat-row" data-module="feature-icon-row">
  <div class="sf-feat-row-inner">
    <div class="sf-feat-row-header">
      <h2 data-editable="title" class="sf-feat-row-title">\u70ba\u4ec0\u9ebc\u9078\u64c7\u6211\u5011</h2>
      <p data-editable="subtitle" class="sf-feat-row-sub">\u6211\u5011\u63d0\u4f9b\u6700\u5b8c\u6574\u7684\u670d\u52d9\u9ad4\u9a57</p>
    </div>
    <div class="sf-feat-row-grid">
      <div class="sf-feat-row-item"><div class="sf-feat-row-num">\u2714</div><h3 data-editable="f1-title">\u5feb\u901f\u4ea4\u4ed8</h3><p data-editable="f1-desc">3 \u5929\u5167\u5b8c\u6210\u4f60\u7684\u5b98\u7db2</p></div>
      <div class="sf-feat-row-item"><div class="sf-feat-row-num">\u2714</div><h3 data-editable="f2-title">\u54c1\u724c\u5316\u8a2d\u8a08</h3><p data-editable="f2-desc">\u5c08\u696d\u8a2d\u8a08\u5e2b\u64cd\u5200</p></div>
      <div class="sf-feat-row-item"><div class="sf-feat-row-num">\u2714</div><h3 data-editable="f3-title">SEO \u512a\u5316</h3><p data-editable="f3-desc">\u8b93\u4f60\u7684\u5ba2\u6236\u627e\u5230\u4f60</p></div>
      <div class="sf-feat-row-item"><div class="sf-feat-row-num">\u2714</div><h3 data-editable="f4-title">\u552e\u5f8c\u670d\u52d9</h3><p data-editable="f4-desc">\u6301\u7e8c\u66f4\u65b0\u8207\u7dad\u8b77</p></div>
    </div>
  </div>
</section>`,
    css: `.sf-feat-row{padding:100px 24px;background:#fff}.sf-feat-row-inner{max-width:960px;margin:0 auto}.sf-feat-row-header{text-align:center;margin-bottom:48px}.sf-feat-row-title{font-family:'Noto Serif TC',serif;font-size:36px;font-weight:700;color:#0A0E1A;margin:0 0 12px}.sf-feat-row-sub{font-size:16px;color:#4A5568;margin:0}.sf-feat-row-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:32px}.sf-feat-row-item{text-align:center}.sf-feat-row-num{width:48px;height:48px;background:rgba(8,108,242,.08);color:#086CF2;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;margin:0 auto 16px}.sf-feat-row-item h3{font-size:16px;font-weight:600;color:#0A0E1A;margin:0 0 6px}.sf-feat-row-item p{font-size:14px;color:#4A5568;margin:0;line-height:1.6}@media(max-width:768px){.sf-feat-row{padding:60px 20px}.sf-feat-row-title{font-size:28px}.sf-feat-row-grid{grid-template-columns:repeat(2,1fr);gap:24px}}@media(max-width:480px){.sf-feat-row-grid{grid-template-columns:1fr}}`,
  },
  {
    id: "feature-alternating",
    name: "Feature \u5de6\u53f3\u4ea4\u66ff",
    category: "feature",
    html: `<section class="sf-feat-alt" data-module="feature-alternating">
  <div class="sf-feat-alt-inner">
    <div class="sf-feat-alt-row">
      <div class="sf-feat-alt-img"><img data-editable="img1" src="https://placehold.co/480x320/F0F4FF/086CF2?text=Feature+1" alt=""></div>
      <div class="sf-feat-alt-text"><h3 data-editable="t1">\u76f4\u89ba\u7684\u7de8\u8f2f\u9ad4\u9a57</h3><p data-editable="d1">\u62d6\u62c9\u5373\u53ef\u5b8c\u6210\uff0c\u4e0d\u9700\u8981\u4efb\u4f55\u6280\u8853\u80cc\u666f\u3002\u6bcf\u500b\u4eba\u90fd\u80fd\u5efa\u7acb\u5c08\u696d\u7684\u5b98\u7db2\u3002</p></div>
    </div>
    <div class="sf-feat-alt-row sf-feat-alt-reverse">
      <div class="sf-feat-alt-img"><img data-editable="img2" src="https://placehold.co/480x320/F0F4FF/086CF2?text=Feature+2" alt=""></div>
      <div class="sf-feat-alt-text"><h3 data-editable="t2">\u884c\u52d5\u88dd\u7f6e\u512a\u5148</h3><p data-editable="d2">\u5168\u90e8\u7248\u578b\u90fd\u91dd\u5c0d\u624b\u6a5f\u512a\u5316\uff0c\u78ba\u4fdd\u5728\u4efb\u4f55\u88dd\u7f6e\u4e0a\u90fd\u5b8c\u7f8e\u5448\u73fe\u3002</p></div>
    </div>
  </div>
</section>`,
    css: `.sf-feat-alt{padding:100px 24px;background:#F8F9FC}.sf-feat-alt-inner{max-width:960px;margin:0 auto;display:flex;flex-direction:column;gap:64px}.sf-feat-alt-row{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}.sf-feat-alt-reverse{direction:rtl}.sf-feat-alt-reverse>*{direction:ltr}.sf-feat-alt-img img{width:100%;border-radius:16px}.sf-feat-alt-text h3{font-family:'Noto Serif TC',serif;font-size:28px;font-weight:700;color:#0A0E1A;margin:0 0 12px}.sf-feat-alt-text p{font-size:15px;line-height:1.8;color:#4A5568;margin:0}@media(max-width:768px){.sf-feat-alt{padding:60px 20px}.sf-feat-alt-inner{gap:40px}.sf-feat-alt-row,.sf-feat-alt-reverse{grid-template-columns:1fr;direction:ltr}.sf-feat-alt-text h3{font-size:22px}}`,
  },

  // ─── GALLERY ──────────────────────────────────────────
  {
    id: "gallery-grid2",
    name: "Gallery \u5169\u6b04",
    category: "gallery",
    html: `<section class="sf-gallery" data-module="gallery-grid2">
  <div class="sf-gallery-inner">
    <h2 data-editable="title" class="sf-gallery-title">\u4f5c\u54c1\u96c6</h2>
    <div class="sf-gallery-grid">
      <div class="sf-gallery-item"><img data-editable="img1" src="https://placehold.co/600x400/F0F4FF/086CF2?text=Image+1" alt="" class="sf-gallery-img"></div>
      <div class="sf-gallery-item"><img data-editable="img2" src="https://placehold.co/600x400/F0F4FF/086CF2?text=Image+2" alt="" class="sf-gallery-img"></div>
      <div class="sf-gallery-item"><img data-editable="img3" src="https://placehold.co/600x400/F0F4FF/086CF2?text=Image+3" alt="" class="sf-gallery-img"></div>
      <div class="sf-gallery-item"><img data-editable="img4" src="https://placehold.co/600x400/F0F4FF/086CF2?text=Image+4" alt="" class="sf-gallery-img"></div>
    </div>
  </div>
</section>`,
    css: `.sf-gallery{padding:100px 24px;background:#fff}.sf-gallery-inner{max-width:960px;margin:0 auto}.sf-gallery-title{font-family:'Noto Serif TC',serif;font-size:36px;font-weight:700;color:#0A0E1A;text-align:center;margin:0 0 48px}.sf-gallery-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.sf-gallery-item{border-radius:16px;overflow:hidden}.sf-gallery-img{width:100%;height:100%;object-fit:cover;display:block;aspect-ratio:3/2;transition:transform .3s}.sf-gallery-item:hover .sf-gallery-img{transform:scale(1.03)}@media(max-width:768px){.sf-gallery{padding:60px 20px}.sf-gallery-title{font-size:28px}.sf-gallery-grid{grid-template-columns:1fr}}`,
  },
  {
    id: "gallery-grid3",
    name: "Gallery \u4e09\u6b04",
    category: "gallery",
    html: `<section class="sf-gal3" data-module="gallery-grid3">
  <div class="sf-gal3-inner">
    <h2 data-editable="title" class="sf-gal3-title">\u7cbe\u9078\u4f5c\u54c1</h2>
    <p data-editable="subtitle" class="sf-gal3-sub">\u6bcf\u4e00\u4ef6\u4f5c\u54c1\u90fd\u50be\u6ce8\u4e86\u6211\u5011\u7684\u71b1\u60c5\u8207\u5c08\u696d</p>
    <div class="sf-gal3-grid">
      <div class="sf-gal3-item"><img data-editable="img1" src="https://placehold.co/400x400/F0F4FF/086CF2?text=01" alt=""></div>
      <div class="sf-gal3-item"><img data-editable="img2" src="https://placehold.co/400x400/F0F4FF/086CF2?text=02" alt=""></div>
      <div class="sf-gal3-item"><img data-editable="img3" src="https://placehold.co/400x400/F0F4FF/086CF2?text=03" alt=""></div>
      <div class="sf-gal3-item"><img data-editable="img4" src="https://placehold.co/400x400/F0F4FF/086CF2?text=04" alt=""></div>
      <div class="sf-gal3-item"><img data-editable="img5" src="https://placehold.co/400x400/F0F4FF/086CF2?text=05" alt=""></div>
      <div class="sf-gal3-item"><img data-editable="img6" src="https://placehold.co/400x400/F0F4FF/086CF2?text=06" alt=""></div>
    </div>
  </div>
</section>`,
    css: `.sf-gal3{padding:100px 24px;background:#F8F9FC}.sf-gal3-inner{max-width:1000px;margin:0 auto}.sf-gal3-title{font-family:'Noto Serif TC',serif;font-size:36px;font-weight:700;color:#0A0E1A;text-align:center;margin:0 0 12px}.sf-gal3-sub{font-size:16px;color:#4A5568;text-align:center;margin:0 0 48px}.sf-gal3-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.sf-gal3-item{border-radius:12px;overflow:hidden}.sf-gal3-item img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block;transition:transform .3s}.sf-gal3-item:hover img{transform:scale(1.04)}@media(max-width:768px){.sf-gal3{padding:60px 20px}.sf-gal3-title{font-size:28px}.sf-gal3-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:480px){.sf-gal3-grid{grid-template-columns:1fr}}`,
  },
  {
    id: "gallery-showcase",
    name: "Gallery \u5927\u5716\u5c55\u793a",
    category: "gallery",
    html: `<section class="sf-gal-show" data-module="gallery-showcase">
  <div class="sf-gal-show-inner">
    <div class="sf-gal-show-main"><img data-editable="main" src="https://placehold.co/800x500/F0F4FF/086CF2?text=Main+Image" alt=""></div>
    <div class="sf-gal-show-side">
      <div class="sf-gal-show-sm"><img data-editable="img1" src="https://placehold.co/400x250/F0F4FF/086CF2?text=Image+1" alt=""></div>
      <div class="sf-gal-show-sm"><img data-editable="img2" src="https://placehold.co/400x250/F0F4FF/086CF2?text=Image+2" alt=""></div>
    </div>
  </div>
</section>`,
    css: `.sf-gal-show{padding:100px 24px;background:#fff}.sf-gal-show-inner{max-width:1000px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr;gap:16px}.sf-gal-show-main img,.sf-gal-show-sm img{width:100%;height:100%;object-fit:cover;display:block;border-radius:16px}.sf-gal-show-main{border-radius:16px;overflow:hidden}.sf-gal-show-side{display:flex;flex-direction:column;gap:16px}.sf-gal-show-sm{border-radius:16px;overflow:hidden;flex:1}@media(max-width:768px){.sf-gal-show{padding:60px 20px}.sf-gal-show-inner{grid-template-columns:1fr}.sf-gal-show-side{flex-direction:row}}@media(max-width:480px){.sf-gal-show-side{flex-direction:column}}`,
  },

  // ─── CTA ──────────────────────────────────────────────
  {
    id: "cta-dark",
    name: "CTA \u6df1\u8272\u80cc\u666f",
    category: "cta",
    html: `<section class="sf-cta" data-module="cta-dark">
  <div class="sf-cta-inner">
    <h2 data-editable="title" class="sf-cta-title">\u6e96\u5099\u597d\u958b\u59cb\u4e86\u55ce\uff1f</h2>
    <p data-editable="subtitle" class="sf-cta-subtitle">\u7acb\u5373\u806f\u7e6b\u6211\u5011\uff0c\u8b93\u6211\u5011\u5354\u52a9\u4f60\u6253\u9020\u5c08\u5c6c\u54c1\u724c\u5b98\u7db2</p>
    <div class="sf-cta-buttons">
      <a data-editable="cta1" href="#" class="sf-cta-btn-primary">\u514d\u8cbb\u8ae7\u8a62</a>
      <a data-editable="cta2" href="#" class="sf-cta-btn-secondary">\u67e5\u770b\u65b9\u6848</a>
    </div>
  </div>
</section>`,
    css: `.sf-cta{padding:100px 24px;background:#0A0E1A;text-align:center}.sf-cta-inner{max-width:640px;margin:0 auto}.sf-cta-title{font-family:'Noto Serif TC',serif;font-size:36px;font-weight:700;color:#fff;margin:0 0 16px}.sf-cta-subtitle{font-size:16px;line-height:1.8;color:rgba(255,255,255,.7);margin:0 0 32px}.sf-cta-buttons{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}.sf-cta-btn-primary{display:inline-block;padding:14px 32px;background:#086CF2;color:#fff;text-decoration:none;border-radius:10px;font-size:16px;font-weight:600;transition:opacity .2s}.sf-cta-btn-primary:hover{opacity:.9}.sf-cta-btn-secondary{display:inline-block;padding:14px 32px;background:rgba(255,255,255,.1);color:#fff;text-decoration:none;border-radius:10px;font-size:16px;font-weight:600;border:1px solid rgba(255,255,255,.2);transition:background .2s}.sf-cta-btn-secondary:hover{background:rgba(255,255,255,.15)}@media(max-width:768px){.sf-cta{padding:60px 20px}.sf-cta-title{font-size:28px}.sf-cta-buttons{flex-direction:column;align-items:center}}`,
  },
  {
    id: "cta-light",
    name: "CTA \u6dfa\u8272\u80cc\u666f",
    category: "cta",
    html: `<section class="sf-cta-lt" data-module="cta-light">
  <div class="sf-cta-lt-inner">
    <div class="sf-cta-lt-card">
      <h2 data-editable="title" class="sf-cta-lt-title">\u8b93\u6211\u5011\u4e00\u8d77\u958b\u59cb</h2>
      <p data-editable="subtitle" class="sf-cta-lt-sub">\u514d\u8cbb\u8a3b\u518a\uff0c\u7acb\u5373\u9ad4\u9a57\u6700\u7c21\u55ae\u7684\u5efa\u7ad9\u5de5\u5177</p>
      <a href="#" data-editable="cta" class="sf-cta-lt-btn">\u7acb\u5373\u958b\u59cb</a>
    </div>
  </div>
</section>`,
    css: `.sf-cta-lt{padding:80px 24px;background:#F8F9FC}.sf-cta-lt-inner{max-width:800px;margin:0 auto}.sf-cta-lt-card{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:20px;padding:64px 48px;text-align:center}.sf-cta-lt-title{font-family:'Noto Serif TC',serif;font-size:32px;font-weight:700;color:#0A0E1A;margin:0 0 12px}.sf-cta-lt-sub{font-size:16px;color:#4A5568;margin:0 0 32px;line-height:1.7}.sf-cta-lt-btn{display:inline-block;padding:14px 36px;background:#086CF2;color:#fff;text-decoration:none;border-radius:10px;font-size:16px;font-weight:600;transition:opacity .2s}.sf-cta-lt-btn:hover{opacity:.9}@media(max-width:768px){.sf-cta-lt{padding:40px 20px}.sf-cta-lt-card{padding:40px 24px}.sf-cta-lt-title{font-size:26px}}`,
  },
  {
    id: "cta-banner-inline",
    name: "CTA \u6a6b\u5e45\u6392\u5217",
    category: "cta",
    html: `<section class="sf-cta-ban" data-module="cta-banner-inline">
  <div class="sf-cta-ban-inner">
    <div class="sf-cta-ban-text">
      <h2 data-editable="title">\u6709\u4efb\u4f55\u554f\u984c\u55ce\uff1f</h2>
      <p data-editable="subtitle">\u6211\u5011\u7684\u5718\u968a\u96a8\u6642\u6e96\u5099\u597d\u70ba\u4f60\u670d\u52d9</p>
    </div>
    <a href="#" data-editable="cta" class="sf-cta-ban-btn">\u806f\u7e6b\u6211\u5011</a>
  </div>
</section>`,
    css: `.sf-cta-ban{padding:0 24px;background:#fff}.sf-cta-ban-inner{max-width:960px;margin:0 auto;background:#086CF2;border-radius:20px;padding:48px;display:flex;align-items:center;justify-content:space-between;gap:24px}.sf-cta-ban-text h2{font-family:'Noto Serif TC',serif;font-size:24px;font-weight:700;color:#fff;margin:0 0 6px}.sf-cta-ban-text p{font-size:15px;color:rgba(255,255,255,.8);margin:0}.sf-cta-ban-btn{display:inline-block;padding:12px 28px;background:#fff;color:#086CF2;text-decoration:none;border-radius:10px;font-size:15px;font-weight:600;white-space:nowrap;transition:opacity .2s}.sf-cta-ban-btn:hover{opacity:.9}@media(max-width:768px){.sf-cta-ban-inner{flex-direction:column;text-align:center;padding:36px 24px}.sf-cta-ban-text h2{font-size:22px}}`,
  },

  // ─── FOOTER ───────────────────────────────────────────
  {
    id: "footer-simple",
    name: "Footer \u7c21\u7d04",
    category: "footer",
    html: `<footer class="sf-footer" data-module="footer-simple">
  <div class="sf-footer-inner">
    <div class="sf-footer-top">
      <div class="sf-footer-brand"><h3 data-editable="brand" class="sf-footer-logo">\u4f60\u7684\u54c1\u724c</h3><p data-editable="tagline" class="sf-footer-tagline">\u4e00\u53e5\u8a71\u63cf\u8ff0\u4f60\u7684\u54c1\u724c</p></div>
      <div class="sf-footer-links"><a data-editable="l1" href="#">\u95dc\u65bc\u6211\u5011</a><a data-editable="l2" href="#">\u670d\u52d9\u9805\u76ee</a><a data-editable="l3" href="#">\u806f\u7e6b\u6211\u5011</a></div>
    </div>
    <div class="sf-footer-bottom"><p data-editable="copy">&copy; 2025 \u4f60\u7684\u54c1\u724c. All rights reserved.</p></div>
  </div>
</footer>`,
    css: `.sf-footer{padding:60px 24px 32px;background:#fff;border-top:1px solid rgba(0,0,0,.06)}.sf-footer-inner{max-width:960px;margin:0 auto}.sf-footer-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px}.sf-footer-logo{font-family:'Noto Serif TC',serif;font-size:20px;font-weight:700;color:#0A0E1A;margin:0 0 8px}.sf-footer-tagline{font-size:14px;color:#4A5568;margin:0}.sf-footer-links{display:flex;gap:24px}.sf-footer-links a{font-size:14px;color:#4A5568;text-decoration:none;transition:color .2s}.sf-footer-links a:hover{color:#0A0E1A}.sf-footer-bottom{padding-top:24px;border-top:1px solid rgba(0,0,0,.06)}.sf-footer-bottom p{font-size:13px;color:#8B9BB4;margin:0}@media(max-width:768px){.sf-footer{padding:40px 20px 24px}.sf-footer-top{flex-direction:column;gap:24px}.sf-footer-links{flex-direction:column;gap:12px}}`,
  },
  {
    id: "footer-columns",
    name: "Footer \u591a\u6b04",
    category: "footer",
    html: `<footer class="sf-ft-col" data-module="footer-columns">
  <div class="sf-ft-col-inner">
    <div class="sf-ft-col-grid">
      <div class="sf-ft-col-about"><h3 data-editable="brand">\u4f60\u7684\u54c1\u724c</h3><p data-editable="desc">\u63d0\u4f9b\u6700\u512a\u8cea\u7684\u670d\u52d9\u8207\u9ad4\u9a57\uff0c\u8b93\u54c1\u724c\u66f4\u6709\u50f9\u503c\u3002</p></div>
      <div><h4>\u670d\u52d9</h4><a data-editable="s1" href="#">\u54c1\u724c\u5b98\u7db2</a><a data-editable="s2" href="#">\u5e97\u8217\u9801\u9762</a><a data-editable="s3" href="#">SEO \u512a\u5316</a></div>
      <div><h4>\u516c\u53f8</h4><a data-editable="c1" href="#">\u95dc\u65bc\u6211\u5011</a><a data-editable="c2" href="#">\u90e8\u843d\u683c</a><a data-editable="c3" href="#">\u806f\u7e6b</a></div>
      <div><h4>\u806f\u7e6b\u6211\u5011</h4><p data-editable="email">hello@example.com</p><p data-editable="phone">02-1234-5678</p></div>
    </div>
    <div class="sf-ft-col-bottom"><p data-editable="copy">&copy; 2025 \u4f60\u7684\u54c1\u724c. All rights reserved.</p></div>
  </div>
</footer>`,
    css: `.sf-ft-col{padding:64px 24px 32px;background:#0A0E1A}.sf-ft-col-inner{max-width:1000px;margin:0 auto}.sf-ft-col-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px}.sf-ft-col-about h3{font-family:'Noto Serif TC',serif;font-size:20px;font-weight:700;color:#fff;margin:0 0 12px}.sf-ft-col-about p{font-size:14px;color:rgba(255,255,255,.6);margin:0;line-height:1.7}.sf-ft-col-grid h4{font-size:14px;font-weight:600;color:#fff;margin:0 0 16px}.sf-ft-col-grid a,.sf-ft-col-grid p{display:block;font-size:14px;color:rgba(255,255,255,.5);text-decoration:none;margin:0 0 10px;transition:color .2s}.sf-ft-col-grid a:hover{color:#fff}.sf-ft-col-bottom{border-top:1px solid rgba(255,255,255,.1);padding-top:24px}.sf-ft-col-bottom p{font-size:13px;color:rgba(255,255,255,.4);margin:0}@media(max-width:768px){.sf-ft-col{padding:40px 20px 24px}.sf-ft-col-grid{grid-template-columns:1fr 1fr;gap:32px}}@media(max-width:480px){.sf-ft-col-grid{grid-template-columns:1fr}}`,
  },
  {
    id: "footer-minimal",
    name: "Footer \u6975\u7c21",
    category: "footer",
    html: `<footer class="sf-ft-min" data-module="footer-minimal">
  <div class="sf-ft-min-inner">
    <span data-editable="brand" class="sf-ft-min-brand">\u4f60\u7684\u54c1\u724c</span>
    <div class="sf-ft-min-links">
      <a data-editable="l1" href="#">\u670d\u52d9</a>
      <a data-editable="l2" href="#">\u4f5c\u54c1</a>
      <a data-editable="l3" href="#">\u806f\u7e6b</a>
    </div>
    <span data-editable="copy" class="sf-ft-min-copy">&copy; 2025</span>
  </div>
</footer>`,
    css: `.sf-ft-min{padding:24px;background:#fff;border-top:1px solid rgba(0,0,0,.06)}.sf-ft-min-inner{max-width:1000px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}.sf-ft-min-brand{font-family:'Noto Serif TC',serif;font-size:16px;font-weight:700;color:#0A0E1A}.sf-ft-min-links{display:flex;gap:24px}.sf-ft-min-links a{font-size:13px;color:#4A5568;text-decoration:none;transition:color .2s}.sf-ft-min-links a:hover{color:#0A0E1A}.sf-ft-min-copy{font-size:13px;color:#8B9BB4}@media(max-width:768px){.sf-ft-min-inner{flex-direction:column;gap:12px;text-align:center}}`,
  },
];
