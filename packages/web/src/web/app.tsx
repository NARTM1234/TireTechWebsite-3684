import { Route, Switch, useLocation, Link } from "wouter";
import { useEffect, lazy, Suspense } from "react";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";
import { LanguageProvider, Header, Footer, useLang } from "./components/site";
import { useCatalogue } from "./queries/catalogue";
import Home from "./pages/home";
import { CursorGlow } from "./components/cursor-glow";
import { PageMotion } from "./components/page-motion";
import { WriteReview } from "./pages/write-review";
import { Products, ProductDetails, Brands, BrandDetails } from "./pages/catalogue";
import { About, Industries, Contact, Success } from "./pages/company";
const Admin = lazy(() => import("./pages/admin").then((m) => ({ default: m.Admin })));
const AdminLogin = lazy(() => import("./pages/admin").then((m) => ({ default: m.AdminLogin })));
function Meta() {
  const [path] = useLocation();
  const { ar } = useLang();
  const { data } = useCatalogue();
  useEffect(() => {
    const t = (en: string, a: string) => (ar ? a : en);
    const key = path === "/" ? "home" : path.split("/")[1];
    const meta = data?.seo.find((x) => x.id === key);
    const p = data?.products.find((x) => path === "/products/" + x.id);
    const title = p
      ? t(p.name, p.nameAr) + " | TireTech Kuwait"
      : meta
        ? t(meta.title, meta.titleAr)
        : "TireTech Kuwait";
    document.title = title;
    const description = p
      ? t(p.description, p.descriptionAr)
      : meta
        ? t(meta.description, meta.descriptionAr)
        : "";
    function tag(attr: string, name: string, value: string) {
      let el = document.head.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    }
    tag("name", "description", description);
    tag("property", "og:title", title);
    tag("property", "og:description", description);
    const ogImage = new URL(meta?.image && meta.image !== "/images/hero.webp" ? meta.image : "/og-image.png", location.origin).href;
    tag("property", "og:image", ogImage);
    tag("property", "og:url", location.origin + path);
    tag("name", "twitter:card", "summary_large_image");
    tag("name", "twitter:title", title);
    tag("name", "twitter:description", description);
    tag("name", "twitter:image", ogImage);
    tag("property", "og:type", "website");
    tag("name", "robots", path.startsWith("/admin") ? "noindex, nofollow" : "index, follow");
    const base = data?.settings["canonical-base"];
    let link = document.querySelector('link[rel="canonical"]');
    if (base) {
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", base.replace(/\/$/, "") + path);
    } else link?.remove();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [path, ar, data]);
  return null;
}
function SiteRoutes() {
  const [path] = useLocation();
  const admin = path.startsWith("/admin");
  const catalogue = useCatalogue();
  // Hold the public site until the live CMS content has arrived, so visitors never see
  // the built-in default copy flash before being replaced by the current version.
  if (!admin && !catalogue.data && !catalogue.isError)
    return (
      <output className="boot-splash" aria-label="Loading TireTech">
        <img src="/images/tiretech-logo.png" alt="TireTech" width={479} height={131} />
      </output>
    );
  return (
    <>
      <Meta />
      <PageMotion />
      {!admin && <Header />}
      {!admin && <CursorGlow />}
      <Suspense fallback={<div className="loading">Loading…</div>}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/products/:id">{(p) => <ProductDetails id={p.id} />}</Route>
          <Route path="/brands" component={Brands} />
          <Route path="/brands/:id">{(p) => <BrandDetails id={p.id} />}</Route>
          <Route path="/industries" component={Industries} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/write-review" component={WriteReview} />
          <Route path="/enquiry-success" component={Success} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/:tab" component={Admin} />
          <Route>
            <div className="empty">
              <h1>Page not found</h1>
              <Link href="/">Back to TireTech</Link>
            </div>
          </Route>
        </Switch>
      </Suspense>
      {!admin && <Footer />}
      {!admin && <RunableBadge />}
    </>
  );
}
export default function App() {
  return (
    <Provider>
      <LanguageProvider>
        <SiteRoutes />
        {import.meta.env.DEV && <AgentFeedback />}
      </LanguageProvider>
    </Provider>
  );
}
