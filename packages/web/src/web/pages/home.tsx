import { CompanyCopy } from "../components/company-copy";
import { Reviews } from "../components/reviews";
import { useEffect } from "react";
import { Link } from "wouter";
import { PackageCheck, Layers, MapPin, Focus } from "lucide-react";
import { useCatalogue } from "../queries/catalogue";
import { useLang, ProductCard, CTA, Location } from "../components/site";
export default function Home() {
  const { t, c } = useLang();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(".section-top,.purpose-title,.location-section>div:first-child")
      .forEach((el) => {
        el.classList.add("scroll-reveal");
        observer.observe(el);
      });
    return () => observer.disconnect();
  }, []);
  const { data, isLoading, error } = useCatalogue();
  const home = data?.content.find((x) => x.id === "home");
  if (error) return <div className="loading">{c("copy-24")}</div>;
  return (
    <>
      <section className="hero" style={{ backgroundImage: `url(${home?.image || ""})` }}>
        <div className="hero-shade" />
        <div className="hero-copy">
          <h1>
            {home ? t(home.title, home.titleAr) : c("copy-26")}
            <em>{c("copy-27")}</em>
          </h1>
          <p>{home ? t(home.body, home.bodyAr) : c("copy-28")}</p>
          <div className="hero-actions">
            <Link href={c("hero-primary-url")} className="button orange">
              {c("copy-29")}
            </Link>
            <Link href={c("hero-secondary-url")} className="button ghost">
              {c("copy-30")}
            </Link>
          </div>
        </div>
        <div className="hero-bottom">
          <span>{c("copy-31")}</span>
          <span className="parent-company-hero">
            <CompanyCopy text={c("copy-32")} />
          </span>
        </div>
      </section>
      <section className="brand-ribbon">
        <span className="eyebrow">{c("copy-33")}</span>
        {(
          data?.brands || [
            { id: "gee-stone", name: "Gee Stone" },
            { id: "braza", name: "Braza" },
            { id: "elgi", name: "Elgi" },
            { id: "tip-top", name: "Tip Top" },
          ]
        ).map((b) => (
          <Link href={"/brands/" + b.id} key={b.id} className={"brand-word " + b.id}>
            {b.image ? <img src={b.image} alt={b.name} /> : b.name}
          </Link>
        ))}
      </section>
      <section id="products" className="section products-home">
        <div className="section-top">
          <div>
            <span className="eyebrow blue">{c("copy-34")}</span>
            <h2>{c("copy-35")}</h2>
          </div>
          <div>
            <p>{c("copy-36")}</p>
            <Link href={c("products-section-url")} className="text-link">
              {c("copy-37")}
            </Link>
          </div>
        </div>
        <div className="home-product-layout">
          <Link href={c("feature-url")} className="feature-product">
            <img loading="lazy" src={c("feature-image") || undefined} alt={c("copy-38")} />
            <div>
              <span className="eyebrow">{c("copy-39")}</span>
              <h3>{c("copy-40")}</h3>
              <span>{c("copy-41")}</span>
            </div>
          </Link>
          {isLoading ? (
            <div className="loading">{c("copy-42")}</div>
          ) : (
            data?.products
              .filter((p) =>
                c("featured-products")
                  .split(",")
                  .map((x) => x.trim())
                  .includes(p.id),
              )
              .map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </div>

      </section>
      <section className="purpose section">
        <div className="purpose-title">
          <span className="eyebrow blue">{c("copy-44")}</span>
          <h2>{c("copy-45")}</h2>
          <p>{c("copy-46")}</p>
        </div>
        <div className="values">
          {[
            [
              PackageCheck,
              "Professional products",
              "منتجات احترافية",
              "Materials selected for professional tyre-service environments.",
              "مواد مخصصة لبيئات خدمة الإطارات الاحترافية.",
            ],
            [
              Layers,
              "Trusted supply",
              "توريد موثوق",
              "A dedicated point of contact for product sourcing and enquiries.",
              "جهة اتصال مخصصة لتوريد المنتجات والاستفسارات.",
            ],
            [
              Focus,
              "Technical focus",
              "تركيز تقني",
              "Focused on tyre repair materials and service requirements.",
              "تركيز على مواد إصلاح الإطارات واحتياجات الخدمة.",
            ],
            [
              MapPin,
              "Kuwait-based",
              "مقرنا الكويت",
              "Local presence for automotive businesses across Kuwait.",
              "حضور محلي لخدمة شركات السيارات في الكويت.",
            ],
          ].map(([Icon, en, a, body, bodyAr]: any) => (
            <div className="value" key={en}>
              <Icon size={22} />

              <h3>{t(en, a)}</h3>
              <p>{t(body, bodyAr)}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="industries-home section">
        <div className="section-top">
          <div>
            <span className="eyebrow blue">{c("copy-47")}</span>
            <h2>{c("copy-48")}</h2>
          </div>
          <Link href={c("industries-section-url")} className="text-link">
            {c("copy-49")}
          </Link>
        </div>
        <div className="industry-strip">
          {data?.content
            .filter((x) => x.type === "industry")
            .map((x) => (
              <Link href={"/industries#" + x.id} key={x.id} className="industry-photo">
                {x.image && <img loading="lazy" src={x.image} alt={t(x.title, x.titleAr)} />}

                <h3>{t(x.title, x.titleAr)}</h3>
              </Link>
            ))}
        </div>
      </section>
      <Location />
      <Reviews />
      <CTA />
    </>
  );
}
