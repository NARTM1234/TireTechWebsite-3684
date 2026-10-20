import { ContactChannels } from "./contact-channels";
import { CompanyCopy } from "./company-copy";
import { createContext, useContext, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, MapPin, Layers } from "lucide-react";
import { useCatalogue } from "../queries/catalogue";
export const Language = createContext({
  ar: false,
  t: (en: string, _ar: string) => en,
  toggle: () => {},
  c: (_id: string) => "",
});
export const useLang = () => useContext(Language);
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [ar, setAr] = useState(localStorage.getItem("tiretech-lang") === "ar");
  const { data } = useCatalogue();
  const text = (row: any) => (ar ? row?.valueAr || row?.value || "" : row?.value || "");
  useEffect(() => {
    document.documentElement.dir = ar ? "rtl" : "ltr";
    document.documentElement.lang = ar ? "ar" : "en";
    localStorage.setItem("tiretech-lang", ar ? "ar" : "en");
  }, [ar]);
  return (
    <Language.Provider
      value={{
        ar,
        t: (en, arabic) => {
          const row = data?.elements.find((x) => x.source === en);
          return row ? text(row) : ar ? arabic : en;
        },
        c: (id) => text(data?.elements.find((x) => x.id === id)),
        toggle: () => setAr(!ar),
      }}
    >
      {children}
    </Language.Provider>
  );
}
export function Logo() {
  const { c } = useLang();
  return (
    <Link href="/" className="logo" aria-label="TireTech home">
      {c("logo-image") ? (
        <img src={c("logo-image")} alt={c("company-name")} className="custom-logo" width={479} height={131} fetchPriority="high" />
      ) : (
        <>
          <span className="logo-mark">
            <i />
            <i />
            <i />
          </span>
          <span>
            TIRE<span>TECH</span>
            <small>{c("logo-tagline")}</small>
          </span>
        </>
      )}
    </Link>
  );
}
export function Header() {
  const { ar, toggle } = useLang();
  const { data } = useCatalogue();
  const [open, setOpen] = useState(false);
  const [path] = useLocation();
  useEffect(() => setOpen(false), [path]);
  return (
    <header className="header">
      <Logo />
      <nav id="site-navigation" aria-label={ar ? "التنقل الرئيسي" : "Main navigation"} className={open ? "nav open" : "nav"}>
        {data?.links
          .filter((x) => x.location === "navigation")
          .map((link, index) => (
            <Link
              key={link.id}
              style={{ "--nav-order": index } as React.CSSProperties}
              href={link.url}
              aria-current={(link.url === "/" ? path === "/" : path.startsWith(link.url)) ? "page" : undefined}
              className={
                (link.url === "/contact" ? "nav-contact " : "") + ((link.url === "/" ? path === "/" : path.startsWith(link.url)) ? "active" : "")
              }
            >
              <span className="nav-label">{ar ? link.labelAr || link.label : link.label}</span>
            </Link>
          ))}
      </nav>
      <button className="language" onClick={toggle}>
        <span className={!ar ? "selected" : ""}>EN</span>
        <span className="separator">/</span>
        <span className={ar ? "selected" : ""}>AR</span>
      </button>
      <button className="menu" aria-label="Toggle menu" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
export function Footer() {
  const { t, ar, c } = useLang();
  const { data } = useCatalogue();
  const f = data?.content.find((x) => x.id === "footer");
  return (
    <footer>
      <div className="footer-main">
        <div>
          <Logo />
          <p>
            <CompanyCopy text={f ? t(f.body, f.bodyAr) : c("copy-2")} />
          </p>
        </div>
        <div>
          <span className="eyebrow">{c("copy-3")}</span>
          {data?.links
            .filter((x) => x.location === "footer")
            .map((link) => (
              <Link key={link.id} href={link.url}>
                {ar ? link.labelAr || link.label : link.label}
              </Link>
            ))}
        </div>
        <div>
          <span className="eyebrow">{c("copy-4")}</span>
          <p>
            <MapPin size={16} />
            {data?.settings[ar ? "location-ar" : "location"]}
          </p>
          <Link href="/contact">{c("copy-5")}</Link>
          <ContactChannels compact />
        </div>
      </div>
      <div className="social-links">
        {data?.links
          .filter((x) => x.location === "social")
          .map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noreferrer">
              {ar ? link.labelAr || link.label : link.label}
            </a>
          ))}
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {c("company-name")}. {c("copy-6")}
        </span>
        <span className="parent-company-footer"><CompanyCopy text={c("parent-company")} /></span>
        <Link href="/admin/login">{c("copy-7")}</Link>
      </div>
    </footer>
  );
}
export function PageHeading({
  label,
  title,
  copy,
}: {
  label: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="page-heading">
      <span className="eyebrow blue">{label}</span>
      <h1>{title}</h1>
      {copy && <p>{copy}</p>}
    </div>
  );
}
export function CTA() {
  const { c } = useLang();
  return (
    <section
      className="cta-band"
      style={
        c("cta-image")
          ? { backgroundImage: `linear-gradient(#83cceae8,#83cceae8),url(${c("cta-image")})` }
          : undefined
      }
    >
      <div>
        <span className="eyebrow">{c("copy-8")}</span>
        <h2>{c("copy-9")}</h2>
      </div>
      <Link href={c("cta-url")} className="button orange">
        {c("copy-10")}
      </Link>
    </section>
  );
}
export function ProductCard({ product }: { product: any }) {
  const { data } = useCatalogue();
  const brand = data?.brands.find((b) => b.id === product.brandId);
  const { t, c } = useLang();
  return (
    <Link className="product-card" href={"/products/" + product.id}>
      <div className={"product-image " + (product.image.includes("patch") ? "contain" : "")}>
        {product.image && (
          <img loading="lazy" src={product.image} alt={t(product.name, product.nameAr)} />
        )}
        {!product.image && <div className="product-family-art"><Layers size={62} strokeWidth={1} /><span>{brand?.name || ""}</span></div>}

        <span className="product-open"></span>
      </div>
      <div className="product-info">
        <span className="eyebrow blue">
          {brand ? t(brand.name, brand.nameAr) : product.brandId}
        </span>
        <h3>{t(product.name, product.nameAr)}</h3>
        {product.variants > 1 && <span className="product-variant-count">{product.variants} {t("size / pack options", "خيارات مقاسات / عبوات")}</span>}
        <span className="muted">{c("copy-12")}</span>
      </div>
    </Link>
  );
}
export function Location({ showContactLink = true }: { showContactLink?: boolean }) {
  const { ar, c } = useLang();
  const { data } = useCatalogue();
  const map = data?.settings["map-url"];
  return (
    <section className="location-section">
      <div>
        <span className="eyebrow blue">{c("copy-13")}</span>
        <h2>{c("copy-14")}</h2>
        <p>
          <MapPin size={18} />
          {data?.settings[ar ? "location-ar" : "location"]}
        </p>
        {showContactLink && <Link href="/contact" className="text-link">
          {c("copy-15")}
        </Link>}
      </div>
      <div className="map-panel">
        {map ? (
          <iframe title="TireTech location" src={map} loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          <>
            <MapPin size={36} />
            <h3>{c("copy-16")}</h3>
            <p>{c("copy-17")}</p>
            <small>{c("copy-18")}</small>
            <a
              className="button outline"
              href={c("map-search-url")}
              target="_blank"
              rel="noreferrer"
            >
              {c("copy-19")}
            </a>
          </>
        )}
      </div>
    </section>
  );
}
